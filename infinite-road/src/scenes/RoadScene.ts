import * as Phaser from 'phaser';
import { createScreenLayout, type ScreenLayout } from '../ui/layout';

const C = {
  surface: 0x46545a,
  deep: 0x34434b,
  ink: '#f0e2c6',
  muted: '#d2d6d4',
  gold: 0xe8c98d,
  goldCss: '#e8c98d',
  line: 0x879196,
};

type RoadView = {
  title: string;
  text: string;
  button: string;
  visual: 'start' | 'herb' | 'afterHerb' | 'tracks' | 'wolves' | 'cleared';
};

export class RoadScene extends Phaser.Scene {
  private sheet?: Phaser.GameObjects.Container;
  private layout!: ScreenLayout;

  constructor() {
    super('RoadScene');
  }

  create() {
    this.layout = createScreenLayout(this);
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
    const w = this.layout.width;
    const h = this.layout.header.height;
    const safeTop = this.layout.safeTop;

    this.add.rectangle(w / 2, h / 2, w, h, C.surface, 1);

    this.drawRoundIconButton(29, safeTop + 28, '‹', () => this.scene.start('MainMenuScene'));
    this.drawRoundIconButton(w - 29, safeTop + 28, '⌑', () => this.openBag());

    this.add.text(w / 2, safeTop + 16, 'СТАРАЯ ДОРОГА', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '18px',
      color: C.ink,
      fontStyle: 'bold',
      letterSpacing: 0.8,
    }).setOrigin(0.5, 0);

    this.add.circle(22, safeTop + 60, 7, C.deep, 1).setStrokeStyle(1, C.gold, 0.65);
    this.add.text(38, safeTop + 53, 'Адам', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '15px',
      color: C.goldCss,
      fontStyle: 'bold',
    });
    this.add.text(38, safeTop + 71, '20 / 20', {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '9px',
      color: '#aeb8b8',
      fontStyle: 'bold',
    });

    const herb = Number(this.registry.get('runLootHerb') ?? 0);
    const bagLabel = this.add.text(w - 16, safeTop + 54, herb > 0 ? `Сумка · ${herb}` : 'Сумка', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '15px',
      color: C.ink,
      fontStyle: 'bold',
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });

    this.add.text(w - 16, safeTop + 72, 'Добыча похода', {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '9px',
      color: '#aeb8b8',
      fontStyle: 'bold',
    }).setOrigin(1, 0);

    bagLabel.on('pointerdown', () => this.openBag());

    const gap = 7;
    const left = 18;
    const total = w - 36;
    const segW = (total - gap * 3) / 4;

    for (let i = 0; i < 4; i++) {
      this.add.rectangle(
        left + segW / 2 + i * (segW + gap),
        safeTop + 88,
        segW,
        4,
        i <= this.step ? C.gold : C.line,
        i <= this.step ? 1 : 0.65,
      );
    }

    this.add.rectangle(w / 2, h - 1, w, 2, 0x718087, 0.22);
  }

  private drawRoundIconButton(x: number, y: number, glyph: string, callback: () => void) {
    const outer = this.add.circle(x, y, 20, C.deep, 1)
      .setStrokeStyle(1, 0xa99c82, 0.85)
      .setInteractive({ useHandCursor: true });

    this.add.circle(x, y, 16, 0x29383e, 0.95).setStrokeStyle(2, 0x536269, 0.9);

    this.add.text(x, y - 1, glyph, {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: glyph === '‹' ? '25px' : '16px',
      color: C.goldCss,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    outer.on('pointerdown', callback);
  }

  private drawRoadScene() {
    const view = this.getView();
    const top = this.layout.world.y;
    const h = Math.max(280, this.layout.world.height);
    const bottom = this.layout.world.bottom;
    const sy = h / 525;
    const sizeScale = Phaser.Math.Clamp(0.76 + sy * 0.24, 0.84, 1.02);
    const yy = (offset: number) => top + offset * sy;

    const g = this.add.graphics();

    const fillPoly = (points: Array<[number, number]>, color: number, alpha = 1) => {
      if (points.length < 3) return;
      g.fillStyle(color, alpha);
      g.beginPath();
      g.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) g.lineTo(points[i][0], points[i][1]);
      g.closePath();
      g.fillPath();
    };

    g.fillStyle(0xaebbb8, 1).fillRect(0, top, 390, h);
    g.fillStyle(0xc5ccc7, 0.38).fillRect(0, top, 390, 112 * sy);
    g.fillStyle(0x8fa09d, 0.28).fillRect(0, yy(112), 390, 122 * sy);

    fillPoly([
      [0, yy(206)], [28, yy(168)], [58, yy(190)], [91, yy(128)],
      [121, yy(175)], [154, yy(151)], [194, yy(201)], [228, yy(144)],
      [270, yy(78)], [302, yy(130)], [336, yy(174)], [390, yy(143)],
      [390, yy(270)], [0, yy(270)],
    ], 0x728785, 0.42);

    const farTrees = [
      [4, 272, 92, 29], [31, 278, 118, 34], [62, 274, 83, 28], [91, 280, 128, 36],
      [123, 276, 98, 31], [154, 282, 120, 34], [188, 278, 88, 29], [221, 279, 114, 34],
      [253, 276, 95, 30], [286, 281, 126, 36], [321, 278, 102, 31], [354, 280, 116, 34],
      [384, 276, 91, 28],
    ] as const;

    farTrees.forEach(([x, baseOffset, treeH, treeW], i) => {
      const baseY = yy(baseOffset);
      const th = treeH * sizeScale;
      const tw = treeW * sizeScale;
      this.add.rectangle(x, baseY - th * 0.33, 4 * sizeScale, th * 0.42, 0x4c6262, 0.42);
      this.add.ellipse(x, baseY - th * 0.64, tw, th * 0.72, 0x5d7371, 0.48);
      this.add.ellipse(x - 3, baseY - th * 0.42, tw * 1.18, th * 0.54, 0x536967, 0.38);
      if (i % 3 === 0) this.add.ellipse(x + 4, baseY - th * 0.79, tw * 0.7, th * 0.35, 0x667b78, 0.32);
    });

    g.fillStyle(0x6c7869, 1).fillRect(0, yy(274), 390, bottom - yy(274));
    g.fillStyle(0x5d695e, 0.36).fillRect(0, yy(365), 390, bottom - yy(365));

    const left = [
      [5, 345, 188, 54], [29, 358, 151, 47], [57, 347, 211, 58],
      [91, 360, 169, 51], [119, 350, 196, 56], [146, 363, 144, 46],
    ] as const;
    const right = [
      [386, 347, 196, 56], [359, 360, 153, 47], [330, 349, 214, 58],
      [298, 360, 171, 51], [270, 351, 198, 55], [245, 363, 145, 45],
    ] as const;

    const drawForestTree = (x: number, baseOffset: number, treeH: number, treeW: number, dark: boolean) => {
      const baseY = yy(baseOffset);
      const th = treeH * sizeScale;
      const tw = treeW * sizeScale;
      const color = dark ? 0x314548 : 0x43585a;
      this.add.rectangle(x, baseY - th * 0.28, 6 * sizeScale, th * 0.36, 0x2d3c3e, 0.88);
      this.add.ellipse(x, baseY - th * 0.67, tw * 0.72, th * 0.62, color, 0.95);
      this.add.ellipse(x - 4, baseY - th * 0.46, tw, th * 0.58, color, 0.95);
      this.add.ellipse(x + 3, baseY - th * 0.27, tw * 1.12, th * 0.42, color, 0.94);
    };

    left.forEach(([x, b, th, tw], i) => drawForestTree(x, b, th, tw, i % 2 === 0));
    right.forEach(([x, b, th, tw], i) => drawForestTree(x, b, th, tw, i % 2 !== 0));

    fillPoly([
      [190, yy(224)], [202, yy(229)], [218, yy(292)], [244, yy(365)],
      [282, yy(446)], [322, bottom], [72, bottom], [108, yy(454)],
      [140, yy(382)], [164, yy(310)],
    ], 0x747468, 1);

    fillPoly([
      [194, yy(237)], [200, yy(239)], [211, yy(298)], [231, yy(369)],
      [260, yy(448)], [287, bottom], [108, bottom], [136, yy(456)],
      [158, yy(387)], [176, yy(317)],
    ], 0x8d8b7b, 0.98);

    fillPoly([
      [196, yy(251)], [200, yy(253)], [207, yy(308)], [220, yy(379)],
      [238, yy(454)], [251, bottom], [157, bottom], [169, yy(458)],
      [179, yy(390)], [188, yy(319)],
    ], 0xa49f8b, 0.25);

    const edgeMarks = [
      [126, 357, 30, 11], [112, 396, 38, 12], [96, 445, 46, 13], [79, 494, 55, 15],
      [265, 362, 29, 11], [280, 402, 38, 12], [297, 447, 47, 14], [315, 494, 55, 16],
    ] as const;
    edgeMarks.forEach(([x, y, ww, hh], i) => {
      this.add.ellipse(x, yy(y), ww * sizeScale, hh * sizeScale, i % 2 ? 0x566b59 : 0x607461, 0.54);
    });

    [
      [148, 383, 11, 5], [242, 419, 9, 4], [132, 468, 13, 6],
      [264, 493, 16, 5], [176, 507, 9, 4],
    ].forEach(([x, y, ww, hh]) => this.add.ellipse(x, yy(y), ww * sizeScale, hh * sizeScale, 0x555a50, 0.43));

    this.add.ellipse(212, yy(452), 48 * sizeScale, 10 * sizeScale, 0xc6c4b6, 0.06);
    this.add.ellipse(190, yy(499), 66 * sizeScale, 12 * sizeScale, 0xc6c4b6, 0.05);

    for (let i = 0; i < 5; i++) {
      const fog = this.add.ellipse(
        25 + i * 92,
        yy(188 + (i % 3) * 39),
        (154 + (i % 2) * 40) * sizeScale,
        (24 + (i % 2) * 7) * sizeScale,
        0xe4e5dc,
        0.045 + i * 0.006,
      );
      this.tweens.add({
        targets: fog,
        x: fog.x + (i % 2 ? -12 : 15),
        duration: 4200 + i * 520,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });
    }

    this.add.ellipse(-43, yy(350), 160 * sizeScale, 430 * sizeScale, 0x25393b, 0.16);
    this.add.ellipse(433, yy(365), 170 * sizeScale, 445 * sizeScale, 0x25393b, 0.16);

    if (view.visual === 'herb') this.drawHerb(yy(366), sizeScale);
    if (view.visual === 'tracks') this.drawTracks(yy, sizeScale);
    if (view.visual === 'wolves') this.drawWolves(yy, sizeScale);
    if (view.visual === 'cleared') this.drawCleared(yy, sizeScale);
  }

  private drawHerb(y: number, scale: number) {
    const x = 287;
    const glow = this.add.circle(x, y, 28 * scale, C.gold, 0.12)
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
    g.lineStyle(3 * scale, 0x46624f, 1);
    g.beginPath();
    g.moveTo(x, y + 15 * scale);
    g.lineTo(x, y - 12 * scale);
    g.strokePath();

    g.fillStyle(0x617b61, 1);
    g.fillEllipse(x - 8 * scale, y - 4 * scale, 14 * scale, 7 * scale);
    g.fillEllipse(x + 8 * scale, y - 9 * scale, 14 * scale, 7 * scale);
    g.fillEllipse(x - 6 * scale, y - 15 * scale, 11 * scale, 6 * scale);
  }

  private drawTracks(yy: (offset: number) => number, scale: number) {
    const prints = [
      [214, 305, -0.25], [185, 350, 0.22], [223, 397, -0.18], [190, 445, 0.16],
    ] as const;

    prints.forEach(([x, offset, rot]) => {
      const y = yy(offset);
      this.add.ellipse(x, y, 16 * scale, 21 * scale, 0x3c403c, 0.6).setRotation(rot);
      this.add.circle(x - 7 * scale, y - 11 * scale, 3 * scale, 0x3c403c, 0.55);
      this.add.circle(x, y - 14 * scale, 3 * scale, 0x3c403c, 0.55);
      this.add.circle(x + 7 * scale, y - 10 * scale, 3 * scale, 0x3c403c, 0.55);
    });
  }

  private drawWolves(yy: (offset: number) => number, scale: number) {
    this.drawWolfSilhouette(164, yy(248), 0.88 * scale);
    this.drawWolfSilhouette(235, yy(233), 1.08 * scale);

    this.add.rectangle(195, yy(310), 172 * scale, 31 * scale, C.deep, 0.78)
      .setStrokeStyle(1, C.gold, 0.45);
    this.add.text(195, yy(310), 'ПУТЬ ПЕРЕКРЫТ', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: `${Math.round(12 * scale)}px`,
      color: C.goldCss,
      fontStyle: 'bold',
      letterSpacing: 1,
    }).setOrigin(0.5);
  }

  private drawWolfSilhouette(x: number, y: number, scale: number) {
    const body = this.add.ellipse(x, y, 58 * scale, 33 * scale, 0x313b3d, 0.93);
    const head = this.add.circle(x + 24 * scale, y - 14 * scale, 15 * scale, 0x313b3d, 0.93);
    const tail = this.add.triangle(x - 32 * scale, y - 4 * scale, 0, 10, 32, 0, 7, 18, 0x313b3d, 0.93);
    const earA = this.add.triangle(x + 17 * scale, y - 34 * scale, 0, 15, 8, 0, 15, 15, 0x313b3d, 0.95);
    const earB = this.add.triangle(x + 29 * scale, y - 33 * scale, 0, 15, 8, 0, 15, 15, 0x313b3d, 0.95);
    [body, head, tail, earA, earB].forEach(o => o.setDepth(3));
    this.add.circle(x + 29 * scale, y - 15 * scale, 2.2 * scale, C.gold, 0.9).setDepth(4);
  }

  private drawCleared(yy: (offset: number) => number, scale: number) {
    const light = this.add.ellipse(195, yy(205), 126 * scale, 56 * scale, 0xefe0b6, 0.10);
    this.tweens.add({
      targets: light,
      alpha: { from: 0.06, to: 0.18 },
      scaleX: { from: 0.95, to: 1.08 },
      duration: 1800,
      yoyo: true,
      repeat: -1,
    });

    this.add.rectangle(195, yy(320), 154 * scale, 34 * scale, C.deep, 0.78)
      .setStrokeStyle(1, C.gold, 0.5);
    this.add.text(195, yy(320), 'ДОРОГА СВОБОДНА', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: `${Math.round(12 * scale)}px`,
      color: C.goldCss,
      fontStyle: 'bold',
    }).setOrigin(0.5);
  }

  private drawCopy() {
    const view = this.getView();
    const top = this.layout.footer.y;
    const h = this.layout.footer.height;

    this.add.rectangle(195, top + h / 2, 390, h, C.surface, 1);
    this.add.rectangle(195, top, 390, 1, 0x899296, 0.22);

    this.add.text(20, top + 12, view.title, {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: h < 190 ? '24px' : '27px',
      color: C.ink,
      fontStyle: 'bold',
    });

    this.add.text(20, top + 48, view.text, {
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: '14px',
      color: C.muted,
      wordWrap: { width: 350 },
      lineSpacing: 4,
    });

    const buttonY = this.layout.contentBottom - 34;
    const button = this.add.rectangle(195, buttonY, 350, 60, C.deep, 1)
      .setStrokeStyle(1, 0xaa9b7d, 0.95)
      .setInteractive({ useHandCursor: true });

    this.add.rectangle(195, buttonY, 342, 52, 0x4a5960, 0)
      .setStrokeStyle(2, 0x526168, 0.95);

    this.add.text(38, buttonY, view.button, {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '19px',
      color: C.goldCss,
      fontStyle: 'bold',
    }).setOrigin(0, 0.5);

    this.add.text(349, buttonY - 1, '›', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '29px',
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
    const panelH = Math.min(244, this.layout.contentBottom - this.layout.safeTop - 24);
    const panelY = this.layout.contentBottom - panelH / 2 - 12;

    const overlay = this.add.rectangle(195, this.layout.height / 2, 390, this.layout.height, 0x000000, 0.46)
      .setInteractive()
      .setDepth(100);

    const panel = this.add.rectangle(195, panelY, 354, panelH, C.deep, 1)
      .setStrokeStyle(1, 0x8f856f, 1)
      .setDepth(101);

    const titleY = panelY - panelH / 2 + 26;
    const title = this.add.text(38, titleY, 'Добыча похода', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '24px',
      color: C.goldCss,
      fontStyle: 'bold',
    }).setDepth(102);

    const labelY = titleY + 52;
    const label = this.add.text(38, labelY, 'Лечебная трава', {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '15px',
      color: C.ink,
    }).setDepth(102);

    const value = this.add.text(344, labelY, `×${herb}`, {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '18px',
      color: C.goldCss,
      fontStyle: 'bold',
    }).setOrigin(1, 0).setDepth(102);

    const note = this.add.text(38, labelY + 34, 'Перенесётся в инвентарь после завершения пути.', {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '12px',
      color: C.muted,
      wordWrap: { width: 310 },
    }).setDepth(102);

    const closeY = panelY + panelH / 2 - 36;
    const close = this.add.rectangle(195, closeY, 310, 48, C.surface, 1)
      .setStrokeStyle(1, 0xaa9b7d, 1)
      .setInteractive({ useHandCursor: true })
      .setDepth(102);

    const closeText = this.add.text(195, closeY, 'Закрыть', {
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
