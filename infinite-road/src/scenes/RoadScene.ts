import * as Phaser from 'phaser';

type RoadView = {
  title: string;
  text: string;
  button: string;
  accent?: 'herb' | 'tracks' | 'wolves' | 'cleared';
};

export class RoadScene extends Phaser.Scene {
  constructor() { super('RoadScene'); }

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
    if (step === 0) return { title: 'У старого тракта', text: 'Дорога заросла, но следы ещё свежие.', button: 'Идти дальше' };
    if (step === 1 && !herbCollected) return { title: 'Что-то у обочины', text: 'Между камнями растёт лечебная трава. Она пригодится в пути.', button: 'Собрать траву', accent: 'herb' };
    if (step === 1) return { title: 'Трава собрана', text: 'Лечебная трава отправляется в сумку. Впереди дорога становится тише.', button: 'Продолжить' };
    if (step === 2 && !encounterFound) return { title: 'Следы на дороге', text: 'На влажной земле видны свежие следы. Из-за ворот доносится низкое рычание.', button: 'Осмотреть угрозу', accent: 'tracks' };
    if (step === 2) return { title: 'Волки у ворот', text: 'Серый волк и вожак стаи перекрыли дорогу.', button: 'Вступить в бой', accent: 'wolves' };
    return { title: 'Дорога свободна', text: 'Волки отступили. Путь в Тихую долину снова открыт.', button: 'Завершить путь', accent: 'cleared' };
  }

  private drawHeader(step: number) {
    const w = this.scale.width;
    this.add.rectangle(w / 2, 55, w, 110, 0x34434b, 1);
    const back = this.add.circle(31, 31, 19, 0x26343b, 0.95).setStrokeStyle(1, 0xe8c98d, 0.45).setInteractive({ useHandCursor: true });
    this.add.text(31, 30, '‹', { fontFamily: 'Georgia, serif', fontSize: '28px', color: '#f0e2c6' }).setOrigin(0.5);
    back.on('pointerdown', () => this.scene.start('MainMenuScene'));
    this.add.text(w / 2, 22, 'СТАРАЯ ДОРОГА', { fontFamily: 'Georgia, serif', fontSize: '18px', color: '#f0e2c6', fontStyle: 'bold' }).setOrigin(0.5, 0);
    this.add.text(19, 66, 'Адам', { fontFamily: 'system-ui', fontSize: '13px', color: '#f0e2c6', fontStyle: 'bold' });
    const herbCount = this.registry.get('herbCollected') ? 1 : 0;
    this.add.text(w - 19, 66, `Сумка · трава ${herbCount}/1`, { fontFamily: 'system-ui', fontSize: '11px', color: '#d2d6d4' }).setOrigin(1, 0);
    const gap = 7, segW = (w - 38 - gap * 3) / 4;
    for (let i = 0; i < 4; i++) this.add.rectangle(19 + segW / 2 + i * (segW + gap), 101, segW, 4, i <= Math.min(3, step) ? 0xe8c98d : 0x58666d, i <= Math.min(3, step) ? 0.95 : 0.48);
  }

  private drawRoadArt(view: RoadView) {
    const w = this.scale.width;
    this.add.rectangle(w / 2, 355, 372, 486, 0x1d2d33, 1).setStrokeStyle(1, 0x64747b, 0.4);
    const g = this.add.graphics();
    g.fillStyle(0x142329, 1);
    g.fillTriangle(10, 520, 94, 150, 182, 520);
    g.fillTriangle(185, 520, 300, 135, 382, 520);
    g.fillStyle(0x31484c, 1);
    g.fillTriangle(70, 520, 190, 210, 310, 520);
    g.fillStyle(0x8b7854, 0.85);
    g.fillTriangle(150, 595, 195, 220, 244, 595);

    for (let y = 180; y < 560; y += 55) {
      this.add.circle(48 + (y % 3) * 4, y, 19, 0x20373a, 0.95);
      this.add.circle(342 - (y % 2) * 7, y + 16, 22, 0x20373a, 0.95);
    }

    if (view.accent === 'herb') {
      const pulse = this.add.circle(286, 432, 24, 0x9dbb79, 0.18).setStrokeStyle(2, 0xe8c98d, 0.8);
      this.add.text(286, 432, '✦', { fontFamily: 'Georgia, serif', fontSize: '22px', color: '#f0e2c6' }).setOrigin(0.5);
      this.tweens.add({ targets: pulse, alpha: { from: 0.2, to: 0.65 }, scale: { from: 0.9, to: 1.15 }, duration: 900, yoyo: true, repeat: -1 });
    }

    if (view.accent === 'tracks') {
      [[236, 374], [216, 414], [250, 452]].forEach(([x, y], i) => this.add.ellipse(x, y, 15, 21, 0x11191d, 0.7).setRotation(i % 2 ? -0.35 : 0.3));
    }

    if (view.accent === 'wolves') {
      this.drawWolfSilhouette(125, 340, 0.9);
      this.drawWolfSilhouette(265, 318, 1.12);
    }

    if (view.accent === 'cleared') {
      this.add.rectangle(w / 2, 522, 178, 36, 0x26343b, 0.9).setStrokeStyle(1, 0xe8c98d, 0.55);
      this.add.text(w / 2, 522, 'ПУТЬ ОТКРЫТ', { fontFamily: 'system-ui', fontSize: '11px', color: '#e8c98d', fontStyle: 'bold' }).setOrigin(0.5);
    }
  }

  private drawWolfSilhouette(x: number, y: number, scale: number) {
    const g = this.add.graphics();
    g.fillStyle(0x151c20, 0.95);
    g.fillEllipse(x, y, 78 * scale, 46 * scale);
    g.fillTriangle(x + 28 * scale, y - 12 * scale, x + 50 * scale, y - 38 * scale, x + 54 * scale, y - 5 * scale);
    g.fillTriangle(x + 36 * scale, y - 23 * scale, x + 42 * scale, y - 49 * scale, x + 51 * scale, y - 18 * scale);
    g.fillTriangle(x + 51 * scale, y - 22 * scale, x + 62 * scale, y - 46 * scale, x + 65 * scale, y - 14 * scale);
  }

  private drawCopy(view: RoadView) {
    const w = this.scale.width;
    this.add.rectangle(w / 2, 690, w, 180, 0x34434b, 1).setStrokeStyle(1, 0x64747b, 0.35);
    this.add.text(20, 616, view.title, { fontFamily: 'Georgia, serif', fontSize: '22px', color: '#f0e2c6', fontStyle: 'bold' });
    this.add.text(20, 650, view.text, { fontFamily: 'system-ui', fontSize: '13px', color: '#d2d6d4', wordWrap: { width: w - 40 }, lineSpacing: 4 });
    const button = this.add.rectangle(w / 2, 746, w - 38, 50, 0xe8c98d, 1).setStrokeStyle(1, 0xffdda2, 0.7).setInteractive({ useHandCursor: true });
    this.add.text(w / 2, 746, view.button.toUpperCase(), { fontFamily: 'system-ui', fontSize: '13px', color: '#26343b', fontStyle: 'bold' }).setOrigin(0.5);
    button.on('pointerdown', () => this.advance());
  }

  private advance() {
    const step = Number(this.registry.get('roadStep') ?? 0);
    const herbCollected = Boolean(this.registry.get('herbCollected'));
    const encounterFound = Boolean(this.registry.get('encounterFound'));
    if (step === 0) { this.registry.set('roadStep', 1); this.scene.restart(); return; }
    if (step === 1 && !herbCollected) { this.registry.set('herbCollected', true); this.scene.restart(); return; }
    if (step === 1) { this.registry.set('roadStep', 2); this.scene.restart(); return; }
    if (step === 2 && !encounterFound) { this.registry.set('encounterFound', true); this.scene.restart(); return; }
    if (step === 2) {
      this.registry.set('battleStage', 0); this.registry.set('heroHp', 20); this.registry.set('wolfHp', 12); this.registry.set('leaderHp', 18);
      this.scene.start('BattleScene'); return;
    }
    this.scene.start('RewardScene');
  }
}
