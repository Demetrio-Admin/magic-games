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
  private logicalHeight = 844;
  private sceneScaleY = 1;
  private copyTop = 641;

  constructor() {
    super('RoadScene');
  }

  create() {
    this.configureResponsiveView();
    this.ensureState();
    this.cameras.main.setBackgroundColor(C.surface);

    this.drawHeader();
    this.drawRoadScene();
    this.drawCopy();

    this.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    });
  }

  private configureResponsiveView() {
    const viewportWidth = Math.max(1, this.scale.width);
    const viewportHeight = Math.max(1, this.scale.height);
    const zoom = viewportWidth / 390;

    this.logicalHeight = viewportHeight / zoom;
    this.copyTop = Math.max(470, this.logicalHeight - 203);
    this.sceneScaleY = Math.max(0.62, Math.min(1, (this.copyTop - 116) / 525));

    const camera = this.cameras.main;
    camera.setViewport(0, 0, viewportWidth, viewportHeight);
    camera.setOrigin(0, 0);
    camera.setScroll(0, 0);
    camera.setZoom(zoom);
    camera.setRoundPixels(false);
  }

  private handleResize() {
    if (this.scene.isActive()) {
      this.scene.restart();
    }
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
    const w = 390;

    this.add.rectangle(w / 2, 58, w, 116, C.surface, 1);

    this.drawRoundIconButton(31, 31, '‹', () => this.scene.start('MainMenuScene'));
    this.drawRoundIconButton(w - 31, 31, '⌑', () => this.openBag());

    this.add.text(w / 2, 20, 'СТАРАЯ ДОРОГА', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '18px',
      color: C.ink,
      fontStyle: 'bold',
      letterSpacing: 0.8,
    }).setOrigin(0.5, 0);

    this.add.circle(24, 72, 8, C.deep, 1).setStrokeStyle(1, C.gold, 0.65);
    this.add.text(41, 64, 'Адам', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '16px',
      color: C.goldCss,
      fontStyle: 'bold',
    });
    this.add.text(41, 83, '20 / 20', {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '9px',
      color: '#aeb8b8',
      fontStyle: 'bold',
    });

    const herb = Number(this.registry.get('runLootHerb') ?? 0);
    const bagLabel = this.add.text(w - 18, 65, herb > 0 ? `Сумка · ${herb}` : 'Сумка', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '16px',
      color: C.ink,
      fontStyle: 'bold',
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });

    this.add.text(w - 18, 84, 'Добыча похода', {
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
      const active = i <= this.step;
      this.add.rectangle(
        left + segW / 2 + i * (segW + gap),
        107,
        segW,
        4,
        active ? C.gold : C.line,
        active ? 1 : 0.65,
      );
    }

    this.add.rectangle(w / 2, 115, w, 2, 0x718087, 0.22);
  }

  private drawRoundIconButton(x: number, y: number, glyph: string, callback: () => void) {
    const outer = this.add.circle(x, y, 22, C.deep, 1)
      .setStrokeStyle(1, 0xa99c82, 0.85)
      .setInteractive({ useHandCursor: true });

    this.add.circle(x, y, 18, 0x29383e, 0.95).setStrokeStyle(2, 0x536269, 0.9);

    this.add.text(x, y - 1, glyph, {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: glyph === '‹' ? '27px' : '17px',
      color: C.goldCss,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    outer.on('pointerdown', callback);
  }

  private drawRoadScene() {
    const beforeWorld = new Set(this.children.list);
    const view = this.getView();
    const top = 116;
    const h = 525;
    const bottom = top + h;

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

    // Muted atmospheric sky.
    g.fillStyle(0xaebbb8, 1).fillRect(0, top, 390, h);
    g.fillStyle(0xc5ccc7, 0.38).fillRect(0, top, 390, 112);
    g.fillStyle(0x8fa09d, 0.28).fillRect(0, top + 112, 390, 122);

    // Irregular distant ridge instead of clean triangles.
    fillPoly([
      [0, top + 206], [28, top + 168], [58, top + 190], [91, top + 128],
      [121, top + 175], [154, top + 151], [194, top + 201], [228, top + 144],
      [270, top + 78], [302, top + 130], [336, top + 174], [390, top + 143],
      [390, top + 270], [0, top + 270],
    ], 0x728785, 0.42);

    // Distant forest is built from overlapping vertical masses.
    const farTrees = [
      [4, 272, 92, 29], [31, 278, 118, 34], [62, 274, 83, 28], [91, 280, 128, 36],
      [123, 276, 98, 31], [154, 282, 120, 34], [188, 278, 88, 29], [221, 279, 114, 34],
      [253, 276, 95, 30], [286, 281, 126, 36], [321, 278, 102, 31], [354, 280, 116, 34],
      [384, 276, 91, 28],
    ] as const;

    farTrees.forEach(([x, baseOffset, treeH, treeW], i) => {
      const baseY = top + baseOffset;
      this.add.rectangle(x, baseY - treeH * 0.33, 4, treeH * 0.42, 0x4c6262, 0.42);
      this.add.ellipse(x, baseY - treeH * 0.64, treeW, treeH * 0.72, 0x5d7371, 0.48);
      this.add.ellipse(x - 3, baseY - treeH * 0.42, treeW * 1.18, treeH * 0.54, 0x536967, 0.38);
      if (i % 3 === 0) this.add.ellipse(x + 4, baseY - treeH * 0.79, treeW * 0.7, treeH * 0.35, 0x667b78, 0.32);
    });

    // Ground.
    g.fillStyle(0x6c7869, 1).fillRect(0, top + 274, 390, h - 274);
    g.fillStyle(0x5d695e, 0.36).fillRect(0, top + 365, 390, h - 365);

    // Foreground forest walls: broad overlapping silhouettes, less icon-like.
    const left = [
      [5, 345, 188, 54], [29, 358, 151, 47], [57, 347, 211, 58],
      [91, 360, 169, 51], [119, 350, 196, 56], [146, 363, 144, 46],
    ] as const;
    const right = [
      [386, 347, 196, 56], [359, 360, 153, 47], [330, 349, 214, 58],
      [298, 360, 171, 51], [270, 351, 198, 55], [245, 363, 145, 45],
    ] as const;

    const drawForestTree = (x: number, baseOffset: number, treeH: number, treeW: number, dark: boolean) => {
      const baseY = top + baseOffset;
      const color = dark ? 0x314548 : 0x43585a;
      this.add.rectangle(x, baseY - treeH * 0.28, 6, treeH * 0.36, 0x2d3c3e, 0.88);
      this.add.ellipse(x, baseY - treeH * 0.67, treeW * 0.72, treeH * 0.62, color, 0.95);
      this.add.ellipse(x - 4, baseY - treeH * 0.46, treeW, treeH * 0.58, color, 0.95);
      this.add.ellipse(x + 3, baseY - treeH * 0.27, treeW * 1.12, treeH * 0.42, color, 0.94);
    };

    left.forEach(([x, b, th, tw], i) => drawForestTree(x, b, th, tw, i % 2 === 0));
    right.forEach(([x, b, th, tw], i) => drawForestTree(x, b, th, tw, i % 2 !== 0));

    // Curving, uneven road.
    fillPoly([
      [190, top + 224], [202, top + 229], [218, top + 292], [244, top + 365],
      [282, top + 446], [322, bottom], [72, bottom], [108, top + 454],
      [140, top + 382], [164, top + 310],
    ], 0x747468, 1);

    fillPoly([
      [194, top + 237], [200, top + 239], [211, top + 298], [231, top + 369],
      [260, top + 448], [287, bottom], [108, bottom], [136, top + 456],
      [158, top + 387], [176, top + 317],
    ], 0x8d8b7b, 0.98);

    fillPoly([
      [196, top + 251], [200, top + 253], [207, top + 308], [220, top + 379],
      [238, top + 454], [251, bottom], [157, bottom], [169, top + 458],
      [179, top + 390], [188, top + 319],
    ], 0xa49f8b, 0.25);

    // Vegetation and erosion breaking the perfect road edge.
    const edgeMarks = [
      [126, top + 357, 30, 11], [112, top + 396, 38, 12], [96, top + 445, 46, 13], [79, top + 494, 55, 15],
      [265, top + 362, 29, 11], [280, top + 402, 38, 12], [297, top + 447, 47, 14], [315, top + 494, 55, 16],
    ] as const;
    edgeMarks.forEach(([x, y, ww, hh], i) => {
      this.add.ellipse(x, y, ww, hh, i % 2 ? 0x566b59 : 0x607461, 0.54);
    });

    // Tiny stones/puddles give the road material variation.
    [
      [148, top + 383, 11, 5], [242, top + 419, 9, 4], [132, top + 468, 13, 6],
      [264, top + 493, 16, 5], [176, top + 507, 9, 4],
    ].forEach(([x, y, ww, hh]) => this.add.ellipse(x, y, ww, hh, 0x555a50, 0.43));

    this.add.ellipse(212, top + 452, 48, 10, 0xc6c4b6, 0.06);
    this.add.ellipse(190, top + 499, 66, 12, 0xc6c4b6, 0.05);

    // Slow, subtle fog.
    for (let i = 0; i < 5; i++) {
      const fog = this.add.ellipse(
        25 + i * 92,
        top + 188 + (i % 3) * 39,
        154 + (i % 2) * 40,
        24 + (i % 2) * 7,
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

    // Near foliage vignette.
    this.add.ellipse(-43, top + 350, 160, 430, 0x25393b, 0.16);
    this.add.ellipse(433, top + 365, 170, 445, 0x25393b, 0.16);

    if (view.visual === 'herb') this.drawHerb(top);
    if (view.visual === 'tracks') this.drawTracks(top);
    if (view.visual === 'wolves') this.drawWolves(top);
    if (view.visual === 'cleared') this.drawCleared(top);

    const worldObjects = this.children.list.filter((child) => !beforeWorld.has(child));
    const world = this.add.container(0, 116 * (1 - this.sceneScaleY));
    world.add(worldObjects);
    world.setScale(1, this.sceneScaleY);
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
    const top = this.copyTop;
    const h = this.logicalHeight - top;

    this.add.rectangle(195, top + h / 2, 390, h, C.surface, 1);
    this.add.rectangle(195, top, 390, 1, 0x899296, 0.22);

    this.add.text(20, top + 13, view.title, {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '27px',
      color: C.ink,
      fontStyle: 'bold',
    });

    this.add.text(20, top + 51, view.text, {
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: '14px',
      color: C.muted,
      wordWrap: { width: 350 },
      lineSpacing: 4,
    });

    const buttonY = top + 165;
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
    const overlay = this.add.rectangle(195, this.logicalHeight / 2, 390, this.logicalHeight, 0x000000, 0.46)
      .setInteractive()
      .setDepth(100);

    const panelY = this.logicalHeight - 140;
    const panel = this.add.rectangle(195, panelY, 354, 244, C.deep, 1)
      .setStrokeStyle(1, 0x8f856f, 1)
      .setDepth(101);

    const title = this.add.text(38, panelY - 94, 'Добыча похода', {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '24px',
      color: C.goldCss,
      fontStyle: 'bold',
    }).setDepth(102);

    const label = this.add.text(38, panelY - 42, 'Лечебная трава', {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '15px',
      color: C.ink,
    }).setDepth(102);

    const value = this.add.text(344, panelY - 42, `×${herb}`, {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: '18px',
      color: C.goldCss,
      fontStyle: 'bold',
    }).setOrigin(1, 0).setDepth(102);

    const note = this.add.text(38, panelY - 8, 'Перенесётся в инвентарь после завершения пути.', {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '12px',
      color: C.muted,
      wordWrap: { width: 310 },
    }).setDepth(102);

    const close = this.add.rectangle(195, panelY + 82, 310, 48, C.surface, 1)
      .setStrokeStyle(1, 0xaa9b7d, 1)
      .setInteractive({ useHandCursor: true })
      .setDepth(102);

    const closeText = this.add.text(195, panelY + 82, 'Закрыть', {
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
