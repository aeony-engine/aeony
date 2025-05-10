import { Size, XY } from '../math';

/**
 * Helper type for the scale function returns.
 * Returns [viewWidth, viewHeight, scaleFactorX, scaleFactorY, xOffset, yOffset].
 */
type ScaleModeReturn = LuaMultiReturn<[number, number, number, number, number, number]>;

/** Scale mode type used for every scale mode function */
export type ScaleMode = (designSize: Size, anchor: XY) => ScaleModeReturn;

/**
 * Fit view will use fill width or fill height depending what fill the screen the most.
 * @param designSize
 * @param anchor
 * @returns
 */
export function scaleModeFitView(designSize: Size, anchor: XY): ScaleModeReturn {
  const windowWidth = love.graphics.getWidth();
  const windowHeight = love.graphics.getHeight();

  const designRatio = designSize.width / designSize.height;
  const windowRatio = windowWidth / windowHeight;

  let viewWidth = 0;
  let viewHeight = 0;
  if (windowRatio < designRatio) {
    viewWidth = designSize.width;
    viewHeight = Math.ceil(viewWidth / windowRatio);
  } else {
    viewHeight = designSize.height;
    viewWidth = Math.ceil(viewHeight * windowRatio);
  }

  const scaleFactor = windowWidth / viewWidth;

  const xOffset = (windowWidth - designSize.width * scaleFactor) * anchor.x;
  const yOffset = (windowHeight - designSize.height * scaleFactor) * anchor.y;

  return $multi(viewWidth, viewHeight, scaleFactor, scaleFactor, xOffset, yOffset);
}

/**
 * Fill the width of the screen by scaling the view.
 * @param designSize
 * @param anchor
 * @returns
 */
export function scaleModeFitWidth(designSize: Size, anchor: XY): ScaleModeReturn {
  const windowWidth = love.graphics.getWidth();
  const windowHeight = love.graphics.getHeight();

  const windowRatio = windowWidth / windowHeight;
  const viewWidth = designSize.width;
  const viewHeight = Math.ceil(viewWidth / windowRatio);

  const scaleFactor = windowWidth / viewWidth;

  const xOffset = (windowWidth - designSize.width * scaleFactor) * anchor.x;
  const yOffset = (windowHeight - designSize.height * scaleFactor) * anchor.y;

  return $multi(viewWidth, viewHeight, scaleFactor, scaleFactor, xOffset, yOffset);
}

/**
 * Fill the height of the screen by scaling the view.
 * @param designSize
 * @param anchor
 * @returns
 */
export function scaleModeFitHeight(designSize: Size, anchor: XY): ScaleModeReturn {
  const windowWidth = love.graphics.getWidth();
  const windowHeight = love.graphics.getHeight();

  const windowRatio = windowWidth / windowHeight;
  const viewHeight = designSize.width;
  const viewWidth = Math.ceil(viewHeight * windowRatio);

  const scaleFactor = windowHeight / viewHeight;

  const xOffset = (windowWidth - designSize.width * scaleFactor) * anchor.x;
  const yOffset = (windowHeight - designSize.height * scaleFactor) * anchor.y;

  return $multi(viewWidth, viewHeight, scaleFactor, scaleFactor, xOffset, yOffset);
}

/**
 * Don't scale the view at all.
 * @param designSize
 * @param anchor
 * @returns
 */
export function scaleModeNoScale(designSize: Size, anchor: XY): ScaleModeReturn {
  const windowWidth = love.graphics.getWidth();
  const windowHeight = love.graphics.getHeight();
  const xOffset = (windowWidth - designSize.width) * anchor.x;
  const yOffset = (windowHeight - designSize.height) * anchor.y;

  return $multi(designSize.width, designSize.height, 1.0, 1.0, xOffset, yOffset);
}

/**
 * Stretch the width and height to fill the screen.
 * @param designSize
 * @param _anchor
 * @returns
 */
export function scaleModeStretch(designSize: Size, _anchor: XY): ScaleModeReturn {
  const windowWidth = love.graphics.getWidth();
  const windowHeight = love.graphics.getHeight();

  const viewWidth = designSize.width;
  const viewHeight = designSize.height;

  const scaleFactorX = windowWidth / viewWidth;
  const scaleFactorY = windowHeight / viewHeight;

  return $multi(viewWidth, viewHeight, scaleFactorX, scaleFactorY, 0, 0);
}
