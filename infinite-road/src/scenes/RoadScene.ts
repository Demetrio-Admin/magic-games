import * as Phaser from 'phaser';

type RoadView = {
  image: string;
  title: string;
  text: string;
  button: string;
  accent?: 'herb' | 'tracks' | 'cleared';
};

export class RoadScene extends Phaser.Scene {
  constructor() {
    super('RoadScene');
  }

  preload() {
    if (!this.textures.exists('road-start')) this.load.image('road-start', 'audit/road-start.webp');
    if (!this.textures.exists('road-after-herb')) this.load.image('road-after-herb', 'audit/road-after-herb.webp');
    if (!this.textures.exists('road-wolves')) this.load.image('road-wolves', 'audit/road-wolves.webp');
  }

  create() {
    if (this.registry.get('roadStep') === undefined) this.registry.set('roadStep', 0);
    if (this.registry.get('herbCollected') === undefined) this.registry.set('herbCollected', false);
    if (this.registry.get('encounterFound') === undefined) this.registry.set('encounterFound', false);

    const step = Number(this.registry.get('roadStep') ?? 0);
    const herbCollected = Boolean(this.registry.get('herbCollected'));
    const encounterFound = Boolean(this.registry.get('encounterFound'));
    const view = this.getView(step, herbCollected, encounterFound);

    this.cameras.main.setBackgroundColor('#26343b');
    this.drawHeader(step);
    this.drawRoadArt(view);
    this.drawCopy(view);
  }

  private getView(step: number, herbCollected: boolean, encounterFound: boolean): RoadView {
    if (step === 0) {
      return {
        image: 'road-start',
        title: 'У старого тракта',
        text: 'Дорога заросла, но следы ещё свежие.',
        button: 'Идти дальше',
      };
    }

    if (step === 1 && !herbCollected) {
      return {
        image: 'road-start',
        title: 'Что-то у обочины',
        text: 'Между камнями растёт лечебная трава. Она пригодится в пути.',
        button: 'Собрать траву',
        accent: 'herb',
      };
    }

    if (step === 1) {
      return {
        image: 'road-after-herb',
        title: 'Трава собрана',
        text: 'Лечебная трава отправляется в сумку. Впереди дорога становится тише.',
        button: 'Продолжить',
      };
    }

    if (step === 2 && !encounterFound) {
      return {
        image: 'road-after-herb',
        title: 'Следы на дороге',
        text: 'На влажной земле видны свежие следы. Из-за ворот доносится низкое рычание.',
        button: 'Осмотреть угрозу',
        accent: 'tracks',
      };
    }

    if (step === 2) {
      return {
        image: 'road-wolves',
        title: 'Волки у ворот',
        text: 'Серый волк и вожак стаи перекрыли дорогу.',
        button: 'Вступить в бой',
      };
    }

    return {
      image: 'road-after-herb',
      title: 'Дорога свободна',
      text: 'Волки отступили. Путь в Тихую долину снова открыт.',
      button: 'Завершить путь',
      accent: 'cleared',
    };
  }

  private drawHeader(step: number) {
    const w = this.scale.width;
    this.add.rectangle(w / 2, 55, w, 110, 0x34434b, 1);
    this.add.line(0, 109, 0, 0, w, 0, 0x627179, 0.45).setOrigin(0);

    const back = this.add.circle(31, 31, 19, 0x26343b, 0.95)
      .setStrokeStyle(1, 0xe8c98d, 0.45)
      .setInteractive({ useHandCursor: true });
    this.add.text(31, 30, '‹', { fontFamily: 'Georgia, serif', fontSize: '28px', color: '#f0e2c6' }).setOrigin(0.5);
    back.on('pointerdown', () => this.scene.start('MainMenuScene'));

    this.add.text(w / 2, 22, 'СТАРАЯ ДОРОГА', {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#f0e2c6', fontStyle: 'bold', letterSpacing: 1,
    }).setOrigin(0.5, 0);

    const bag = this.add.circle(w - 31, 31, 19, 0x26343b, 0.95).setStrokeStyle(1, 0xe8c98d, 0.45);
    this.add.text(bag.x, bag.y, '⌑', { fontFamily: 'system-ui', fontSize: '18px', color: '#e8c98d' }).setOrigin(0.5);

    this.add.text(19, 59, 'ОТРЯД', { fontFamily: 'system-ui', fontSize: '9px', color: '#9ca8aa', fontStyle: 'bold' });
    this.add.text(19, 75, 'Адам', { fontFamily: 'system-ui', fontSize: '13px', color: '#f0e2c6', fontStyle: 'bold' });
    const herbCount = this.registry.get('herbCollected') ? 1 : 0;
    this.add.text(w - 19, 59, 'СУМКА', { fontFamily: 'system-ui', fontSize: '9px', color: '#9ca8aa', fontStyle: 'bold' }).setOrigin(1, 0);
    this.add.text(w - 19, 75, `трава ${herbCount}/1`, { fontFamily: 'system-ui', fontSize: '12px', color: '#d2d6d4' }).setOrigin(1, 0);

    const active = Math.min(3, step);
    const gap = 7;
    const segW = (w - 38 - gap * 3) / 4;
    for (let i = 0; i < 4; i++) {
      this.add.rectangle(19 + segW / 2 + i * (segW + gap), 101, segW, 4, i <= active ? 0xe8c98d : 0x58666d, i <= active ? 0.95 : 0.48);
    }
  }

  private drawRoadArt(view: RoadView) {
    const w = this.scale.width;
    const image = this.add.image(w / 2, 353, view.image).setDisplaySize(372, 500);
    image.setOrigin(0.5);

    this.add.rectangle(w / 2, 115, 372, 16, 0x26343b, 0.32).setOrigin(0.5, 0);
    this.add.rectangle(w / 2, 595, 372, 16, 0x26343b, 0.38).setOrigin(0.5, 1);

    if (view.accent === 'herb') {
      const pulse = this.add.circle(292, 427, 24, 0xb8cc8a, 0.13).setStrokeStyle(2, 0xe8c98d, 0.8);
      this.add.text(292, 427, '✦', { fontFamily: 'Georgia, serif', fontSize: '22px', color: '#f0e2c6' }).setOrigin(0.5);
      this.tweens.add({ targets: pulse, alpha: { from: 0.18, to: 0.55 }, scale: { from: 0.9, to: 1.12 }, duration: 900, yoyo: true, repeat: -1 });
    }

    if (view.accent === 'tracks') {
      [[244, 382], [222, 417], [255, 455]].forEach(([x, y], i) => {
        this.add.ellipse(x, y, 15, 20, 0x1e2528, 0.62).setRotation(i % 2 ? -0.35 : 0.28);
        this.add.circle(x - 7, y - 9, 3, 0x1e2528, 0.58);
        this.add.circle(x + 1, y - 12, 3, 0x1e2528, 0.58);
        this.add.circle(x + 8, y - 8, 3, 0x1e2528, 0.58);
      });
    }

    if (view.accent === 'cleared') {
      this.add.rectangle(w / 2, 522, 178, 36, 0x26343b, 0.82).setStrokeStyle(1, 0xe8c98d, 0.52);
      this.add.text(w / 2, 522, 'ПУТЬ ОТКРЫТ', { fontFamily: 'system-ui', fontSize: '11px', color: '#e8c98d', fontStyle: 'bold', letterSpacing: 1 }).setOrigin(0.5);
    }
  }

  private drawCopy(view: RoadView) {
    const w = this.scale.width;
    this.add.rectangle(w / 2, 690, w, 180, 0x34434b, 1).setStrokeStyle(1, 0x64747b, 0.35);

    this.add.text(20, 616, view.title, {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#f0e2c6', fontStyle: 'bold',
    });
    this.add.text(20, 650, view.text, {
      fontFamily: 'system-ui', fontSize: '13px', color: '#d2d6d4', wordWrap: { width: w - 40 }, lineSpacing: 4,
    });

    const button = this.add.rectangle(w / 2, 746, w - 38, 50, 0xe8c98d, 1)
      .setStrokeStyle(1, 0xffdda2, 0.7)
      .setInteractive({ useHandCursor: true });
    this.add.text(w / 2, 746, view.button.toUpperCase(), {
      fontFamily: 'system-ui', fontSize: '13px', color: '#26343b', fontStyle: 'bold', letterSpacing: 0.8,
    }).setOrigin(0.5);

    button.on('pointerover', () => button.setFillStyle(0xf1d79e));
    button.on('pointerout', () => button.setFillStyle(0xe8c98d));
    button.on('pointerdown', () => this.advance());
  }

  private advance() {
    const step = Number(this.registry.get('roadStep') ?? 0);
    const herbCollected = Boolean(this.registry.get('herbCollected'));
    const encounterFound = Boolean(this.registry.get('encounterFound'));

    if (step === 0) {
      this.registry.set('roadStep', 1);
      this.scene.restart();
      return;
    }
    if (step === 1 && !herbCollected) {
      this.registry.set('herbCollected', true);
      this.scene.restart();
      return;
    }
    if (step === 1) {
      this.registry.set('roadStep', 2);
      this.scene.restart();
      return;
    }
    if (step === 2 && !encounterFound) {
      this.registry.set('encounterFound', true);
      this.scene.restart();
      return;
    }
    if (step === 2) {
      this.registry.set('battleStage', 0);
      this.registry.set('heroHp', 20);
      this.registry.set('wolfHp', 12);
      this.registry.set('leaderHp', 18);
      this.scene.start('BattleScene');
      return;
    }
    this.scene.start('RewardScene');
  }
}
