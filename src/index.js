import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

const VELOCITY = 200;
const PIPES_TO_RENDER = 4;
const INITIAL_BIRD_POSITION = { x: config.width / 10, y: config.height / 2 }

let bird = null;
let pipes = null;
let pipeHorizontalDistance = 0;
const pipeVerticalDistanceRange = [150, 250];
const pipeHorizontalDistanceRange = [400, 500];

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}

function create() {
  this.add.image(0, 0, 'sky').setOrigin(0, 0);
  
  bird = this.physics.add.sprite(INITIAL_BIRD_POSITION.x, INITIAL_BIRD_POSITION.y, 'bird').setOrigin(0);
  bird.body.gravity.y = 400;
  
  pipes = this.physics.add.group();

  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    const upperPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 1);
    const lowerPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 0);
     
    placePipe(upperPipe, lowerPipe);
  }

  pipes.setVelocityX(-200);

  console.log(pipes)

  this.input.on('pointerdown', flap);
  this.input.keyboard.on('keydown_SPACE', flap);
}

function update(time, delta) {
  if (bird.y > config.height || bird.y < (0 - bird.height)) {
    restartBirdPosition();
  }

  recyclePipes();
}

function placePipe(upperPipe, lowerPipe) {
    const rightMostX = getRightMostPipe();
    let pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
    let pipeVerticalPosition = Phaser.Math.Between((0 + 20), (config.height - 20 - pipeVerticalDistance));
    let pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange);

    upperPipe.x = rightMostX + pipeHorizontalDistance;
    upperPipe.y = pipeVerticalPosition;

    lowerPipe.x = upperPipe.x;
    lowerPipe.y = upperPipe.y + pipeVerticalDistance
}

function recyclePipes() {
  const tempPipes = [];

  pipes.getChildren().forEach(pipe => {
    if (pipe.getBounds().right <= 0) {
      tempPipes.push(pipe);

      if (tempPipes.length === 2) {
        placePipe(...tempPipes);
      }
    }
  })
}

function getRightMostPipe() {
  let rightMostX = 0;

  pipes.getChildren().forEach((pipe) => {
    rightMostX = Math.max(pipe.x, rightMostX);
  })

  return rightMostX;
}

function restartBirdPosition() {
  bird.x = INITIAL_BIRD_POSITION.x;
  bird.y = INITIAL_BIRD_POSITION.y
  bird.body.velocity.y = 0;
}

function flap() {
  bird.body.velocity.y = -VELOCITY;
}

new Phaser.Game(config);