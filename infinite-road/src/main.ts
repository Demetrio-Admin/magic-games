import * as Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { RoadScene } from './scenes/RoadScene';
import { BattleScene } from './scenes/BattleScene';
import { RewardScene } from './scenes/RewardScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  parent: 'app',
  width: 390,
  height: 844,
  backgroundColor: '#071516',
  scene: [RoadScene, BattleScene, RewardScene, MainMenuScene, BootScene],
  scale: {
    parent: 'app',
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%',
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: false,
  },
};

new Phaser.Game(config);
