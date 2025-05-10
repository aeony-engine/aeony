import { Color } from '../graphics';
import { Point, Size, XY } from '../math';

/**
 * The box shape initialization values.
 */
export type CBoxShapeOptions = {
  /**
   * The body size.
   */
  size: Size;

  /**
   * The box color.
   */
  color?: Color;

  /**
   * The box anchor (0 - 1).
   */
  anchor?: XY;
};

/**
 * Component to draw basic 2d boxes.
 */
export class CBoxShape {
  size: Size;

  /**
   * The fill color.
   */
  color: Color;

  /**
   * The anchor point.
   */
  anchor = new Point();

  /**
   * Love transform reference so we can offset position, rotation and scale.
   */
  private transform = love.math.newTransform();

  /**
   * Create a new Box shape component.
   * @param options - The initialization values.
   */
  constructor({ size, color, anchor }: CBoxShapeOptions) {
    this.size = size;
    this.color = color ?? new Color(1, 1, 1, 1);
    this.anchor.x = anchor?.x ?? 0.5;
    this.anchor.y = anchor?.y ?? 0.5;
  }

  /**
   * Draw the box.
   * @param x - The x position in pixels.
   * @param y - The y position in pixels.
   * @param angle - The angle in degrees.
   * @param scaleX - The x axis scale.
   * @param scaleY - The y axis scale.
   */
  draw(x: number, y: number, angle = 0, scaleX = 1.0, scaleY = 1.0): void {
    const [r, g, b, a] = this.color.parts();
    love.graphics.setColor(r, g, b, a);

    // Set the correct position using love transforms.
    this.transform.setTransformation(
      x,
      y,
      angle,
      scaleX,
      scaleY,
      this.size.width * this.anchor.x,
      this.size.height * this.anchor.y
    );
    love.graphics.push();
    love.graphics.applyTransform(this.transform);

    love.graphics.rectangle('fill', 0, 0, this.size.width, this.size.height);
    love.graphics.pop();
  }
}
