import * as Phaser from 'phaser';

type Action = 'strike' | 'push';

export class BattleScene extends Phaser.Scene {
  private selectedAction: Action | null = null;
  private prompt!: Phaser.GameObjects.Text;

  constructor() {
    super('BattleScene');
  }

  preload() {
    if (!this.textures.exists('adam')) this.load.image('adam', 'audit/adam.webp');
    if (!this.textures.exists('wolf')) this.load.image('wolf', 'audit/wolf.webp');
    if (!this.textures.exists('leader')) this.load.image('leader', 'audit/leader.webp');
    if (!this.textures.exists('strike')) this.load.image('strike', 'audit/strike.webp');
    if (!this.textures.exists('push')) this.load.image('push', 'audit/push.webp');
  }

  create() {
    const stage = Number(this.registry.get('battleStage') ?? 0);
    const heroHp = Number(this.registry.get('heroHp') ?? 20);
    const wolfHp = Number(this.registry.get('wolfHp') ?? 12);
    const leaderHp = Number(this.registry.get('leaderHp') ?? 18);
    this.selectedAction = null;

    this.cameras.main.setBackgroundColor('#26343b');
    this.drawHeader(stage);
    this.drawEnemies(stage, wolfHp, leaderHp);
    this.drawPrompt(stage);
    this.drawParty(heroHp);
    this.drawActions(stage);
  }

  private drawHeader(stage: number) {
    const w = this.scale.width;
    this.add.rectangle(w / 2, 46, w, 92, 0x34434b, 1);
    this.add.text(18, 17, 'ВОЛКИ У ВОРОТ', {
      fontFamily: 'Georgia, serif', fontSize: '21px', color: '#f0e2c6', fontStyle: 'bold',
    });
    this.add.text(18, 51, 'Тихая долина · Старая дорога', { fontFamily: 'system-ui', fontSize: '11px', color: '#aab4b5' });

    this.add.rectangle(w - 55, 34, 78, 38, 0x26343b, 0.95).setStrokeStyle(1, 0xe8c98d, 0.5);
    this.add.text(w - 55, 34, `РАУНД ${stage === 0 ? 1 : 2}`, { fontFamily: 'system-ui', fontSize: '10px', color: '#e8c98d', fontStyle: 'bold' }).setOrigin(0.5);
  }

  private drawEnemies(stage: number, wolfHp: number, leaderHp: number) {
    this.drawEnemy(112, 168, 'wolf', 'Серый волк', wolfHp, 12, stage === 0 ? 'Атака · 3' : 'Повержен', 'wolf');
    this.drawEnemy(278, 168, 'leader', 'Вожак стаи', leaderHp, 18, stage === 0 ? 'Наблюдает' : stage === 1 ? 'Сильная атака · 6' : 'Атака сорвана', 'leader');
  }

  private drawEnemy(x: number, y: number, texture: string, name: string, hp: number, maxHp: number, intent: string, target: 'wolf' | 'leader') {
    const alive = hp > 0;
    const ring = this.add.circle(x, y, 59, 0x34434b, 1).setStrokeStyle(2, alive ? 0xe8c98d : 0x667277, alive ? 0.75 : 0.35);
    const image = this.add.image(x, y, texture).setDisplaySize(104, 104).setAlpha(alive ? 1 : 0.33);
    ring.setInteractive({ useHandCursor: alive });
    if (alive) ring.on('pointerdown', () => this.targetEnemy(target));
    image.setInteractive({ useHandCursor: alive });
    if (alive) image.on('pointerdown', () => this.targetEnemy(target));

    if (!alive) {
      this.add.rectangle(x, y, 88, 28, 0x26343b, 0.84);
      this.add.text(x, y, 'ПОВЕРЖЕН', { fontFamily: 'system-ui', fontSize: '9px', color: '#d2d6d4', fontStyle: 'bold' }).setOrigin(0.5);
    }

    this.add.text(x, y + 68, name, { fontFamily: 'Georgia, serif', fontSize: '14px', color: alive ? '#f0e2c6' : '#879296', fontStyle: 'bold' }).setOrigin(0.5);
    this.drawHpBar(x, y + 91, 120, hp, maxHp);
    this.add.text(x, y + 105, `${Math.max(0, hp)} / ${maxHp}`, { fontFamily: 'system-ui', fontSize: '9px', color: '#aeb8b9' }).setOrigin(0.5);

    const danger = intent.includes('атака') || intent.includes('Атака');
    this.add.text(x, y + 126, intent, { fontFamily: 'system-ui', fontSize: '10px', color: danger ? '#d9a18f' : '#aeb8b9', fontStyle: 'bold' }).setOrigin(0.5);
  }

  private drawHpBar(x: number, y: number, width: number, hp: number, maxHp: number) {
    this.add.rectangle(x, y, width, 8, 0x1f2b30, 1);
    const ratio = Phaser.Math.Clamp(hp / maxHp, 0, 1);
    if (ratio > 0) this.add.rectangle(x - width / 2, y, width * ratio, 6, 0x47764d, 1).setOrigin(0, 0.5);
  }

  private drawPrompt(stage: number) {
    const copy = stage === 0
      ? 'Выберите «Удар I», затем Серого волка.'
      : stage === 1
        ? 'Вожак готовит сильную атаку. Сорвите её «Толчком I».'
        : 'Атака вожака сорвана. Путь свободен.';

    this.add.rectangle(195, 345, 354, 50, 0x34434b, 0.9).setStrokeStyle(1, 0x66767d, 0.45);
    this.prompt = this.add.text(195, 345, copy, {
      fontFamily: 'system-ui', fontSize: '12px', color: '#d2d6d4', align: 'center', wordWrap: { width: 328 },
    }).setOrigin(0.5);
  }

  private drawParty(heroHp: number) {
    this.add.text(20, 389, 'ВАШ ОТРЯД', { fontFamily: 'system-ui', fontSize: '9px', color: '#97a3a6', fontStyle: 'bold', letterSpacing: 1 });

    const x = 195;
    this.add.circle(x, 470, 52, 0x34434b, 1).setStrokeStyle(2, 0xe8c98d, 0.8);
    this.add.image(x, 470, 'adam').setDisplaySize(92, 92);
    this.add.text(x, 532, 'АДАМ', { fontFamily: 'Georgia, serif', fontSize: '15px', color: '#f0e2c6', fontStyle: 'bold' }).setOrigin(0.5);
    this.drawHpBar(x, 554, 156, heroHp, 20);
    this.add.text(x, 568, `${heroHp} / 20 HP`, { fontFamily: 'system-ui', fontSize: '10px', color: '#aeb8b9' }).setOrigin(0.5);
  }

  private drawActions(stage: number) {
    this.add.rectangle(195, 690, 390, 180, 0x34434b, 1).setStrokeStyle(1, 0x66767d, 0.35);
    this.add.text(19, 612, stage < 2 ? 'ВЫБЕРИТЕ ДЕЙСТВИЕ' : 'БОЙ ЗАВЕРШЁН', {
      fontFamily: 'system-ui', fontSize: '9px', color: '#97a3a6', fontStyle: 'bold', letterSpacing: 1,
    });

    if (stage >= 2) {
      const done = this.add.rectangle(195, 704, 352, 54, 0xe8c98d, 1).setInteractive({ useHandCursor: true });
      this.add.text(195, 704, 'ЗАВЕРШИТЬ БОЙ', { fontFamily: 'system-ui', fontSize: '13px', color: '#26343b', fontStyle: 'bold' }).setOrigin(0.5);
      done.on('pointerdown', () => {
        this.registry.set('roadStep', 3);
        this.scene.start('RoadScene');
      });
      return;
    }

    this.drawActionCard(102, 690, 'strike', 'Удар I', '12 урона', stage === 0, 'strike');
    this.drawActionCard(288, 690, 'push', 'Толчок I', '3 урона · срыв', stage === 1, 'push');
  }

  private drawActionCard(x: number, y: number, texture: string, title: string, desc: string, enabled: boolean, action: Action) {
    const fill = enabled ? 0x46545a : 0x303d43;
    const card = this.add.rectangle(x, y, 174, 108, fill, enabled ? 1 : 0.55)
      .setStrokeStyle(1, enabled ? 0xe8c98d : 0x5a686e, enabled ? 0.6 : 0.25);
    if (enabled) card.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.selectAction(action, card));

    this.add.image(x - 56, y - 18, texture).setDisplaySize(42, 42).setAlpha(enabled ? 1 : 0.4);
    this.add.text(x - 28, y - 32, title, { fontFamily: 'Georgia, serif', fontSize: '14px', color: enabled ? '#f0e2c6' : '#778489', fontStyle: 'bold' });
    this.add.text(x - 28, y - 8, desc, { fontFamily: 'system-ui', fontSize: '9px', color: enabled ? '#cbd0cf' : '#68757a' });
    this.add.text(x - 75, y + 34, enabled ? 'ВЫБРАТЬ' : 'НЕДОСТУПНО', { fontFamily: 'system-ui', fontSize: '9px', color: enabled ? '#e8c98d' : '#69767b', fontStyle: 'bold' });
  }

  private selectAction(action: Action, card: Phaser.GameObjects.Rectangle) {
    this.selectedAction = action;
    card.setStrokeStyle(2, 0xffd88b, 1);
    this.prompt.setText(action === 'strike' ? 'Теперь выберите Серого волка.' : 'Теперь выберите Вожака стаи.');
  }

  private targetEnemy(target: 'wolf' | 'leader') {
    const stage = Number(this.registry.get('battleStage') ?? 0);
    if (stage === 0 && this.selectedAction === 'strike' && target === 'wolf') {
      this.registry.set('wolfHp', 0);
      this.registry.set('heroHp', 17);
      this.registry.set('battleStage', 1);
      this.cameras.main.flash(140, 235, 216, 139);
      this.time.delayedCall(160, () => this.scene.restart());
      return;
    }

    if (stage === 1 && this.selectedAction === 'push' && target === 'leader') {
      this.registry.set('leaderHp', 15);
      this.registry.set('battleStage', 2);
      this.cameras.main.shake(130, 0.004);
      this.time.delayedCall(160, () => this.scene.restart());
      return;
    }

    if (this.selectedAction) this.prompt.setText('Эта цель не подходит для выбранного действия.');
    else this.prompt.setText('Сначала выберите действие.');
  }
}
