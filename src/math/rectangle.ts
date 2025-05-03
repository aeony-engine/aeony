import { MathUtils } from './mathUtils';
import { Point } from './point';

/**
 * Rectangle class.
 */
export class Rectangle {
  /**
   * The x axis position of the rectangle.
   */
  x: number;

  /**
   * The y axis position of the rectangle.
   */
  y: number;

  /**
   * The width of the rectangle.
   */
  width: number;

  /**
   * The height of the rectangle.
   */
  height: number;

  /**
   * Create a new Rectangle.
   * @param x - The top left x position.
   * @param y - The top left y position.
   * @param width - The rectangle width.
   * @param height - The rectangle height.
   */
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Check if a point is inside a rectangle.
   * @param x - The x position to check.
   * @param y - The y position to check.
   * @returns True if the point is inside the rectangle.
   */
  hasPoint(x: number, y: number): boolean {
    return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
  }

  /**
   * Check if two rectangles intersect.
   * @param rect - The rectangle to check with.
   * @returns True if the rectangles intersect.
   */
  intersects(rect: Rectangle): boolean {
    return (
      this.x < rect.x + rect.width &&
      this.x + this.width > rect.x &&
      this.y < rect.y + rect.height &&
      this.y + this.height > rect.y
    );
  }

  /**
   * Check if a line intersects with this rectangle.
   * @param origin - The start point of the line.
   * @param target - The end point of the line.
   * @param out - The intersect point.
   * @returns True if the line intersects.
   */
  intersectsLine(origin: Point, target: Point, out?: Point): boolean {
    let intersects = false;

    // Check top.
    if (
      MathUtils.linesIntersect(origin.x, origin.y, target.x, target.y, this.x, this.y, this.x + this.width, this.y, out)
    ) {
      intersects = true;
    }

    // Check right
    if (
      MathUtils.linesIntersect(
        origin.x,
        origin.y,
        target.x,
        target.y,
        this.x + this.width,
        this.y + this.height,
        this.x + this.width,
        this.y,
        out
      )
    ) {
      intersects = true;
    }

    // Check bottom.
    if (
      MathUtils.linesIntersect(
        origin.x,
        origin.y,
        target.x,
        target.y,
        this.x + this.width,
        this.y + this.height,
        this.x,
        this.y + this.height,
        out
      )
    ) {
      intersects = true;
    }

    // Check left.
    if (
      MathUtils.linesIntersect(
        origin.x,
        origin.y,
        target.x,
        target.y,
        this.x,
        this.y,
        this.x,
        this.y + this.height,
        out
      )
    ) {
      intersects = true;
    }

    return intersects;
  }

  /**
   * Update the rectangle values.
   * @param x - The new x position.
   * @param y - The new y position.
   * @param width - The new width.
   * @param height - The new height.
   */
  set(x: number, y: number, width: number, height: number): void {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
