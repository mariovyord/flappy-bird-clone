import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 400, }
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

const VELOCITY = 200;
const INITIAL_BIRD_POSITION = { x: config.width / 10, y: config.height / 2 }

let bird = null;
let flapVelocity = 150;

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
}

function create() {
  this.add.image(0, 0, 'sky').setOrigin(0, 0);

  // config bird
  bird = this.physics.add.sprite(INITIAL_BIRD_POSITION.x, INITIAL_BIRD_POSITION.y, 'bird').setOrigin(0);

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