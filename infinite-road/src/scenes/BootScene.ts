import * as Phaser from 'phaser';
import { DESIGN_HEIGHT, DESIGN_WIDTH, useFullscreenDesign } from '../ui/responsive';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    useFullscreenDesign(this);
    this.cameras.main.setBackgroundColor('#26343b');
    const title = this.add.text(195, 366, 'ПОВЕЛИТЕЛЬ ТАЙН', {
      fontFamily: 'Georgia, serif', fontSize: '27px', color: '#f0e2c6', fontStyle: 'bold', letterSpacing: 2,
    }).setOrigin(0.5);
    const subtitle = this.add.text(195, 410, 'ТИХАЯ ДОЛИНА', {
      fontFamily: 'system-ui', fontSize: '10px', color: '#e8c98d', fontStyle: 'bold', letterSpacing: 2,
    }).setOrigin(0.5);

    title.setAlpha(0); subtitle.setAlpha(0);
    this.tweens.add({ targets: [title, subtitle], alpha: 1, duration: 500, hold: 260, yoyo: true, onComplete: () => this.scene.start('MainMenuScene') });
  }
}
