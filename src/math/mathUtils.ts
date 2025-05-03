import { Point } from './point';

/**
 * Math helper functions.
 * @noSelf
 */
export class MathUtils {
  /**
   * Lerp between two values.
   * @param a - The start number.
   * @param b - The end number.
   * @param position - The position to lerp to (0 - 1).
   * @returns The number at the position.
   */
  static lerp(a: number, b: number, position: number): number {
    return a + position * (b - a);
  }

  /**
   * Clamp a number between a minimum and a maximum number.
   * @param value - The value to clamp.
   * @param min - The minimum value.
   * @param max - The maximum value.
   * @returns The clamped number.
   */
  static clamp(value: number, min: number, max: number): number {
    // Swap the numbers if min is bigger than max.
    if (min > max) {
      const temp = max;
      max = min;
      min = temp;
    }

    const lower = value < min ? min : value;

    if (lower > max) {
      return max;
    } else {
      return lower;
    }
  }

  /**
   * Calculate the distance between two points.
   * @param x1 - The x position of the first point.
   * @param y1 - The y position of the first point.
   * @param x2 - The x position of the second point.
   * @param y2 - The y position of the second point.
   * @returns The distance.
   */
  static distance(x1: number, y1: number, x2: number, y2: number): number {
    return math.sqrt(math.pow(x2 - x1, 2) + math.pow(y2 - y1, 2));
  }

  /**
   * Compare two numbers that are almost equal.
   * @param a - The first number.
   * @param b - The second number.
   * @param epsilon - The precision to compare with.
   * @returns True if the numbers are almost equal.
   */
  static fuzzyEqual(a: number, b: number, epsilon = 0.0001): boolean {
    return math.abs(a - b) < epsilon;
  }

  /**
   * Check if two lines intersect with each other.
   * @param p1StartX - The x position of the start of the first line.
   * @param p1StartY - The y position of the start of the first line.
   * @param p1EndX - The x position of the end of the first line.
   * @param p1EndY - The y position of the end of the first line.
   * @param p2StartX - The x position of the start of the second line.
   * @param p2StartY - The y position of the start of the second line.
   * @param p2EndX - The x position of the end of the second line.
   * @param p2EndY - The x position of the end of the second line.
   * @param out - Optional variable to store the intersect position in.
   * @returns True if the lines intersect.
   */
  static linesIntersect(
    p1StartX: number,
    p1StartY: number,
    p1EndX: number,
    p1EndY: number,
    p2StartX: number,
    p2StartY: number,
    p2EndX: number,
    p2EndY: number,
    out?: Point
  ): boolean {
    const b = Point.get(p1EndX - p1StartX, p1EndY - p1StartY);
    const d = Point.get(p2EndX - p2StartX, p2EndY - p2StartY);

    const bDotDPrep = b.x * d.y - b.y * d.x;
    if (bDotDPrep === 0) {
      b.put();
      d.put();

      return false;
    }

    const c = Point.get(p2StartX - p1StartX, p2StartY - p1StartY);
    const t = (c.x * d.y - c.y * d.x) / bDotDPrep;
    if (t < 0 || t > 1) {
      b.put();
      d.put();
      c.put();

      return false;
    }

    const u = (c.x * b.y - c.y * b.x) / bDotDPrep;
    if (u < 0 || u > 1) {
      b.put();
      d.put();
      c.put();

      return false;
    }

    // Calculate the intersection point.
    if (out) {
      const point = Point.get(p1StartX, p1StartY);
      b.multiplyVal(t);
      point.add(b);

      if (out.isZero()) {
        out.copyFrom(point);
      } else {
        const p1Start = Point.get(p1StartX, p1StartY);
        if (Point.distance(p1Start, point) < Point.distance(p1Start, out)) {
          out.copyFrom(point);
        }
        p1Start.put();
      }
      point.put();
    }

    b.put();
    d.put();
    c.put();

    return true;
  }

  /**
   * Rotate a point around another point.
   * @param x - The x position of the point to rotate.
   * @param y - The y position of the point to rotate.
   * @param centerX - The x position of the point to rotate around.
   * @param centerY - The y position of the point to rotate around.
   * @param angle - The angle to rotate to in degrees.
   * @returns The x and y point of the rotated position.
   */
  static rotateAround(
    x: number,
    y: number,
    centerX: number,
    centerY: number,
    angle: number
  ): LuaMultiReturn<[number, number]> {
    // Rotate clockwise.
    const rad = math.rad(-angle);
    const c = math.cos(rad);
    const s = math.sin(rad);

    const tx = x - centerX;
    const ty = y - centerY;

    x = c * tx + s * ty + centerX;
    y = c * ty - s * tx + centerY;

    return $multi(x, y);
  }

  /**
   * Generate a random float between min and max.
   * @param min - The minimum value.
   * @param max - The maximum value.
   * @returns The random float.
   */
  static randomFloat(min = 0, max = 1): number {
    return min + love.math.random() * (max - min);
  }
}
