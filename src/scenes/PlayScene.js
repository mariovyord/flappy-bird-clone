import Phaser from "phaser";
import { BaseScene } from "./BaseScene";

const PIPES_TO_RENDER = 4;

export class PlayScene extends BaseScene {
  constructor(config) {
    super("PlayScene", config);
    this.config = config;

    this.bird = null;
    this.pipes = null;
    this.isPaused = false;

    this.pipeHorizontalDistance = 0;
    this.pipeVerticalDistanceRange = [150, 250];
    this.pipeHorizontalDistanceRange = [500, 550];
    this.flapVelocity = 300;

    this.score = 0;
    this.scoreText = "";

    this.currentDifficulty = "easy";
    this.difficulties = {
      easy: {
        pipeHorizontalDistanceRange: [350, 400],
        pipeVerticalDistanceRange: [200, 250],
      },
      normal: {
        pipeHorizontalDistanceRange: [250, 350],
        pipeVerticalDistanceRange: [170, 220],
      },
      hard: {
        pipeHorizontalDistanceRange: [200, 300],
        pipeVerticalDistanceRange: [120, 180],
      },
    };
  }

  create() {
    super.create();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.createPause();
    this.handleInputs();
    this.listenToEvents();

    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("bird", { start: 8, end: 15 }),
      frameRate: 8,
      repeat: -1,
    });

    this.bird.play("fly");
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setScale(3)
      .setFlipX(true)
      .setOrigin(0);

    this.bird.body.gravity.y = 600;
    this.bird.setBodySize(this.bird.width, this.bird.height - 7);
    this.bird.setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(-250);
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  createScore() {
    this.score = 0;
    const bestScore = localStorage.getItem("bestScore");

    this.scoreText = this.add.text(16, 16, `Score ${0}`, {
      fontSize: "28px",
      fill: "#000",
    });
    this.add.text(16, 46, `Best score ${bestScore || 0}`, {
      fontSize: "13px",
      fill: "#000",
    });
  }

  createPause() {
    const pauseBtn = this.add
      .image(this.config.width - 10, this.config.height - 10, "pause")
      .setScale(2)
      .setOrigin(1)
      .setInteractive();

    pauseBtn.on("pointerdown", () => {
      this.physics.pause();
      this.scene.pause();
      this.scene.launch("PauseScene");
      this.isPaused = true;
    });
  }

  handleInputs() {
    this.input.on("pointerdown", this.flap, this);
    this.input.keyboard.on("keydown_SPACE", this.flap, this);
  }

  listenToEvents() {
    if (this.pauseEvent) {
      return;
    }

    this.pauseEvent = this.events.on("resume", () => {
      this.initialTime = 3;
      this.countdownText = this.add
        .text(
          ...this.screenCenter,
          "Fly in: " + this.initialTime,
          this.fontOptions
        )
        .setOrigin(0.5);
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.initialTime--;
          this.countdownText.setText("Fly in " + this.initialTime);
          if (this.initialTime <= 0) {
            this.countdownText.setText("");
            this.physics.resume();
            this.timedEvent.remove();
            this.isPaused = false;
          }
        },
        callbackScope: this,
        loop: true,
      });
    });
  }

  checkGameStatus() {
    if (
      this.bird.getBounds().bottom >= this.config.height ||
      this.bird.y <= 0
    ) {
      this.gameOver();
    }
  }

  increaseDifficulty() {
    if (this.score === 20) {
      this.currentDifficulty = "normal";
    }

    if (this.score === 40) {
      this.currentDifficulty = "hard";
    }
  }

  placePipe(upperPipe, lowerPipe) {
    const difficutly = this.difficulties[this.currentDifficulty];
    const rightMostX = this.getRightMostPipe();
    const pipeVerticalDistance = Phaser.Math.Between(
      ...difficutly.pipeVerticalDistanceRange
    );
    const pipeVerticalPosition = Phaser.Math.Between(
      0 + 20,
      this.config.height - 20 - pipeVerticalDistance
    );
    const pipeHorizontalDistance = Phaser.Math.Between(
      ...difficutly.pipeHorizontalDistanceRange
    );

    upperPipe.x = rightMostX + pipeHorizontalDistance;
    upperPipe.y = pipeVerticalPosition;

    lowerPipe.x = upperPipe.x;
    lowerPipe.y = upperPipe.y + pipeVerticalDistance;
  }

  recyclePipes() {
    const tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
          this.increaseScore();
          this.setBestScore();
          this.increaseDifficulty();
        }
      }
    });
  }

  getRightMostPipe() {
    let rightMostX = 0;

    this.pipes
      .getChildren()
      .forEach((pipe) => (rightMostX = Math.max(pipe.x, rightMostX)));

    return rightMostX;
  }

  setBestScore() {
    const bestScoreText = localStorage.getItem("bestScore");
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);

    if (!bestScore || this.score > bestScore) {
      localStorage.setItem("bestScore", this.score);
    }
  }

  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xee4824);

    this.setBestScore();

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false,
    });

    this.currentDifficulty = "easy";
  }

  flap() {
    if (this.isPaused === false) {
      this.bird.body.velocity.y = -this.flapVelocity;
    }
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score ${this.score}`);
  }
}
