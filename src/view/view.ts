import { Canvas } from 'love.graphics';

import { ScaleMode, scaleModeFitView } from './scaleModes';

/**
 * The view class has view related information like design, view, and window size.
 */
export class View {
  /**
   * The x axis anchor offset. If the view is smaller than the window this moves the view.
   */
  viewAnchorX = 0;

  /**
   * The y axis anchor offset. If the view is smaller than the window this moves the view.
   */
  viewAnchorY = 0;

  private canvas?: Canvas;

  /**
   * The current scale mode.
   */
  private scaleMode: ScaleMode;
  /**
   * The width the game is designed for in pixels.
   */
  private designWidth = 0;

  /**
   * The height the game is designed for in pixels.
   */
  private designHeight = 0;

  /**
   * The scaled view width in pixels.
   */
  private viewWidth = 0;

  /**
   * The scaled view height in pixels.
   */
  private viewHeight = 0;

  /**
   * The x scale factor to scale from view to window.
   */
  private viewScaleFactorX = 1.0;

  /**
   * The y scale factor to scale from view to window.
   */
  private viewScaleFactorY = 1.0;

  /**
   * The x axis view offset.
   */
  private viewOffsetX = 0;

  /**
   * The x axis view offset.
   */
  private viewOffsetY = 0;

  /**
   * Initialize the View. This gets called automatically by the Game class on startup.
   * @param width The width the game is designed for in pixels.
   * @param height The height the game is designed for in pixels.
   */
  constructor(width: number, height: number, anchorX = 0, anchorY = 0) {
    this.designWidth = width;
    this.designHeight = height;
    this.viewAnchorX = anchorX;
    this.viewAnchorY = anchorY;
    this.scaleMode = scaleModeFitView;
    this.scaleToWindow();
  }

  /**
   * Scale the design size to fit the window. The result will be the view size.
   */
  scaleToWindow(): void {
    [
      this.viewWidth,
      this.viewHeight,
      this.viewScaleFactorX,
      this.viewScaleFactorY,
      this.viewOffsetX,
      this.viewOffsetY,
    ] = this.scaleMode(
      { width: this.designWidth, height: this.designHeight },
      { x: this.viewAnchorX, y: this.viewAnchorY }
    );

    if (this.canvas) {
      this.canvas.release();
    }
    this.canvas = love.graphics.newCanvas(this.viewWidth, this.viewHeight);
  }

  /**
   * Convert a view position to a screen position.
   * @param x The x position in the view.
   * @param y The y position in the view.
   * @returns The x and y position on the screen.
   */
  screenToView(x: number, y: number): LuaMultiReturn<[number, number]> {
    const [windowWidth, windowHeight] = this.getWindowSize();
    const [viewWidth, viewHeight] = this.getViewSize();

    return $multi((x / windowWidth) * viewWidth, (y / windowHeight) * viewHeight);
  }

  /**
   * Set a new scale mode.
   * @param mode The new scale mode.
   */
  setScaleMode(mode: ScaleMode): void {
    this.scaleMode = mode;
    this.scaleToWindow();
  }

  /**
   * Get the design size in pixels.
   * @returns The design width and height.
   */
  getDesignSize(): LuaMultiReturn<[number, number]> {
    return $multi(this.designWidth, this.designHeight);
  }

  /**
   * Get the view size in pixels. This is the design size scaled to fit the window.
   * @returns The view width and height.
   */
  getViewSize(): LuaMultiReturn<[number, number]> {
    return $multi(this.viewWidth, this.viewHeight);
  }

  /**
   * Get the view center in pixels.
   * @returns The x and y position of the view center.
   */
  getViewCenter(): LuaMultiReturn<[number, number]> {
    return $multi(math.floor(this.viewWidth * 0.5), math.floor(this.viewHeight * 0.5));
  }

  /**
   * Get the window size in pixels.
   * @returns The window width and height.
   */
  getWindowSize(): LuaMultiReturn<[number, number]> {
    return $multi(love.graphics.getWidth(), love.graphics.getHeight());
  }

  /**
   * Get the window center in pixels.
   * @returns The x and y position of the window center.
   */
  getWindowCenter(): LuaMultiReturn<[number, number]> {
    return $multi(math.floor(love.graphics.getWidth() * 0.5), math.floor(love.graphics.getHeight() * 0.5));
  }

  /**
   * Get the view scale factor from scaling the design size to fix the window size.
   * This is used the scale the main canvas to fit the game window.
   * @returns The scale x and y factor.
   */
  getViewScaleFactor(): LuaMultiReturn<[number, number]> {
    return $multi(this.viewScaleFactorX, this.viewScaleFactorY);
  }

  /**
   * Get the view offset inside the window.
   * @returns The x and y offset.
   */
  getViewOffset(): LuaMultiReturn<[number, number]> {
    return $multi(this.viewOffsetX, this.viewOffsetY);
  }

  activateCanvas(clear = true): void {
    if (!this.canvas) {
      return;
    }

    love.graphics.setCanvas(this.canvas);

    if (clear) {
      love.graphics.clear();
    }
  }

  drawCanvas(): void {
    if (!this.canvas) {
      return;
    }

    love.graphics.setCanvas();
    love.graphics.clear();
    love.graphics.setColor(1, 1, 1, 1);
    love.graphics.draw(
      this.canvas,
      this.viewOffsetX,
      this.viewOffsetY,
      0,
      this.viewScaleFactorX,
      this.viewScaleFactorY
    );
  }
}
