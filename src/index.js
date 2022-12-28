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
let upperPipe = null;
let lowerPipe = null;
let pipeHorizontalDistance = 0;
const pipeVerticalDistanceRange = [150, 250];

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}

function create() {
  this.add.image(0, 0, 'sky').setOrigin(0, 0);
  
  bird = this.physics.add.sprite(INITIAL_BIRD_POSITION.x, INITIAL_BIRD_POSITION.y, 'bird').setOrigin(0);
  bird.body.gravity.y = 400;
  
  
  for (let i = 0; i < PIPES_TO_RENDER; i++) {
     pipeHorizontalDistance += 400;

    let pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
    let pipeVerticalPosition = Phaser.Math.Between((0 + 20), (config.height - 20 - pipeVerticalDistance));

    upperPipe = this.physics.add.sprite(pipeHorizontalDistance, pipeVerticalPosition, 'pipe').setOrigin(0, 1);
    lowerPipe = this.physics.add.sprite(pipeHorizontalDistance, (upperPipe.y + pipeVerticalDistance), 'pipe').setOrigin(0, 0);

    upperPipe.body.velocity.x = -200;
    lowerPipe.body.velocity.x = -200;
  }

  this.input.on('pointerdown', flap);
  this.input.keyboard.on('keydown_SPACE', flap);
}

function update(time, delta) {
  if (bird.y > config.height || bird.y < (0 - bird.height)) {
    restartBirdPosition();
  }
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