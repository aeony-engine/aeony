import { Atlas, AtlasFrame, Color } from '../graphics';
import { Point, XY } from '../math';

/**
 * The sprite component initial values.
 */
export type CSpriteOptions = {
  /**
   * The atlas to use.
   */
  atlas: Atlas;

  /**
   * The frame to display.
   */
  frameName: string;

  /**
   * The anchor (0 - 1).
   */
  anchor?: XY;

  /**
   * The tint color.
   */
  color?: Color;
};

/**
 * Sprite component.
 */
export class CSprite {
  /**
   * The draw anchor.
   */
  anchor = new Point(0.5, 0.5);

  /**
   * The tint color.
   */
  color: Color;

  /**
   * The atlas to render from.
   */
  atlas!: Atlas;

  /**
   * The frame to draw.
   */
  private frame!: AtlasFrame;

  /**
   * Create a new sprite component.
   * @param options - The initial value.
   */
  constructor({ atlas, frameName, anchor, color }: CSpriteOptions) {
    this.anchor.x = anchor?.x ?? 0.5;
    this.anchor.y = anchor?.y ?? 0.5;
    this.color = color ?? new Color(1, 1, 1, 1);
    this.setFrame(frameName, atlas);
  }

  /**
   * The current frame name.
   * @returns The frame name.
   */
  getFrameName(): string {
    return this.frame.name;
  }

  /**
   * Set a new frame to draw.
   * @param frameName - The name of the frame.
   * @param atlas - The atlas to use. Optional.
   */
  setFrame(frameName: string, atlas?: Atlas): void {
    if (atlas) {
      this.atlas = atlas;
    }

    if (!this.atlas) {
      return;
    }

    this.frame = this.atlas.getFrame(frameName);

    if (!this.frame) {
      console.log(`frame ${frameName} not found in atlas`);
    }
  }

  /**
   * Draw the sprite.
   * @param x - The x position in pixels.
   * @param y - The y position in pixels.
   * @param angle - The angle in radians.
   * @param scaleX - The x axis scale.
   * @param scaleY - The y axis scale.
   */
  draw(x: number, y: number, angle?: number, scaleX?: number, scaleY?: number): void {
    const [r, g, b, a] = this.color.parts();
    love.graphics.setColor(r, g, b, a);
    this.atlas.drawFrame(this.frame, x, y, angle, scaleX, scaleY, this.anchor.x, this.anchor.y);
  }

  /**
   * Get the sprite width in pixels.
   * @returns The width.
   */
  getWidth(): number {
    return this.frame.sourceSize.width;
  }

  /**
   * Get the sprite height in pixels.
   * @returns The height.
   */
  getHeight(): number {
    return this.frame.sourceSize.height;
  }
}
