import * as Phaser from 'phaser';

export const DESIGN_WIDTH = 390;

export type ScreenRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
  bottom: number;
  centerX: number;
  centerY: number;
};

export type ScreenLayout = {
  width: number;
  height: number;
  safeTop: number;
  safeBottom: number;
  margin: number;
  header: ScreenRegion;
  world: ScreenRegion;
  footer: ScreenRegion;
  contentBottom: number;
};

function readSafeAreaPx(name: '--safe-top' | '--safe-bottom') {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : 0;
}

function region(x: number, y: number, width: number, height: number): ScreenRegion {
  return {
    x,
    y,
    width,
    height,
    bottom: y + height,
    centerX: x + width / 2,
    centerY: y + height / 2,
  };
}

export function createScreenLayout(
  scene: Phaser.Scene,
  options?: {
    headerHeight?: number;
    footerMin?: number;
    footerMax?: number;
    footerRatio?: number;
    margin?: number;
  },
): ScreenLayout {
  const width = DESIGN_WIDTH;
  const height = scene.scale.height;

  const viewportWidth = Math.max(1, window.visualViewport?.width ?? window.innerWidth);
  const logicalPerCssPx = width / viewportWidth;

  const safeTop = readSafeAreaPx('--safe-top') * logicalPerCssPx;
  const safeBottom = readSafeAreaPx('--safe-bottom') * logicalPerCssPx;

  const margin = options?.margin ?? 18;
  const headerBodyHeight = options?.headerHeight ?? 96;
  const footerMin = options?.footerMin ?? 176;
  const footerMax = options?.footerMax ?? 203;
  const footerRatio = options?.footerRatio ?? 0.25;

  const headerHeight = safeTop + headerBodyHeight;
  const contentBottom = height - safeBottom;
  const footerContentHeight = Phaser.Math.Clamp(height * footerRatio, footerMin, footerMax);
  const footerY = Math.max(headerHeight + 260, contentBottom - footerContentHeight);
  const footerHeight = height - footerY;

  return {
    width,
    height,
    safeTop,
    safeBottom,
    margin,
    header: region(0, 0, width, headerHeight),
    world: region(0, headerHeight, width, Math.max(0, footerY - headerHeight)),
    footer: region(0, footerY, width, footerHeight),
    contentBottom,
  };
}
