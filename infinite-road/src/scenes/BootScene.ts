import * as Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#090b10');

    const title = this.add.text(195, 360, 'БЕСКОНЕЧНЫЙ ПУТЬ', {
      fontFamily: 'Georgia, serif',
      fontSize: '28px',
      color: '#f2ead7',
      letterSpacing: 2,
    }).setOrigin(0.5);

    title.setAlpha(0);
    this.tweens.add({
      targets: title,
      alpha: 1,
      duration: 650,
      yoyo: true,
      hold: 350,
      onComplete: () => this.scene.start('MainMenuScene'),
    });
  }
}
