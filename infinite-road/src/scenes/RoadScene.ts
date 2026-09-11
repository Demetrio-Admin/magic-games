import * as Phaser from 'phaser';

const C = {
  surface: 0x46545a,
  deep: 0x34434b,
  ink: '#f0e2c6',
  muted: '#d2d6d4',
  gold: 0xe8c98d,
  goldCss: '#e8c98d',
  line: 0x879196,
  scene: 0xaab6b4,
  sceneDark: 0x54686b,
  sceneMid: 0x7f9392,
  forest: 0x44585a,
  forestDark: 0x344749,
  road: 0x8c8b7e,
  roadDark: 0x6e7169,
  moss: 0x596c5d,
  danger: 0x704746,
};

type RoadView = {
  title: string;
  text: string;
  button: string;
  visual: 'start' | 'herb' | 'afterHerb' | 'tracks' | 'wolves' | 'cleared';
};

export class RoadScene extends Phaser.Scene {
  private sheet?: Phaser.GameObjects.Container;

  constructor() {
    super('RoadScene');
  }

  create() {
    this.ensureState();
    this.cameras.main.setBackgroundColor(C.surface);

    this.drawHeader();
    this.drawRoadScene();
    this.drawCopy();
  }

  private ensureState() {
    if (this.registry.get('roadStep') === undefined) this.registry.set('roadStep', 0);
    if (this.registry.get('herbCollected') === undefined) this.registry.set('herbCollected', false);
    if (this.registry.get('encounterFound') === undefined) this.registry.set('encounterFound', false);
    if (this.registry.get('runLootHerb') === undefined) this.registry.set('runLootHerb', 0);
  }

  private get step() {
    return Number(this.registry.get('roadStep') ?? 0);
  }

  private get herbCollected() {
    return Boolean(this.registry.get('herbCollected'));
  }

  private get encounterFound() {
    return Boolean(this.registry.get('encounterFound'));
  }

  private getView(): RoadView {
    if (this.step === 0) {
      return {
        title: 'У старого тракта',
        text: 'Дорога заросла, но следы ещё свежие.',
        button: 'Идти дальше',
        visual: 'start',
      };
    }

    if (this.step === 1 && !this.herbCollected) {
      return {
        title: 'Что-то у обочины',
        text: 'Адам замечает лечебную траву. Без неё путь не продолжить.',
        button: 'Собрать траву',
        visual: 'herb',
      };
    }

    if (this.step === 1) {
      return {
        title: 'Трава собрана',
        text: 'Находка лежит во временной добыче похода.',
        button: 'Продолжить',
        visual: 'afterHerb',
      };
    }

    if (this.step === 2 && !this.encounterFound) {
      return {
        title: 'Следы на дороге',
        text: 'Впереди слышится рычание. Угроза совсем близко.',
        button: 'Осмотреть угрозу',
        visual: 'tracks',
      };
    }

    if (this.step === 2) {
      return {
        title: 'Волки у ворот',
        text: 'Серый волк и вожак стаи перекрыли дорогу.',
        button: 'Вступить в бой',
        visual: 'wolves',
      };
    }

    return {
      title: 'Дорога свободна',
      text: 'Жители снова смогут пройти к Тихой долине.',
      button: 'Завершить путь',
      visual: 'cleared',
    };
  }

  private drawHeader() {
    const w = this.scale.width;

    this.add.rectangle(w / 2, 66, w, 132, C.surface, 1);

    this.drawRoundIconButton(46, 38, '‹', () => this.scene.start('MainMenuScene'));

    this.add.text(w / 2, 29, 'СТАРАЯ ДОРОГА', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '20px',
      color: C.ink,
      fontStyle: 'bold',
      letterSpacing: 0.7,
    }).setOrigin(0.5, 0);

    this.drawRoundIconButton(w - 46, 38, '⌑', () => this.openBag());

    const party = this.add.rectangle(54, 89, 82, 34, C.deep, 1)
      .setStrokeStyle(1, 0x9d947f, 1);
    party.setOrigin(0.5);

    this.add.text(54, 89, 'Адам', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '17px',
      color: C.goldCss,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const herb = Number(this.registry.get('runLootHerb') ?? 0);
    const bagText = herb > 0 ? `Сумка · ${herb}` : 'Сумка';
    const bagLabel = this.add.text(w - 20, 89, bagText, {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '19px',
      color: C.ink,
      fontStyle: 'bold',
    }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
    bagLabel.on('pointerdown', () => this.openBag());

    const gap = 7;
    const left = 20;
    const total = w - 40;
    const segW = (total - gap * 3) / 4;

    for (let i = 0; i < 4; i++) {
      this.add.rectangle(
        left + segW / 2 + i * (segW + gap),
        119,
        segW,
        5,
        i <= this.step ? C.gold : C.line,
        1,
      );
    }
  }

  private drawRoundIconButton(x: number, y: number, glyph: string, callback: () => void) {
    const outer = this.add.circle(x, y, 26, C.deep, 1)
      .setStrokeStyle(1, 0xa99c82, 1)
      .setInteractive({ useHandCursor: true });

    this.add.circle(x, y, 22, 0x4e5c62, 0.5).setStrokeStyle(1, 0x56656b, 1);
    this.add.circle(x, y, 19, C.deep, 1);

    this.add.text(x, y - 1, glyph, {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: glyph === '‹' ? '30px' : '20px',
      color: C.goldCss,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    outer.on('pointerdown', callback);
  }

  private drawRoadScene() {
    const view = this.getView();
    const top = 132;
    const h = 507;
    const bottom = top + h;

    const g = this.add.graphics();

    // Atmospheric background.
    g.fillStyle(C.scene, 1).fillRect(0, top, 390, h);
    g.fillStyle(0xb9c2bd, 0.72).fillRect(0, top, 390, 135);
    g.fillStyle(0x91a3a0, 0.52).fillRect(0, top + 110, 390, 125);

    // Distant ridges.
    g.fillStyle(C.sceneMid, 0.72);
    g.fillTriangle(-40, top + 250, 90, top + 86, 220, top + 250);
    g.fillTriangle(126, top + 250, 268, top + 65, 440, top + 250);

    g.fillStyle(C.sceneDark, 0.74);
    g.fillTriangle(-55, top + 305, 72, top + 155, 200, top + 305);
    g.fillTriangle(170, top + 305, 318, top + 145, 455, top + 305);

    // Forest walls: broad silhouettes, not detailed art yet.
    for (let i = 0; i < 7; i++) {
      const lx = -12 + i * 27;
      const rx = 402 - i * 27;
      const peak = top + 120 + (i % 3) * 24;

      g.fillStyle(i % 2 ? C.forestDark : C.forest, 0.92);
      g.fillTriangle(lx - 52, bottom - 70, lx + 16, peak, lx + 82, bottom - 70);
      g.fillTriangle(rx - 82, bottom - 70, rx - 16, peak + 8, rx + 52, bottom - 70);
    }

    // Ground.
    g.fillStyle(0x6c786c, 1).fillRect(0, top + 285, 390, h - 285);

    // Perspective road.
    g.fillStyle(C.roadDark, 1);
    g.fillTriangle(72, bottom, 195, top + 205, 318, bottom);
    g.fillStyle(C.road, 0.96);
    g.fillTriangle(102, bottom, 195, top + 224, 287, bottom);

    // Soft center highlight gives the road the old mockup's readable path.
    g.fillStyle(0xb2ad98, 0.22);
    g.fillTriangle(142, bottom, 195, top + 250, 248, bottom);

    // Roadside stones / moss.
    for (let i = 0; i < 12; i++) {
      const yy = top + 315 + i * 15;
      const spread = 61 + i * 7;
      this.add.ellipse(195 - spread, yy, 22 + (i % 3) * 7, 11, C.moss, 0.72);
      this.add.ellipse(195 + spread, yy + 6, 20 + (i % 4) * 6, 10, 0x516558, 0.72);
    }

    // Pale fog strips.
    for (let i = 0; i < 4; i++) {
      const fog = this.add.ellipse(36 + i * 105, top + 170 + (i % 2) * 42, 170, 34, 0xe2e3da, 0.08);
      this.tweens.add({
        targets: fog,
        x: fog.x + 14,
        duration: 3800 + i * 450,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });
    }

    if (view.visual === 'herb') this.drawHerb(top);
    if (view.visual === 'tracks') this.drawTracks(top);
    if (view.visual === 'wolves') this.drawWolves(top);
    if (view.visual === 'cleared') this.drawCleared(top);
  }

  private drawHerb(top: number) {
    const x = 287;
    const y = top + 366;

    const glow = this.add.circle(x, y, 28, C.gold, 0.12)
      .setStrokeStyle(1, C.gold, 0.55);

    this.tweens.add({
      targets: glow,
      alpha: { from: 0.10, to: 0.25 },
      scale: { from: 0.92, to: 1.12 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    const g = this.add.graphics();
    g.lineStyle(3, 0x46624f, 1);
    g.beginPath();
    g.moveTo(x, y + 15);
    g.lineTo(x, y - 12);
    g.strokePath();

    g.fillStyle(0x617b61, 1);
    g.fillEllipse(x - 8, y - 4, 14, 7);
    g.fillEllipse(x + 8, y - 9, 14, 7);
    g.fillEllipse(x - 6, y - 15, 11, 6);

    this.add.text(x + 31, y - 26, 'Лечебная трава', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '13px',
      color: C.ink,
      backgroundColor: '#34434bcc',
      padding: { x: 8, y: 5 },
    }).setOrigin(1, 0.5);
  }

  private drawTracks(top: number) {
    const prints = [
      [214, top + 305, -0.25],
      [185, top + 350, 0.22],
      [223, top + 397, -0.18],
      [190, top + 445, 0.16],
    ] as const;

    prints.forEach(([x, y, rot]) => {
      this.add.ellipse(x, y, 16, 21, 0x3c403c, 0.6).setRotation(rot);
      this.add.circle(x - 7, y - 11, 3, 0x3c403c, 0.55);
      this.add.circle(x, y - 14, 3, 0x3c403c, 0.55);
      this.add.circle(x + 7, y - 10, 3, 0x3c403c, 0.55);
    });
  }

  private drawWolves(top: number) {
    this.drawWolfSilhouette(164, top + 248, 0.88);
    this.drawWolfSilhouette(235, top + 233, 1.08);

    this.add.rectangle(195, top + 310, 172, 31, C.deep, 0.78)
      .setStrokeStyle(1, C.gold, 0.45);
    this.add.text(195, top + 310, 'ПУТЬ ПЕРЕКРЫТ', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '12px',
      color: C.goldCss,
      fontStyle: 'bold',
      letterSpacing: 1,
    }).setOrigin(0.5);
  }

  private drawWolfSilhouette(x: number, y: number, scale: number) {
    const body = this.add.ellipse(x, y, 58 * scale, 33 * scale, 0x313b3d, 0.93);
    const head = this.add.circle(x + 24 * scale, y - 14 * scale, 15 * scale, 0x313b3d, 0.93);
    const tail = this.add.triangle(
      x - 32 * scale,
      y - 4 * scale,
      0,
      10,
      32,
      0,
      7,
      18,
      0x313b3d,
      0.93,
    );
    const earA = this.add.triangle(x + 17 * scale, y - 34 * scale, 0, 15, 8, 0, 15, 15, 0x313b3d, 0.95);
    const earB = this.add.triangle(x + 29 * scale, y - 33 * scale, 0, 15, 8, 0, 15, 15, 0x313b3d, 0.95);
    [body, head, tail, earA, earB].forEach(o => o.setDepth(3));
    this.add.circle(x + 29 * scale, y - 15 * scale, 2.2, C.gold, 0.9).setDepth(4);
  }

  private drawCleared(top: number) {
    const light = this.add.ellipse(195, top + 205, 126, 56, 0xefe0b6, 0.10);
    this.tweens.add({
      targets: light,
      alpha: { from: 0.06, to: 0.18 },
      scaleX: { from: 0.95, to: 1.08 },
      duration: 1800,
      yoyo: true,
      repeat: -1,
    });

    this.add.rectangle(195, top + 320, 154, 34, C.deep, 0.78)
      .setStrokeStyle(1, C.gold, 0.5);
    this.add.text(195, top + 320, 'ДОРОГА СВОБОДНА', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '12px',
      color: C.goldCss,
      fontStyle: 'bold',
    }).setOrigin(0.5);
  }

  private drawCopy() {
    const view = this.getView();
    const top = 639;
    const h = 205;

    this.add.rectangle(195, top + h / 2, 390, h, C.surface, 1);

    this.add.text(20, top + 14, view.title, {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '29px',
      color: C.ink,
      fontStyle: 'bold',
      lineSpacing: 0,
    });

    this.add.text(20, top + 56, view.text, {
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: '16px',
      color: C.muted,
      wordWrap: { width: 350 },
      lineSpacing: 4,
    });

    const buttonY = 804;
    const button = this.add.rectangle(195, buttonY, 350, 64, C.deep, 1)
      .setStrokeStyle(1, 0xaa9b7d, 1)
      .setInteractive({ useHandCursor: true });

    this.add.rectangle(195, buttonY, 344, 58, 0x4a5960, 0)
      .setStrokeStyle(3, 0x4a5960, 1);

    this.add.text(38, buttonY, view.button, {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '20px',
      color: C.goldCss,
      fontStyle: 'bold',
    }).setOrigin(0, 0.5);

    this.add.text(349, buttonY - 1, '›', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '31px',
      color: C.goldCss,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    button.on('pointerdown', () => this.advance());
  }

  private advance() {
    if (this.step === 0) {
      this.registry.set('roadStep', 1);
      this.scene.restart();
      return;
    }

    if (this.step === 1 && !this.herbCollected) {
      this.registry.set('herbCollected', true);
      this.registry.set('runLootHerb', 1);
      this.scene.restart();
      return;
    }

    if (this.step === 1) {
      this.registry.set('roadStep', 2);
      this.scene.restart();
      return;
    }

    if (this.step === 2 && !this.encounterFound) {
      this.registry.set('encounterFound', true);
      this.scene.restart();
      return;
    }

    if (this.step === 2) {
      this.registry.set('battleStage', 0);
      this.registry.set('heroHp', 20);
      this.registry.set('wolfHp', 12);
      this.registry.set('leaderHp', 18);
      this.scene.start('BattleScene');
      return;
    }

    this.scene.start('RewardScene');
  }

  private openBag() {
    if (this.sheet) return;

    const herb = Number(this.registry.get('runLootHerb') ?? 0);
    const overlay = this.add.rectangle(195, 422, 390, 844, 0x000000, 0.46)
      .setInteractive()
      .setDepth(100);

    const panel = this.add.rectangle(195, 704, 354, 244, C.deep, 1)
      .setStrokeStyle(1, 0x8f856f, 1)
      .setDepth(101);

    const title = this.add.text(38, 610, 'Добыча похода', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '24px',
      color: C.goldCss,
      fontStyle: 'bold',
    }).setDepth(102);

    const label = this.add.text(38, 662, 'Лечебная трава', {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '15px',
      color: C.ink,
    }).setDepth(102);

    const value = this.add.text(344, 662, `×${herb}`, {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '18px',
      color: C.goldCss,
      fontStyle: 'bold',
    }).setOrigin(1, 0).setDepth(102);

    const note = this.add.text(38, 696, 'Перенесётся в инвентарь после завершения пути.', {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '12px',
      color: C.muted,
      wordWrap: { width: 310 },
    }).setDepth(102);

    const close = this.add.rectangle(195, 786, 310, 48, C.surface, 1)
      .setStrokeStyle(1, 0xaa9b7d, 1)
      .setInteractive({ useHandCursor: true })
      .setDepth(102);

    const closeText = this.add.text(195, 786, 'Закрыть', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '17px',
      color: C.goldCss,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(103);

    this.sheet = this.add.container(0, 0, [overlay, panel, title, label, value, note, close, closeText]).setDepth(100);
    close.on('pointerdown', () => this.closeBag());
    overlay.on('pointerdown', () => this.closeBag());
  }

  private closeBag() {
    this.sheet?.destroy(true);
    this.sheet = undefined;
  }
}
