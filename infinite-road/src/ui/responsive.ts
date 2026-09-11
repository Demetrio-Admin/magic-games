import * as Phaser from 'phaser';

export const DESIGN_WIDTH = 390;
export const DESIGN_HEIGHT = 844;

export function useFullscreenDesign(scene: Phaser.Scene) {
  const apply = () => {
    const width = scene.scale.width;
    const height = scene.scale.height;
    const camera = scene.cameras.main;

    camera.setViewport(0, 0, width, height);
    camera.setZoom(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
    camera.setScroll(0, 0);
  };

  apply();

  scene.scale.on(Phaser.Scale.Events.RESIZE, apply);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
    scene.scale.off(Phaser.Scale.Events.RESIZE, apply);
  });
}
