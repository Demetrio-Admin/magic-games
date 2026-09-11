import * as Phaser from 'phaser';

export class RewardScene extends Phaser.Scene {
  constructor() {
    super('RewardScene');
  }

  create() {
    const { width } = this.scale;
    const herb = Boolean(this.registry.get('herbCollected'));
    this.cameras.main.setBackgroundColor('#26343b');

    this.add.rectangle(width / 2, 390, width - 28, 730, 0x34434b, 1).setStrokeStyle(1, 0x718087, 0.42);
    this.add.text(width / 2, 118, 'ПОБЕДА', {
      fontFamily: 'Georgia, serif', fontSize: '38px', color: '#f0e2c6', fontStyle: 'bold', letterSpacing: 2,
    }).setOrigin(0.5);
    this.add.text(width / 2, 172, 'Старая дорога свободна', { fontFamily: 'system-ui', fontSize: '15px', color: '#d2d6d4' }).setOrigin(0.5);

    this.add.rectangle(width / 2, 348, 320, 242, 0x26343b, 0.88).setStrokeStyle(1, 0xe8c98d, 0.42);
    this.add.text(54, 248, 'НАГРАДА', { fontFamily: 'system-ui', fontSize: '10px', color: '#9eabad', fontStyle: 'bold', letterSpacing: 1 });
    this.rewardRow(54, 289, '✦', '+1', 'Очко магии');
    if (herb) this.rewardRow(54, 344, '❧', '×1', 'Лечебная трава');
    this.rewardRow(54, herb ? 399 : 344, '◆', '×1', 'Клык вожака');

    this.add.text(width / 2, 502, 'Новый путь станет доступен после улучшения «Толчка».', {
      fontFamily: 'system-ui', fontSize: '12px', color: '#aeb8b9', align: 'center', wordWrap: { width: 300 }, lineSpacing: 4,
    }).setOrigin(0.5);

    const back = this.add.rectangle(width / 2, 650, 320, 56, 0xe8c98d, 1).setInteractive({ useHandCursor: true });
    this.add.text(width / 2, 650, 'ВЕРНУТЬСЯ В БАШНЮ', { fontFamily: 'system-ui', fontSize: '13px', color: '#26343b', fontStyle: 'bold' }).setOrigin(0.5);
    back.on('pointerdown', () => {
      this.registry.set('roadStep', 0);
      this.registry.set('herbCollected', false);
      this.registry.set('encounterFound', false);
      this.registry.set('battleStage', 0);
      this.scene.start('MainMenuScene');
    });
  }

  private rewardRow(x: number, y: number, icon: string, amount: string, label: string) {
    this.add.circle(x + 19, y, 18, 0x46545a, 1).setStrokeStyle(1, 0xe8c98d, 0.5);
    this.add.text(x + 19, y, icon, { fontFamily: 'Georgia, serif', fontSize: '16px', color: '#e8c98d' }).setOrigin(0.5);
    this.add.text(x + 53, y - 12, label, { fontFamily: 'Georgia, serif', fontSize: '14px', color: '#f0e2c6', fontStyle: 'bold' });
    this.add.text(x + 53, y + 9, amount, { fontFamily: 'system-ui', fontSize: '10px', color: '#aeb8b9' });
  }
}
