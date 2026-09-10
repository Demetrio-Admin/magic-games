import * as Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#0b0e14');

    this.add.rectangle(width / 2, height / 2, width - 24, height - 24, 0x111720, 1)
      .setStrokeStyle(1, 0x78694f, 0.45);

    this.add.text(width / 2, 145, 'БЕСКОНЕЧНЫЙ\nПУТЬ', {
      fontFamily: 'Georgia, serif',
      fontSize: '38px',
      color: '#eee4d1',
      align: 'center',
      lineSpacing: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, 240, 'Тёмная дорога помнит тех,\nкто по ней уже проходил.', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '15px',
      color: '#9da6b3',
      align: 'center',
      lineSpacing: 7,
    }).setOrigin(0.5);

    const start = this.add.rectangle(width / 2, 610, 250, 62, 0x222b36, 1)
      .setStrokeStyle(1, 0xc2a66f, 0.8)
      .setInteractive({ useHandCursor: true });

    this.add.text(width / 2, 610, 'НАЧАТЬ ПУТЬ', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px',
      color: '#f3ead7',
      fontStyle: 'bold',
      letterSpacing: 1,
    }).setOrigin(0.5);

    start.on('pointerover', () => start.setFillStyle(0x2c3744));
    start.on('pointerout', () => start.setFillStyle(0x222b36));
    start.on('pointerdown', () => this.scene.start('RoadScene'));
  }
}
