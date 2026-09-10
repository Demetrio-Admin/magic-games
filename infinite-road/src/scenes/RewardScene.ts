import Phaser from 'phaser';

export class RewardScene extends Phaser.Scene {
  constructor() {
    super('RewardScene');
  }

  create() {
    const { width } = this.scale;
    this.cameras.main.setBackgroundColor('#0b0e13');

    this.add.text(width / 2, 170, 'ПОБЕДА', {
      fontFamily: 'Georgia, serif',
      fontSize: '36px',
      color: '#eee4d0',
      letterSpacing: 2,
    }).setOrigin(0.5);

    this.add.text(width / 2, 245, 'Дорога снова открыта.', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '15px',
      color: '#aeb6c1',
    }).setOrigin(0.5);

    this.add.rectangle(width / 2, 360, 260, 118, 0x151b23, 1)
      .setStrokeStyle(1, 0x8d7957, 0.65);

    this.add.text(width / 2, 335, 'НАГРАДА', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '12px',
      color: '#8e98a4',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 382, '✦ 35   •   опыт +20', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '17px',
      color: '#e1cf9e',
    }).setOrigin(0.5);

    const back = this.add.rectangle(width / 2, 590, 220, 58, 0x252f3b, 1)
      .setStrokeStyle(1, 0xc2a66f, 0.8)
      .setInteractive({ useHandCursor: true });

    this.add.text(width / 2, 590, 'ПРОДОЛЖИТЬ ПУТЬ', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      color: '#f3ead7',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    back.on('pointerdown', () => this.scene.start('RoadScene'));
  }
}
