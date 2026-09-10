import * as Phaser from 'phaser';

export class BattleScene extends Phaser.Scene {
  private enemyHp = 100;
  private enemyHpBar!: Phaser.GameObjects.Rectangle;
  private statusText!: Phaser.GameObjects.Text;

  constructor() {
    super('BattleScene');
  }

  create() {
    const { width } = this.scale;
    this.enemyHp = 100;
    this.cameras.main.setBackgroundColor('#0b0d12');

    this.add.text(20, 22, 'БОЙ', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      color: '#b8c0ca',
      fontStyle: 'bold',
    });

    this.add.text(width - 20, 22, 'Волки • 2', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '13px',
      color: '#8f99a7',
    }).setOrigin(1, 0);

    this.add.rectangle(width / 2, 302, width - 24, 510, 0x11161d, 1)
      .setStrokeStyle(1, 0x3f4855, 0.65);

    this.createWolf(132, 172, 'ВОЛК I');
    this.createWolf(258, 172, 'ВОЛК II');

    this.add.rectangle(width / 2, 250, 220, 9, 0x252a31, 1);
    this.enemyHpBar = this.add.rectangle(width / 2 - 108, 250, 216, 7, 0x8e554d, 1)
      .setOrigin(0, 0.5);

    this.add.circle(width / 2, 402, 42, 0x394654, 1)
      .setStrokeStyle(2, 0xbec6d0, 0.75);
    this.add.text(width / 2, 402, 'АДАМ', {
      fontFamily: 'Georgia, serif',
      fontSize: '17px',
      color: '#f0e7d6',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 468, '100 / 100 HP', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '13px',
      color: '#b8c4ce',
    }).setOrigin(0.5);

    this.statusText = this.add.text(width / 2, 520, 'Выберите действие', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      color: '#aeb6c1',
    }).setOrigin(0.5);

    this.createActionButton(76, 600, 104, 52, 'УДАР', () => this.attack());
    this.createActionButton(195, 600, 104, 52, 'ЩИТ', () => {
      this.statusText.setText('Адам готовится блокировать удар');
    });
    this.createActionButton(314, 600, 104, 52, 'УМЕНИЕ', () => {
      this.statusText.setText('Умение пока не открыто');
    });

    const slots = [82, 158, 234, 310];
    slots.forEach((x, index) => {
      this.add.circle(x, 704, 23, index === 0 ? 0x3d4a59 : 0x181e26, 1)
        .setStrokeStyle(1, index === 0 ? 0xc2ad7e : 0x48515d, index === 0 ? 0.85 : 0.5);
      this.add.text(x, 704, index === 0 ? 'А' : '+', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: index === 0 ? '17px' : '18px',
        color: index === 0 ? '#efe6d3' : '#697482',
      }).setOrigin(0.5);
    });
  }

  private createWolf(x: number, y: number, label: string) {
    this.add.ellipse(x, y, 72, 48, 0x3a3d42, 1)
      .setStrokeStyle(1, 0x737983, 0.75);
    this.add.triangle(x - 22, y - 26, 0, 22, 10, 0, 20, 22, 0x3a3d42, 1);
    this.add.triangle(x + 22, y - 26, 0, 22, 10, 0, 20, 22, 0x3a3d42, 1);
    this.add.circle(x - 12, y - 3, 2, 0xd3b06e, 1);
    this.add.circle(x + 12, y - 3, 2, 0xd3b06e, 1);
    this.add.text(x, y + 39, label, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '10px',
      color: '#8f98a4',
    }).setOrigin(0.5);
  }

  private createActionButton(
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    onPress: () => void,
  ) {
    const button = this.add.rectangle(x, y, w, h, 0x232c37, 1)
      .setStrokeStyle(1, 0x8f7d5d, 0.7)
      .setInteractive({ useHandCursor: true });

    this.add.text(x, y, label, {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '13px',
      color: '#f0e8d8',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    button.on('pointerover', () => button.setFillStyle(0x2e3946));
    button.on('pointerout', () => button.setFillStyle(0x232c37));
    button.on('pointerdown', onPress);
  }

  private attack() {
    this.enemyHp = Math.max(0, this.enemyHp - 34);
    this.enemyHpBar.width = 216 * (this.enemyHp / 100);
    this.statusText.setText(this.enemyHp > 0 ? `Урон: 34 • Волки: ${this.enemyHp}%` : 'Победа');

    if (this.enemyHp === 0) {
      this.time.delayedCall(550, () => this.scene.start('RewardScene'));
    }
  }
}
