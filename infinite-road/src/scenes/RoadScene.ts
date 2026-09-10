import Phaser from 'phaser';

export class RoadScene extends Phaser.Scene {
  constructor() {
    super('RoadScene');
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#0a0d12');

    // Header
    this.add.text(22, 24, 'ПУТЬ • 01', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      color: '#aeb6c1',
      fontStyle: 'bold',
    });

    this.add.text(width - 22, 24, '✦ 120', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      color: '#d9c18a',
    }).setOrigin(1, 0);

    // World window
    this.add.rectangle(width / 2, 315, width - 28, 500, 0x111821, 1)
      .setStrokeStyle(1, 0x44505f, 0.55);

    // Distant haze / horizon
    this.add.rectangle(width / 2, 115, width - 30, 115, 0x17212a, 1);
    this.add.circle(305, 108, 34, 0xd5c590, 0.13);

    // Road, deliberately broad enough for later encounters / props
    this.add.polygon(width / 2, 330, [
      -38, -220,
      38, -220,
      132, 220,
      -132, 220,
    ], 0x25272a, 1);

    this.add.polygon(width / 2, 330, [
      -25, -220,
      25, -220,
      100, 220,
      -100, 220,
    ], 0x323337, 1);

    // Encounter marker ahead
    this.add.circle(width / 2, 220, 28, 0x1b222b, 1)
      .setStrokeStyle(2, 0xb49965, 0.85);
    this.add.text(width / 2, 220, '!', {
      fontFamily: 'Georgia, serif',
      fontSize: '28px',
      color: '#e4d3ae',
    }).setOrigin(0.5);

    // Adam on the road
    this.add.circle(width / 2, 455, 29, 0x3b4654, 1)
      .setStrokeStyle(2, 0xb5c0cc, 0.7);
    this.add.text(width / 2, 455, 'А', {
      fontFamily: 'Georgia, serif',
      fontSize: '26px',
      color: '#f2eadb',
    }).setOrigin(0.5);
    this.add.ellipse(width / 2, 500, 64, 16, 0x000000, 0.35);

    this.add.text(width / 2, 545, 'Впереди слышится рычание.', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      color: '#b7bec8',
    }).setOrigin(0.5);

    const forward = this.add.rectangle(width / 2, 600, 190, 54, 0x252f3b, 1)
      .setStrokeStyle(1, 0xc2a66f, 0.8)
      .setInteractive({ useHandCursor: true });

    this.add.text(width / 2, 600, 'ВПЕРЁД', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '17px',
      color: '#f3ead7',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    forward.on('pointerdown', () => this.scene.start('BattleScene'));

    // Four party slots: Adam + space reserved for three future heroes.
    const slots = [82, 158, 234, 310];
    slots.forEach((x, index) => {
      this.add.circle(x, 704, 25, index === 0 ? 0x394756 : 0x181e26, 1)
        .setStrokeStyle(1, index === 0 ? 0xc4b184 : 0x48515d, index === 0 ? 0.9 : 0.55);
      this.add.text(x, 704, index === 0 ? 'А' : '+', {
        fontFamily: 'system-ui, sans-serif',
        fontSize: index === 0 ? '18px' : '20px',
        color: index === 0 ? '#f0e7d5' : '#697482',
      }).setOrigin(0.5);
    });
  }
}
