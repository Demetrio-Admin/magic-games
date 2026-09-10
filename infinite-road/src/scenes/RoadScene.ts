import * as Phaser from 'phaser';
import { FONT, UI } from '../ui/theme';

type ModalKind = 'map' | 'bag';

type TravelBeat = {
  title: string;
  text: string;
  action: string;
  hint: string;
};

const BEATS: TravelBeat[] = [
  {
    title: 'Шепчущий лес',
    text: 'Старая дорога ныряет под кроны. Влажный воздух пахнет мхом и дождём.',
    action: 'Идти дальше',
    hint: 'Следы ведут к воротам долины',
  },
  {
    title: 'Свежие следы',
    text: 'На размокшей земле — крупные отпечатки лап. Они совсем свежие.',
    action: 'Осмотреть следы',
    hint: 'Угроза впереди',
  },
  {
    title: 'Волки у ворот',
    text: 'Из тумана выходят два зверя. Один остаётся в тени и наблюдает.',
    action: 'Вступить в бой',
    hint: 'Высокий риск',
  },
];

export class RoadScene extends Phaser.Scene {
  private selectedHero = 0;
  private beat = 0;
  private modal?: Phaser.GameObjects.Container;
  private actionLabel?: Phaser.GameObjects.Text;
  private actionHint?: Phaser.GameObjects.Text;
  private primarySurface?: Phaser.GameObjects.Rectangle;

  constructor() {
    super('RoadScene');
  }

  create() {
    this.beat = Phaser.Math.Clamp(Number(this.registry.get('travelBeat') ?? 0), 0, BEATS.length - 1);
    this.selectedHero = Number(this.registry.get('selectedHero') ?? 0);

    this.cameras.main.setBackgroundColor(UI.colors.worldDeep);
    this.drawWorld();
    this.drawTopChrome();
    this.drawNarrative();
    this.drawParty();
    this.drawActionSurface();
  }

  private drawWorld() {
    const g = this.add.graphics();

    // Sky / atmospheric depth.
    g.fillStyle(0x102d2c, 1).fillRect(0, 0, UI.width, 250);
    g.fillStyle(0x163b36, 1).fillRect(0, 120, UI.width, 150);
    g.fillStyle(0x244b40, 1).fillRect(0, 210, UI.width, 120);

    // Distant hills.
    g.fillStyle(0x17352f, 1);
    g.fillTriangle(0, 310, 94, 164, 205, 310);
    g.fillTriangle(128, 310, 263, 143, 390, 310);
    g.fillStyle(0x102a27, 1);
    g.fillTriangle(-30, 336, 110, 210, 250, 336);
    g.fillTriangle(172, 336, 315, 198, 430, 336);

    // Forest walls.
    g.fillStyle(0x0b201f, 1);
    for (let i = 0; i < 8; i++) {
      const lx = i * 34 - 18;
      const rx = UI.width - i * 31 + 8;
      g.fillTriangle(lx, 505, lx + 30, 220 + (i % 3) * 18, lx + 62, 505);
      g.fillTriangle(rx - 55, 500, rx - 28, 205 + (i % 2) * 22, rx + 5, 500);
    }

    // Ground and road.
    g.fillStyle(0x102622, 1).fillRect(0, 330, UI.width, 320);
    g.fillStyle(0x273228, 1);
    g.fillTriangle(145, 650, 198, 290, 252, 650);
    g.fillStyle(0x384333, 0.78);
    g.fillTriangle(166, 650, 198, 315, 230, 650);

    // Mossy roadside shapes.
    for (let i = 0; i < 14; i++) {
      const y = 360 + i * 21;
      const spread = 54 + i * 7;
      this.add.circle(195 - spread, y, 10 + (i % 3) * 5, 0x1a3e31, 0.9);
      this.add.circle(195 + spread, y + 8, 9 + (i % 4) * 4, 0x18372e, 0.92);
    }

    // Quiet magical light — local, not neon.
    const moonGlow = this.add.circle(300, 126, 60, UI.colors.turquoise, 0.07);
    this.add.circle(300, 126, 29, 0xb4d7cb, 0.11);
    this.tweens.add({
      targets: moonGlow,
      alpha: { from: 0.045, to: 0.10 },
      scale: { from: 0.96, to: 1.08 },
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });

    // Fog layers.
    for (let i = 0; i < 5; i++) {
      const fog = this.add.ellipse(46 + i * 88, 300 + (i % 2) * 28, 160, 34, UI.colors.fog, 0.035);
      this.tweens.add({ targets: fog, x: fog.x + 18, duration: 4200 + i * 450, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    }

    // Firefly-like magic specks.
    for (let i = 0; i < 10; i++) {
      const p = this.add.circle(48 + ((i * 67) % 300), 180 + ((i * 83) % 300), i % 3 === 0 ? 2.2 : 1.5, UI.colors.emerald, 0.18 + (i % 4) * 0.05);
      this.tweens.add({ targets: p, alpha: { from: 0.10, to: 0.48 }, y: p.y - 8, duration: 1500 + i * 120, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    }

    if (this.beat >= 1) this.drawTracks();
    if (this.beat >= 2) this.drawEncounterSilhouettes();
  }

  private drawTopChrome() {
    const panel = this.add.rectangle(UI.width / 2, 44, UI.width - UI.safe * 2, 56, UI.colors.surface, 0.76)
      .setStrokeStyle(1, UI.colors.metal, 0.34);
    panel.setDepth(20);

    this.add.text(28, 27, 'ТИХАЯ ДОЛИНА', {
      fontFamily: FONT.sans,
      fontSize: '9px',
      color: UI.colors.textMuted,
      fontStyle: 'bold',
      letterSpacing: 1.4,
    }).setDepth(21);

    this.add.text(28, 42, 'Старая дорога', {
      fontFamily: FONT.serif,
      fontSize: '17px',
      color: UI.colors.text,
      fontStyle: 'bold',
    }).setDepth(21);

    const rune = this.add.circle(347, 44, 17, UI.colors.surfaceRaised, 1)
      .setStrokeStyle(1, UI.colors.metal, 0.42)
      .setDepth(21);
    this.add.text(rune.x, rune.y - 1, '◇', {
      fontFamily: FONT.serif,
      fontSize: '18px',
      color: '#74d1aa',
    }).setOrigin(0.5).setDepth(22);
  }

  private drawNarrative() {
    const beat = BEATS[this.beat];

    this.add.rectangle(UI.width / 2, 570, 358, 126, UI.colors.surface, 0.74)
      .setStrokeStyle(1, UI.colors.metal, 0.28)
      .setDepth(15);

    this.add.text(28, 522, beat.title, {
      fontFamily: FONT.serif,
      fontSize: '21px',
      color: UI.colors.text,
      fontStyle: 'bold',
    }).setDepth(16);

    this.add.text(28, 555, beat.text, {
      fontFamily: FONT.sans,
      fontSize: '12px',
      color: UI.colors.textMuted,
      wordWrap: { width: 334 },
      lineSpacing: 4,
    }).setDepth(16);
  }

  private drawParty() {
    const totalWidth = UI.hero.width * 4 + UI.hero.gap * 3;
    const startX = (UI.width - totalWidth) / 2 + UI.hero.width / 2;
    const y = 700;

    for (let i = 0; i < 4; i++) {
      const x = startX + i * (UI.hero.width + UI.hero.gap);
      this.drawHeroCard(x, y, i);
    }
  }

  private drawHeroCard(x: number, y: number, index: number) {
    const selected = index === this.selectedHero;
    const unlocked = index === 0;
    const card = this.add.rectangle(x, y, UI.hero.width, UI.hero.height, UI.colors.surface, 0.93)
      .setStrokeStyle(selected ? 2 : 1, selected ? UI.colors.emerald : UI.colors.metalSoft, selected ? 0.95 : 0.42)
      .setInteractive({ useHandCursor: true })
      .setDepth(30);

    const portraitY = y - 16;
    this.add.circle(x, portraitY - 6, 20, unlocked ? 0x435a50 : 0x263432, 1).setDepth(31);
    this.add.circle(x, portraitY - 11, 7, unlocked ? 0xc9bda7 : 0x52605b, 1).setDepth(32);
    if (unlocked) {
      this.add.rectangle(x, portraitY + 8, 24, 18, 0x394b45, 1).setDepth(32);
      this.add.text(x, portraitY + 28, 'АДАМ', { fontFamily: FONT.sans, fontSize: '8px', color: UI.colors.text, fontStyle: 'bold' }).setOrigin(0.5).setDepth(32);
    } else {
      this.add.text(x, portraitY + 4, '+', { fontFamily: FONT.sans, fontSize: '18px', color: UI.colors.textDim }).setOrigin(0.5).setDepth(32);
    }

    this.add.text(x - 22, y - 35, unlocked ? '✦' : '·', {
      fontFamily: FONT.serif,
      fontSize: '11px',
      color: unlocked ? '#72d3aa' : UI.colors.textDim,
    }).setDepth(33);

    this.add.rectangle(x, y + 33, 48, 4, UI.colors.hpBack, 1).setDepth(31);
    this.add.rectangle(x - 24, y + 33, unlocked ? 44 : 0, 3, UI.colors.hp, unlocked ? 1 : 0).setOrigin(0, 0.5).setDepth(32);

    card.on('pointerdown', () => {
      if (!unlocked) {
        this.showToast('Свободный слот отряда');
        return;
      }
      this.registry.set('selectedHero', index);
      this.selectedHero = index;
      this.scene.restart();
    });
  }

  private drawActionSurface() {
    const y = UI.height - UI.safe - UI.action.height / 2;
    const width = UI.width - UI.safe * 2;
    const centerWidth = width - UI.action.quickWidth * 2;

    this.add.rectangle(UI.width / 2, y, width, UI.action.height, UI.colors.surface, 0.97)
      .setStrokeStyle(1, UI.colors.metal, 0.52)
      .setDepth(40);

    this.drawQuickAction(UI.safe + UI.action.quickWidth / 2, y, '⌁', 'Карта', () => this.openModal('map'));
    this.drawQuickAction(UI.width - UI.safe - UI.action.quickWidth / 2, y, '◇', 'Сумка', () => this.openModal('bag'));

    this.add.line(UI.safe + UI.action.quickWidth, y - 25, 0, 0, 0, 50, UI.colors.metal, 0.22).setDepth(41);
    this.add.line(UI.width - UI.safe - UI.action.quickWidth, y - 25, 0, 0, 0, 50, UI.colors.metal, 0.22).setDepth(41);

    this.primarySurface = this.add.rectangle(UI.width / 2, y, centerWidth, UI.action.height - 8, UI.colors.surfaceRaised, 0.94)
      .setInteractive({ useHandCursor: true })
      .setDepth(41);

    this.add.text(UI.width / 2, y - 22, '⌇', {
      fontFamily: FONT.serif,
      fontSize: '13px',
      color: '#6fd2a7',
    }).setOrigin(0.5).setDepth(42);

    const beat = BEATS[this.beat];
    this.actionLabel = this.add.text(UI.width / 2, y - 5, beat.action, {
      fontFamily: FONT.sans,
      fontSize: '13px',
      color: UI.colors.text,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(42);

    this.actionHint = this.add.text(UI.width / 2, y + 17, beat.hint, {
      fontFamily: FONT.sans,
      fontSize: '9px',
      color: this.beat === 2 ? '#caa06d' : UI.colors.textMuted,
    }).setOrigin(0.5).setDepth(42);

    this.primarySurface.on('pointerdown', () => this.pressPrimary());
  }

  private drawQuickAction(x: number, y: number, icon: string, label: string, callback: () => void) {
    const zone = this.add.rectangle(x, y, UI.action.quickWidth, UI.action.height, UI.colors.surface, 0.01)
      .setInteractive({ useHandCursor: true })
      .setDepth(43);

    this.add.text(x, y - 13, icon, {
      fontFamily: FONT.serif,
      fontSize: '16px',
      color: '#6ebf9d',
    }).setOrigin(0.5).setDepth(44);
    this.add.text(x, y + 14, label, {
      fontFamily: FONT.sans,
      fontSize: '9px',
      color: UI.colors.textMuted,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(44);

    zone.on('pointerdown', () => {
      this.tweens.add({ targets: zone, scaleX: 0.94, scaleY: 0.94, duration: 70, yoyo: true, onComplete: callback });
    });
  }

  private pressPrimary() {
    if (!this.primarySurface || !this.actionLabel || !this.actionHint) return;

    this.primarySurface.setFillStyle(UI.colors.surfacePressed, 1);
    this.primarySurface.setStrokeStyle(1, UI.colors.metal, 0.36);
    this.actionHint.setText('Путь откликается…').setColor('#7ccaaa');

    const line = this.add.rectangle(UI.width / 2, UI.height - UI.safe - 3, 0, 2, UI.colors.emerald, 0.8).setDepth(45);
    this.tweens.add({
      targets: line,
      width: 188,
      duration: 260,
      ease: 'Sine.Out',
      onComplete: () => {
        line.destroy();
        if (this.beat < BEATS.length - 1) {
          this.registry.set('travelBeat', this.beat + 1);
          this.scene.restart();
        } else {
          this.registry.set('battleStage', 0);
          this.registry.set('heroHp', 20);
          this.registry.set('wolfHp', 12);
          this.registry.set('leaderHp', 18);
          this.scene.start('BattleScene');
        }
      },
    });
  }

  private openModal(kind: ModalKind) {
    if (this.modal) return;

    const overlay = this.add.rectangle(UI.width / 2, UI.height / 2, UI.width, UI.height, 0x020807, 0.58)
      .setInteractive()
      .setDepth(100);

    const panel = this.add.rectangle(UI.width / 2, 372, 330, 458, UI.colors.surface, 0.985)
      .setStrokeStyle(1, UI.colors.metal, 0.58)
      .setDepth(101);

    const title = this.add.text(48, 168, kind === 'map' ? 'Карта' : 'Сумка', {
      fontFamily: FONT.serif,
      fontSize: '25px',
      color: UI.colors.text,
      fontStyle: 'bold',
    }).setDepth(102);

    const close = this.add.circle(329, 179, 22, UI.colors.surfaceRaised, 1)
      .setStrokeStyle(1, UI.colors.metal, 0.45)
      .setInteractive({ useHandCursor: true })
      .setDepth(102);
    const closeText = this.add.text(329, 178, '×', { fontFamily: FONT.sans, fontSize: '20px', color: UI.colors.textMuted }).setOrigin(0.5).setDepth(103);

    const items: Phaser.GameObjects.GameObject[] = [overlay, panel, title, close, closeText];

    if (kind === 'map') {
      items.push(...this.buildMapModal());
    } else {
      items.push(...this.buildBagModal());
    }

    this.modal = this.add.container(0, 0, items).setDepth(100);
    close.on('pointerdown', () => this.closeModal());
    overlay.on('pointerdown', () => this.closeModal());
  }

  private buildMapModal(): Phaser.GameObjects.GameObject[] {
    const items: Phaser.GameObjects.GameObject[] = [];
    const line = this.add.graphics().setDepth(103);
    line.lineStyle(2, UI.colors.metalSoft, 0.5);
    line.beginPath();
    line.moveTo(105, 520);
    line.lineTo(147, 450);
    line.lineTo(205, 398);
    line.lineTo(258, 325);
    line.lineTo(290, 254);
    line.strokePath();
    items.push(line);

    const nodes = [
      { x: 105, y: 520, label: 'Башня', active: true },
      { x: 147, y: 450, label: 'Тракт', active: true },
      { x: 205, y: 398, label: 'Лес', active: true },
      { x: 258, y: 325, label: 'Ворота', active: this.beat >= 2 },
      { x: 290, y: 254, label: 'Долина', active: false },
    ];

    nodes.forEach((n) => {
      const c = this.add.circle(n.x, n.y, n.active ? 10 : 7, n.active ? UI.colors.emeraldSoft : UI.colors.surfaceRaised, 1)
        .setStrokeStyle(1, n.active ? UI.colors.emerald : UI.colors.metalSoft, n.active ? 0.9 : 0.45)
        .setDepth(104);
      const t = this.add.text(n.x + 16, n.y - 7, n.label, {
        fontFamily: FONT.sans,
        fontSize: '10px',
        color: n.active ? UI.colors.text : UI.colors.textDim,
      }).setDepth(104);
      items.push(c, t);
    });

    const copy = this.add.text(48, 566, 'Текущий путь отмечен живой руной. Остальные районы откроются позже.', {
      fontFamily: FONT.sans,
      fontSize: '10px',
      color: UI.colors.textMuted,
      wordWrap: { width: 288 },
      lineSpacing: 3,
    }).setDepth(104);
    items.push(copy);
    return items;
  }

  private buildBagModal(): Phaser.GameObjects.GameObject[] {
    const items: Phaser.GameObjects.GameObject[] = [];
    const rows = [
      ['Лечебная трава', '×1', 'Восстанавливает силы между боями'],
      ['Сухой корень', '×3', 'Алхимический материал'],
      ['Пустой флакон', '×2', 'Для будущих настоев'],
    ];

    rows.forEach((row, i) => {
      const y = 250 + i * 92;
      const icon = this.add.circle(72, y, 18, UI.colors.surfaceRaised, 1).setStrokeStyle(1, UI.colors.metal, 0.34).setDepth(103);
      const rune = this.add.text(72, y, i === 0 ? '❧' : i === 1 ? '⌁' : '◇', { fontFamily: FONT.serif, fontSize: '15px', color: i === 0 ? '#6fd2a7' : UI.colors.textMuted }).setOrigin(0.5).setDepth(104);
      const name = this.add.text(105, y - 16, row[0], { fontFamily: FONT.serif, fontSize: '14px', color: UI.colors.text, fontStyle: 'bold' }).setDepth(103);
      const amount = this.add.text(310, y - 16, row[1], { fontFamily: FONT.sans, fontSize: '10px', color: UI.colors.textMuted }).setOrigin(1, 0).setDepth(103);
      const desc = this.add.text(105, y + 8, row[2], { fontFamily: FONT.sans, fontSize: '9px', color: UI.colors.textDim, wordWrap: { width: 190 } }).setDepth(103);
      const divider = this.add.rectangle(195, y + 42, 246, 1, UI.colors.metalSoft, i < rows.length - 1 ? 0.22 : 0).setDepth(103);
      items.push(icon, rune, name, amount, desc, divider);
    });

    return items;
  }

  private closeModal() {
    this.modal?.destroy(true);
    this.modal = undefined;
  }

  private showToast(message: string) {
    const bg = this.add.rectangle(UI.width / 2, 620, 210, 36, UI.colors.surfaceRaised, 0.97)
      .setStrokeStyle(1, UI.colors.metal, 0.35)
      .setDepth(90);
    const text = this.add.text(UI.width / 2, 620, message, { fontFamily: FONT.sans, fontSize: '10px', color: UI.colors.textMuted }).setOrigin(0.5).setDepth(91);
    this.tweens.add({ targets: [bg, text], alpha: 0, y: '-=8', delay: 900, duration: 260, onComplete: () => { bg.destroy(); text.destroy(); } });
  }

  private drawTracks() {
    const points = [[210, 402], [226, 434], [205, 465], [230, 495]];
    points.forEach(([x, y], i) => {
      const paw = this.add.ellipse(x, y, 8, 12, 0x0b1413, 0.62).setRotation(i % 2 ? -0.22 : 0.24);
      paw.setDepth(4);
      this.add.circle(x - 4, y - 7, 1.5, 0x0b1413, 0.55).setDepth(4);
      this.add.circle(x + 1, y - 9, 1.4, 0x0b1413, 0.55).setDepth(4);
      this.add.circle(x + 5, y - 6, 1.4, 0x0b1413, 0.55).setDepth(4);
    });
  }

  private drawEncounterSilhouettes() {
    this.drawWolf(146, 375, 0.86);
    this.drawWolf(266, 354, 1.06);
  }

  private drawWolf(x: number, y: number, scale: number) {
    const g = this.add.graphics().setDepth(5);
    g.fillStyle(0x07100f, 0.94);
    g.fillEllipse(x, y, 76 * scale, 42 * scale);
    g.fillTriangle(x + 25 * scale, y - 8 * scale, x + 45 * scale, y - 32 * scale, x + 49 * scale, y - 1 * scale);
    g.fillTriangle(x + 31 * scale, y - 26 * scale, x + 38 * scale, y - 46 * scale, x + 46 * scale, y - 21 * scale);
    g.fillTriangle(x + 46 * scale, y - 25 * scale, x + 55 * scale, y - 45 * scale, x + 59 * scale, y - 18 * scale);
    g.fillTriangle(x - 40 * scale, y, x - 68 * scale, y - 10 * scale, x - 37 * scale, y + 11 * scale);
    this.add.circle(x + 41 * scale, y - 15 * scale, 1.8, UI.colors.amber, 0.8).setDepth(6);
  }
}
