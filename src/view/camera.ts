import { Canvas } from 'love.graphics';

import { inject } from '../di';
import { Color } from '../graphics';
import { MathUtils, Point, Rectangle } from '../math';
import { View } from './view';

/**
 * The camera creation options.
 */
export type CameraOptions = {
  /**
   * The x-coordinate of the camera's center position.
   */
  x?: number;

  /**
   * The y-coordinate of the camera's center position.
   */
  y?: number;

  /**
   * The rotation angle of the camera in degrees.
   */
  angle?: number;

  /**
   * The zoom level of the camera.
   */
  zoom?: number;

  /**
   * The x-coordinate of the view rectangle compared to the screen (0 - 1).
   */
  viewX?: number;

  /**
   * The y-coordinate of the view rectangle compared to the screen (0 - 1).
   */
  viewY?: number;

  /**
   * The width of the view rectangle compared to the screen (0 - 1).
   */
  viewWidth?: number;

  /**
   * The height of the view rectangle compared to the screen (0 - 1).
   */
  viewHeight?: number;

  /**
   * The background color of the camera.
   */
  bgColor?: Color;

  /**
   * The render layers that should be ignored by the camera.
   */
  ignoredLayers?: number[];
};

/**
 * Camera class.
 */
export class Camera {
  /**
   * Indicates if the camera is used to render.
   */
  active = true;

  /**
   * The center position of the camera.
   */
  position = new Point();

  /**
   * The rotation angle of the camera in degrees.
   */
  angle = 0;

  /**
   * The zoom level of the camera.
   */
  zoom = 1;

  /**
   * The transformation matrix of the camera.
   */
  transform = love.math.newTransform();

  /**
   * The background color of the camera.
   */
  bgColor = new Color(0, 0, 0);

  /**
   * The render layers that should be ignored by the camera.
   */
  ignoredLayers: number[] = [];

  /**
   * The screen bounds of the camera.
   */
  screenBounds = new Rectangle();

  /**
   * The render canvas used by the camera.
   */
  canvas: Canvas | undefined;

  /**
   * The view rectangle of the camera.
   */
  viewRect = new Rectangle();

  private view = inject(View);

  /**
   * Creates a new Camera instance.
   * @param options - The camera creation options.
   */
  constructor({ bgColor, ignoredLayers, angle, viewX, viewY, viewHeight, viewWidth, x, y, zoom }: CameraOptions = {}) {
    const [vw, vh] = this.view.getViewSize();
    this.position.set(x ?? vw * 0.5, y ?? vh * 0.5);
    this.angle = angle ?? 0;
    this.zoom = zoom ?? 1;
    this.bgColor = bgColor ?? new Color(0, 0, 0);
    this.ignoredLayers = ignoredLayers ?? [];
    this.updateView(viewX ?? 0, viewY ?? 0, viewWidth ?? 1, viewHeight ?? 1);
  }

  /**
   * Updates the transformation matrix of the camera.
   */
  updateTransform(): void {
    this.transform.reset();
    this.transform
      .translate(this.screenBounds.width * 0.5, this.screenBounds.height * 0.5)
      .rotate(math.rad(this.angle))
      .scale(this.zoom, this.zoom)
      .translate(-this.position.x, -this.position.y);
  }

  /**
   * Converts screen coordinates to world coordinates.
   * @param x - The x-coordinate on the screen.
   * @param y - The y-coordinate on the screen.
   * @returns The corresponding world coordinates.
   */
  screenToWorld(x: number, y: number): LuaMultiReturn<[number, number]> {
    const [dx, dy] = this.transform.inverseTransformPoint(x, y);

    return $multi(dx, dy);
  }

  /**
   * Updates the view rectangle and screen bounds of the camera.
   * @param x - The x-coordinate of the view rectangle.
   * @param y - The y-coordinate of the view rectangle.
   * @param width - The width of the view rectangle.
   * @param height - The height of the view rectangle.
   */
  updateView(x: number, y: number, width: number, height: number): void {
    x = MathUtils.clamp(x, 0, 1);
    y = MathUtils.clamp(y, 0, 1);
    width = MathUtils.clamp(width, 0, 1);
    height = MathUtils.clamp(height, 0, 1);
    this.viewRect.set(x, y, width, height);

    const [viewWidth, viewHeight] = this.view.getViewSize();
    this.screenBounds.set(x * viewWidth, y * viewHeight, width * viewWidth, height * viewHeight);

    this.canvas?.release();
    this.canvas = love.graphics.newCanvas(this.screenBounds.width, this.screenBounds.height);
  }

  /**
   * Resizes the camera view.
   */
  resize(): void {
    this.updateView(this.viewRect.x, this.viewRect.y, this.viewRect.width, this.viewRect.height);
  }

  /**
   * Destroys the camera and releases its resources.
   */
  destroy(): void {
    this.canvas?.release();
  }
}
