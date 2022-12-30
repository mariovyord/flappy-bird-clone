import Phaser from "phaser";
import { MenuScene } from "./scenes/MenuScene";
import { PauseScene } from "./scenes/PauseScene";
import { PlayScene } from "./scenes/PlayScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { ScoreScene } from "./scenes/ScoreScene";

const WIDTH = 400;
const HEIGHT = 600;
const BIRD_POSITION = { x: WIDTH / 10, y: HEIGHT / 2 };

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION,
};

const scenes = [PreloadScene, MenuScene, ScoreScene, PlayScene, PauseScene];

const initScenes = () => scenes.map((x) => new x(SHARED_CONFIG));

const config = {
  type: Phaser.AUTO,
  pixelArt: true,
  ...SHARED_CONFIG,
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
    },
  },
  scene: initScenes(),
};

new Phaser.Game(config);
