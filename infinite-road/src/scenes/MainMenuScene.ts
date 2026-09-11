import * as Phaser from 'phaser';
import { DESIGN_HEIGHT, DESIGN_WIDTH, useFullscreenDesign } from '../ui/responsive';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    useFullscreenDesign(this);
    const width = DESIGN_WIDTH;
    const height = DESIGN_HEIGHT;
    this.cameras.main.setBackgroundColor('#26343b');

    this.add.rectangle(width / 2, height / 2, width, height, 0x1b2a31, 1);
    this.add.rectangle(width / 2, 420, width - 36, 500, 0x26343b, 1).setStrokeStyle(1, 0x718087, 0.35);

    const g = this.add.graphics();
    g.fillStyle(0x182329, 1);
    g.fillTriangle(22, 520, 112, 230, 188, 520);
    g.fillTriangle(128, 520, 270, 190, 368, 520);
    g.fillStyle(0x32484c, 1);
    g.fillTriangle(96, 520, 195, 300, 270, 520);
    g.fillStyle(0x8f7c58, 0.65);
    g.fillTriangle(157, 520, 195, 300, 226, 520);

    this.add.text(width / 2, 82, 'ПОВЕЛИТЕЛЬ ТАЙН', {
      fontFamily: 'Georgia, serif', fontSize: '30px', color: '#f0e2c6', fontStyle: 'bold', letterSpacing: 1,
    }).setOrigin(0.5);
    this.add.text(width / 2, 130, 'ТИХАЯ ДОЛИНА', {
      fontFamily: 'system-ui', fontSize: '11px', color: '#e8c98d', fontStyle: 'bold', letterSpacing: 2,
    }).setOrigin(0.5);
    this.add.text(width / 2, 177, 'Вертикальный срез · Старая дорога', {
      fontFamily: 'system-ui', fontSize: '13px', color: '#d2d6d4',
    }).setOrigin(0.5);

    this.add.rectangle(width / 2, 638, width - 50, 126, 0x26343b, 0.96).setStrokeStyle(1, 0x7b898f, 0.35);
    this.add.text(width / 2, 606, 'Адам готов отправиться к воротам Тихой долины.', {
      fontFamily: 'system-ui', fontSize: '12px', color: '#d2d6d4', align: 'center', wordWrap: { width: 300 },
    }).setOrigin(0.5);

    const start = this.add.rectangle(width / 2, 676, width - 80, 50, 0xe8c98d, 1).setInteractive({ useHandCursor: true });
    this.add.text(width / 2, 676, 'ВЫЙТИ НА СТАРУЮ ДОРОГУ', {
      fontFamily: 'system-ui', fontSize: '12px', color: '#26343b', fontStyle: 'bold', letterSpacing: 0.7,
    }).setOrigin(0.5);
    start.on('pointerdown', () => {
      this.registry.set('roadStep', 0);
      this.registry.set('herbCollected', false);
      this.registry.set('encounterFound', false);
      this.scene.start('RoadScene');
    });
  }
}
