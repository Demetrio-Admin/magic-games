import * as Phaser from 'phaser';
import { FONT, UI } from '../ui/theme';
import { createScreenLayout, type ScreenLayout } from '../ui/layout';

type Action = 'strike' | 'push' | 'guard';
type Target = 'wolf' | 'leader';

export class BattleScene extends Phaser.Scene {
  private selectedAction: Action | null = null;
  private selectedTarget: Target = 'wolf';
  private selectedHero = 0;
  private prompt?: Phaser.GameObjects.Text;
  private confirmLabel?: Phaser.GameObjects.Text;
  private confirmHint?: Phaser.GameObjects.Text;
  private confirmSurface?: Phaser.GameObjects.Rectangle;
  private layout!: ScreenLayout;

  constructor() {
    super('BattleScene');
  }

  create() {
    this.layout = createScreenLayout(this, {
      headerHeight: 78,
      footerMin: 86,
      footerMax: 94,
      footerRatio: 0.115,
      margin: 16,
    });

    const stage = Number(this.registry.get('battleStage') ?? 0);
    this.selectedAction = null;
    this.selectedTarget = stage === 0 ? 'wolf' : 'leader';
    this.selectedHero = 0;

    this.cameras.main.setBackgroundColor(UI.colors.worldDeep);
    this.drawArena(stage);
    this.drawHeader(stage);
    this.drawEnemies(stage);
    this.drawThreat(stage);
    this.drawAbilityReveal(stage);
    this.drawParty(stage);
    this.drawCombatSurface(stage);
  }

  private drawArena(stage: number) {
    const { world, width } = this.layout;
    const g = this.add.graphics();

    g.fillStyle(0x0b2221, 1).fillRect(0, world.y, width, world.height);
    g.fillStyle(0x14322d, 1).fillRect(0, world.y + world.height * 0.31, width, world.height * 0.69);

    const horizon = world.y + world.height * 0.73;

    g.fillStyle(0x102523, 1);
    g.fillTriangle(0, horizon, 82, world.y + world.height * 0.12, 152, horizon);
    g.fillTriangle(238, horizon, 324, world.y + world.height * 0.09, 390, horizon);

    g.fillStyle(0x1b2d29, 1);
    g.fillTriangle(
      92,
      world.bottom,
      194,
      world.y + world.height * 0.45,
      302,
      world.bottom,
    );

    for (let i = 0; i < 6; i++) {
      const fog = this.add.ellipse(
        45 + i * 70,
        world.y + world.height * (0.30 + (i % 2) * 0.05),
        124,
        28,
        UI.colors.fog,
        0.035,
      );

      this.tweens.add({
        targets: fog,
        x: fog.x + 12,
        duration: 3600 + i * 300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });
    }

    if (stage === 1) {
      const dangerGlow = this.add.circle(
        270,
        world.y + world.height * 0.22,
        78,
        UI.colors.amber,
        0.055,
      );

      this.tweens.add({
        targets: dangerGlow,
        alpha: { from: 0.035, to: 0.10 },
        scale: { from: 0.95, to: 1.08 },
        duration: 900,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  private drawHeader(stage: number) {
    const { width, header, safeTop } = this.layout;
    const bodyY = safeTop;
    const panelY = bodyY + 36;

    this.add.rectangle(width / 2, header.centerY, width, header.height, UI.colors.surface, 0.94)
      .setDepth(19);

    this.add.rectangle(width / 2, panelY, width - 32, 54, UI.colors.surfaceRaised, 0.68)
      .setStrokeStyle(1, UI.colors.metal, 0.28)
      .setDepth(20);

    this.add.text(28, bodyY + 18, 'ВОЛКИ У ВОРОТ', {
      fontFamily: FONT.serif,
      fontSize: '17px',
      color: UI.colors.text,
      fontStyle: 'bold',
    }).setDepth(21);

    this.add.text(28, bodyY + 41, 'Старая дорога', {
      fontFamily: FONT.sans,
      fontSize: '9px',
      color: UI.colors.textMuted,
      letterSpacing: 0.8,
    }).setDepth(21);

    this.add.text(344, bodyY + 28, `0${Math.min(stage + 1, 3)}`, {
      fontFamily: FONT.serif,
      fontSize: '20px',
      color: stage === 1 ? '#c99b62' : '#72c8a4',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(21);

    this.add.text(344, bodyY + 48, 'ХОД', {
      fontFamily: FONT.sans,
      fontSize: '7px',
      color: UI.colors.textDim,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(21);

    this.add.rectangle(width / 2, header.bottom - 1, width, 2, UI.colors.metalSoft, 0.18).setDepth(22);
  }

  private drawEnemies(stage: number) {
    const { world } = this.layout;
    const baseY = world.y + world.height * 0.255;
    const wolfHp = Number(this.registry.get('wolfHp') ?? 12);
    const leaderHp = Number(this.registry.get('leaderHp') ?? 18);

    this.drawEnemy(
      116,
      baseY + 8,
      'wolf',
      'Серый волк',
      wolfHp,
      12,
      false,
      stage === 0 ? 'Укус · 3' : 'Повержен',
    );

    this.drawEnemy(
      274,
      baseY - 4,
      'leader',
      'Вожак',
      leaderHp,
      18,
      true,
      stage === 0 ? 'Наблюдает' : stage === 1 ? 'Рывок · 6' : 'Сорвано',
    );
  }

  private drawEnemy(
    x: number,
    y: number,
    target: Target,
    name: string,
    hp: number,
    maxHp: number,
    leader: boolean,
    intent: string,
  ) {
    const alive = hp > 0;
    const selected = target === this.selectedTarget && alive;

    const focus = this.add.circle(x, y, leader ? 61 : 55, UI.colors.surface, 0.30)
      .setStrokeStyle(
        selected ? 2 : 1,
        selected ? UI.colors.emerald : UI.colors.metalSoft,
        selected ? 0.95 : 0.28,
      )
      .setInteractive({ useHandCursor: alive })
      .setDepth(8);

    if (alive) focus.on('pointerdown', () => this.selectTarget(target));

    const g = this.add.graphics().setDepth(9);
    const body = leader ? 0x211c1c : 0x1b2423;
    const alpha = alive ? 1 : 0.32;

    g.fillStyle(body, alpha);
    g.fillEllipse(x, y + 5, leader ? 92 : 79, leader ? 52 : 46);
    g.fillTriangle(x + 28, y - 10, x + 49, y - 35, x + 52, y - 3);
    g.fillTriangle(x + 33, y - 27, x + 39, y - 48, x + 47, y - 22);
    g.fillTriangle(x + 47, y - 26, x + 56, y - 47, x + 60, y - 19);
    g.fillTriangle(x - 42, y + 2, x - 68, y - 12, x - 38, y + 13);

    this.add.circle(
      x + 44,
      y - 15,
      2,
      leader ? UI.colors.amber : UI.colors.emerald,
      alive ? 0.86 : 0.16,
    ).setDepth(10);

    this.add.text(x, y + 66, name, {
      fontFamily: FONT.serif,
      fontSize: '13px',
      color: alive ? UI.colors.text : UI.colors.textDim,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(10);

    this.add.rectangle(x, y + 86, 102, 5, UI.colors.hpBack, 1).setDepth(10);

    const ratio = Phaser.Math.Clamp(hp / maxHp, 0, 1);
    if (ratio > 0) {
      this.add.rectangle(
        x - 51,
        y + 86,
        102 * ratio,
        4,
        alive ? 0x7b6d55 : 0x48504c,
        1,
      ).setOrigin(0, 0.5).setDepth(11);
    }

    this.add.text(x, y + 101, `${Math.max(0, hp)} / ${maxHp}`, {
      fontFamily: FONT.sans,
      fontSize: '8px',
      color: UI.colors.textDim,
    }).setOrigin(0.5).setDepth(10);

    this.add.text(x, y + 120, intent, {
      fontFamily: FONT.sans,
      fontSize: '9px',
      color: intent.includes('6') ? '#d0a06e' : UI.colors.textMuted,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(10);
  }

  private drawThreat(stage: number) {
    const { world, margin, width } = this.layout;
    const centerY = world.y + world.height * 0.51;
    const threatWidth = width - margin * 2;

    this.add.rectangle(width / 2, centerY, threatWidth, 70, UI.colors.surface, 0.80)
      .setStrokeStyle(1, UI.colors.metal, 0.25)
      .setDepth(18);

    const label = stage === 0
      ? 'БЛИЖАЙШАЯ УГРОЗА'
      : stage === 1
        ? 'КРИТИЧЕСКИЙ УЗЕЛ'
        : 'УГРОЗА СОРВАНА';

    const copy = stage === 0
      ? 'Серый волк атакует Адама в конце хода.'
      : stage === 1
        ? 'Вожак готовит рывок. «Толчок I» может сорвать атаку.'
        : 'Стая теряет инициативу. Дорога снова открыта.';

    this.add.text(margin + 10, centerY - 23, label, {
      fontFamily: FONT.sans,
      fontSize: '8px',
      color: stage === 1 ? '#c99a68' : '#6fcaa5',
      fontStyle: 'bold',
      letterSpacing: 1,
    }).setDepth(19);

    this.prompt = this.add.text(margin + 10, centerY - 4, copy, {
      fontFamily: FONT.sans,
      fontSize: '11px',
      color: UI.colors.textMuted,
      wordWrap: { width: threatWidth - 38 },
      lineSpacing: 3,
    }).setDepth(19);

    const timelineY = centerY - 22;
    this.add.rectangle(width - 90, timelineY, 45, 2, UI.colors.metalSoft, 0.35).setDepth(19);
    this.add.circle(width - 99, timelineY, 3, UI.colors.emerald, 0.75).setDepth(20);
    this.add.circle(
      width - 62,
      timelineY,
      3,
      stage === 1 ? UI.colors.amber : UI.colors.metalSoft,
      0.85,
    ).setDepth(20);
  }

  private drawAbilityReveal(stage: number) {
    if (stage >= 2) return;

    const { world } = this.layout;
    const y = world.bottom - 152;

    const abilities: Array<{ action: Action; label: string; icon: string; enabled: boolean }> = [
      { action: 'strike', label: 'Удар I', icon: '✦', enabled: stage === 0 },
      { action: 'push', label: 'Толчок I', icon: '↝', enabled: stage === 1 },
      { action: 'guard', label: 'Щит', icon: '◇', enabled: true },
    ];

    const startX = 54;

    abilities.forEach((a, i) => {
      const x = startX + i * 92;
      const selected = this.selectedAction === a.action;

      const chip = this.add.rectangle(
        x,
        y,
        82,
        44,
        UI.colors.surfaceRaised,
        a.enabled ? 0.95 : 0.45,
      )
        .setStrokeStyle(
          selected ? 2 : 1,
          selected ? UI.colors.emerald : UI.colors.metalSoft,
          selected ? 0.95 : 0.38,
        )
        .setDepth(33);

      if (a.enabled) {
        chip.setInteractive({ useHandCursor: true })
          .on('pointerdown', () => this.selectAction(a.action));
      }

      this.add.text(x - 27, y, a.icon, {
        fontFamily: FONT.serif,
        fontSize: '15px',
        color: a.enabled ? '#72cca7' : UI.colors.textDim,
      }).setOrigin(0.5).setDepth(34);

      this.add.text(x + 8, y, a.label, {
        fontFamily: FONT.sans,
        fontSize: '8px',
        color: a.enabled ? UI.colors.text : UI.colors.textDim,
        fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(34);
    });
  }

  private drawParty(stage: number) {
    const { world, width } = this.layout;
    const totalWidth = UI.hero.width * 4 + UI.hero.gap * 3;
    const startX = (width - totalWidth) / 2 + UI.hero.width / 2;
    const y = world.bottom - 66;
    const heroHp = Number(this.registry.get('heroHp') ?? 20);

    for (let i = 0; i < 4; i++) {
      const x = startX + i * (UI.hero.width + UI.hero.gap);
      const unlocked = i === 0;
      const selected = i === this.selectedHero;

      const card = this.add.rectangle(x, y, UI.hero.width, UI.hero.height, UI.colors.surface, 0.95)
        .setStrokeStyle(
          selected ? 2 : 1,
          selected ? UI.colors.emerald : UI.colors.metalSoft,
          selected ? 0.95 : 0.38,
        )
        .setInteractive({ useHandCursor: unlocked })
        .setDepth(30);

      if (unlocked) {
        card.on('pointerdown', () => {
          this.selectedHero = 0;
          this.scene.restart();
        });
      }

      this.add.circle(x, y - 19, 18, unlocked ? 0x42584f : 0x263432, 1).setDepth(31);

      if (unlocked) {
        this.add.circle(x, y - 25, 6, 0xc7baa4, 1).setDepth(32);
        this.add.rectangle(x, y - 8, 20, 15, 0x384943, 1).setDepth(32);
        this.add.text(x, y + 10, 'АДАМ', {
          fontFamily: FONT.sans,
          fontSize: '7px',
          color: UI.colors.text,
          fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(32);
      } else {
        this.add.text(x, y - 15, '+', {
          fontFamily: FONT.sans,
          fontSize: '17px',
          color: UI.colors.textDim,
        }).setOrigin(0.5).setDepth(32);
      }

      this.add.text(x - 22, y - 36, unlocked ? '✦' : '·', {
        fontFamily: FONT.serif,
        fontSize: '10px',
        color: unlocked ? '#70d0a7' : UI.colors.textDim,
      }).setDepth(33);

      this.add.rectangle(x, y + 34, 48, 4, UI.colors.hpBack, 1).setDepth(31);

      if (unlocked) {
        this.add.rectangle(
          x - 24,
          y + 34,
          48 * Phaser.Math.Clamp(heroHp / 20, 0, 1),
          3,
          UI.colors.hp,
          1,
        ).setOrigin(0, 0.5).setDepth(32);
      }
    }
  }

  private drawCombatSurface(stage: number) {
    const { width, footer, contentBottom } = this.layout;
    const usableFooterHeight = contentBottom - footer.y;
    const actionHeight = Math.min(UI.action.height, usableFooterHeight - 8);
    const y = footer.y + usableFooterHeight / 2;
    const horizontalSafe = UI.safe;
    const surfaceWidth = width - horizontalSafe * 2;
    const centerWidth = surfaceWidth - UI.action.quickWidth * 2;

    this.add.rectangle(width / 2, footer.centerY, width, footer.height, UI.colors.worldDeep, 1)
      .setDepth(39);

    this.add.rectangle(width / 2, y, surfaceWidth, actionHeight, UI.colors.surface, 0.98)
      .setStrokeStyle(1, UI.colors.metal, 0.52)
      .setDepth(40);

    this.drawCombatQuick(horizontalSafe + 32, y, '↶', 'Отмена', () => {
      this.selectedAction = null;
      this.scene.restart();
    });

    this.drawCombatQuick(width - horizontalSafe - 32, y, '◎', 'Цель', () => {
      this.selectedTarget = this.selectedTarget === 'wolf' ? 'leader' : 'wolf';
      this.scene.restart();
    });

    this.confirmSurface = this.add.rectangle(
      width / 2,
      y,
      centerWidth,
      Math.max(52, actionHeight - 8),
      UI.colors.surfaceRaised,
      0.95,
    )
      .setInteractive({ useHandCursor: true })
      .setDepth(41);

    let label = 'Выберите приём';
    let hint = 'Способности раскрыты над Адамом';

    if (stage >= 2) {
      label = 'Завершить бой';
      hint = 'Дорога свободна';
    } else if (this.selectedAction) {
      label = this.selectedAction === 'strike'
        ? 'Применить «Удар I»'
        : this.selectedAction === 'push'
          ? 'Применить «Толчок I»'
          : 'Поднять щит';

      hint = `Цель: ${this.selectedTarget === 'wolf' ? 'Серый волк' : 'Вожак'}`;
    }

    this.confirmLabel = this.add.text(width / 2, y - 7, label, {
      fontFamily: FONT.sans,
      fontSize: '12px',
      color: UI.colors.text,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(42);

    this.confirmHint = this.add.text(width / 2, y + 16, hint, {
      fontFamily: FONT.sans,
      fontSize: '8px',
      color: stage === 1 ? '#c99a68' : UI.colors.textMuted,
    }).setOrigin(0.5).setDepth(42);

    this.confirmSurface.on('pointerdown', () => this.confirm(stage));
  }

  private drawCombatQuick(x: number, y: number, icon: string, label: string, cb: () => void) {
    const zone = this.add.rectangle(x, y, 64, 64, UI.colors.surface, 0.01)
      .setInteractive({ useHandCursor: true })
      .setDepth(43);

    this.add.text(x, y - 12, icon, {
      fontFamily: FONT.serif,
      fontSize: '15px',
      color: '#70c6a3',
    }).setOrigin(0.5).setDepth(44);

    this.add.text(x, y + 13, label, {
      fontFamily: FONT.sans,
      fontSize: '8px',
      color: UI.colors.textMuted,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(44);

    zone.on('pointerdown', cb);
  }

  private selectAction(action: Action) {
    this.selectedAction = action;
    this.scene.restart();
  }

  private selectTarget(target: Target) {
    this.selectedTarget = target;
    this.scene.restart();
  }

  private confirm(stage: number) {
    if (stage >= 2) {
      this.registry.set('travelBeat', 0);
      this.registry.set('roadStep', 3);
      this.scene.start('RewardScene');
      return;
    }

    if (!this.selectedAction) {
      this.prompt?.setText('Сначала выберите приём над портретом Адама.');
      return;
    }

    if (stage === 0 && this.selectedAction === 'strike' && this.selectedTarget === 'wolf') {
      this.registry.set('wolfHp', 0);
      this.registry.set('heroHp', 17);
      this.registry.set('battleStage', 1);
      this.cameras.main.flash(110, 100, 190, 150);
      this.time.delayedCall(130, () => this.scene.restart());
      return;
    }

    if (stage === 1 && this.selectedAction === 'push' && this.selectedTarget === 'leader') {
      this.registry.set('leaderHp', 15);
      this.registry.set('battleStage', 2);
      this.cameras.main.shake(120, 0.004);
      this.time.delayedCall(130, () => this.scene.restart());
      return;
    }

    if (this.selectedAction === 'guard') {
      this.prompt?.setText('Щит готов, но сейчас есть более сильный ответ на угрозу.');
      return;
    }

    this.prompt?.setText('Эта связка приёма и цели сейчас не решает угрозу.');
  }
}
