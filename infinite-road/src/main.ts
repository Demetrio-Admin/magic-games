import * as Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { RoadScene } from './scenes/RoadScene';
import { BattleScene } from './scenes/BattleScene';
import { RewardScene } from './scenes/RewardScene';

const viewportWidth = Math.max(1, window.visualViewport?.width ?? window.innerWidth);
const viewportHeight = Math.max(1, window.visualViewport?.height ?? window.innerHeight);
const logicalHeight = Math.round(
  Phaser.Math.Clamp(390 * (viewportHeight / viewportWidth), 620, 900),
);

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  parent: 'app',
  width: 390,
  height: logicalHeight,
  backgroundColor: '#071516',
  scene: [RoadScene, BattleScene, RewardScene, MainMenuScene, BootScene],
  scale: {
    mode: Phaser.Scale.NONE,
    width: 390,
    height: logicalHeight,
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: false,
  },
};

new Phaser.Game(config);
