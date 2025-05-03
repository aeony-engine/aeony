/**
 * 2D point class.
 */
export class Point {
  /**
   * The x axis position.
   */
  x: number;

  /**
   * The y axis position.
   */
  y: number;

  /**
   * Object pool.
   */
  private static pool: Point[] = [];

  /**
   * Get a point from the pool.
   * @param x - Optional x position.
   * @param y - Optional y position.
   * @returns The point.
   * @noSelf
   */
  static get(x = 0, y = 0): Point {
    if (Point.pool.length > 0) {
      const point = Point.pool.pop()!;
      point.x = x;
      point.y = y;

      return point;
    } else {
      return new Point(x, y);
    }
  }

  /**
   * Add two points.
   * @param a - The first point.
   * @param b - The second point.
   * @param out - Optional point to store the result.
   * @returns The result.
   * @noSelf
   */
  static addPoints(a: Point, b: Point, out?: Point): Point {
    if (!out) {
      out = new Point();
    }
    out.set(a.x + b.x, a.y + b.y);

    return out;
  }

  /**
   * Subtract two points.
   * @param a - The first point.
   * @param b - The second point.
   * @param out - Optional point to store the result.
   * @returns The result.
   * @noSelf
   */
  static subtractPoints(a: Point, b: Point, out?: Point): Point {
    if (!out) {
      out = new Point();
    }
    out.set(a.x - b.x, a.y - b.y);

    return out;
  }

  /**
   * Multiply two points.
   * @param a - The first point.
   * @param b - The second point.
   * @param out - Optional point to store the result.
   * @returns The result.
   * @noSelf
   */
  static multiplyPoints(a: Point, b: Point, out?: Point): Point {
    if (!out) {
      out = new Point();
    }
    out.set(a.x * b.x, a.y * b.y);

    return out;
  }

  /**
   * Divide two points.
   * @param a - The first point.
   * @param b - The second point.
   * @param out - Optional point to store the result.
   * @returns The result.
   * @noSelf
   */
  static dividePoints(a: Point, b: Point, out?: Point): Point {
    if (!out) {
      out = new Point();
    }
    out.set(a.x / b.x, a.y / b.y);

    return out;
  }

  /**
   * Calculate the distance between two points.
   * @param a - The first point.
   * @param b - The second point.
   * @returns The distance.
   * @noSelf
   */
  static distance(a: Point, b: Point): number {
    return math.sqrt(math.pow(b.x - a.x, 2) + math.pow(b.y - a.y, 2));
  }

  /**
   * Rotate a point around an x and y position. This modifies the point.
   * @param pos - The position to rotate.
   * @param x - The x position.
   * @param y - The y position.
   * @param angle - The angle to rotate to in degrees.
   * @returns The rotated position.
   * @noSelf
   */
  static rotateAround(pos: Point, x: number, y: number, angle: number): Point {
    // Rotate clockwise.
    const rad = math.rad(-angle);
    const c = math.cos(rad);
    const s = math.sin(rad);

    const tx = pos.x - x;
    const ty = pos.y - y;

    pos.x = c * tx + s * ty + x;
    pos.y = c * ty - s * tx + y;

    return pos;
  }

  /**
   * Rotate a point around another point. This modifies the point.
   * @param pos - The point to rotate.
   * @param point - The point to rotate around.
   * @param angle - The angle to rotate to in degrees.
   * @returns The rotated point.
   */
  static rotateAroundPoint(pos: Point, point: Point, angle: number): Point {
    return Point.rotateAround(pos, point.x, point.y, angle);
  }

  /**
   * Create a new point.
   * @param x - The x position.
   * @param y - The y position.
   */
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Get the length of this point.
   * @returns The length.
   */
  getLength(): number {
    return math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Set the length of this point.
   * @param value - The new length.
   */
  setLength(value: number): void {
    const l = this.getLength();

    if (l > 0) {
      this.x /= l;
      this.y /= l;
    }

    this.x *= value;
    this.y *= value;
  }

  /**
   * Set new point values.
   * @param x - The new x position.
   * @param y - The new y position.
   * @returns This point.
   */
  set(x: number, y: number): Point {
    this.x = x;
    this.y = y;

    return this;
  }

  /**
   * Clone this point.
   * @param out - Optional value to store the point in.
   * @returns The cloned point.
   */
  clone(out?: Point): Point {
    if (!out) {
      out = new Point();
    }
    out.set(this.x, this.y);

    return out;
  }

  /**
   * Copy the values from another point.
   * @param other - The point to copy.
   * @returns This point.
   */
  copyFrom(other: Point): Point {
    this.x = other.x;
    this.y = other.y;

    return this;
  }

  /**
   * Compare a point with this point.
   * @param other - The point to compare with.
   * @returns True if the points are equal.
   */
  equals(other: Point): boolean {
    return this.x === other.x && this.y === other.y;
  }

  /**
   * Add a point.
   * @param other - The point to add.
   * @returns This point.
   */
  add(other: Point): Point {
    this.x += other.x;
    this.y += other.y;

    return this;
  }

  /**
   * Add a value.
   * @param value - The value to add.
   * @returns This point.
   */
  addVal(value: number): Point {
    this.x += value;
    this.y += value;

    return this;
  }

  /**
   * Subtract a point.
   * @param other - The point to subtract.
   * @returns This point.
   */
  subtract(other: Point): Point {
    this.x -= other.x;
    this.y -= other.y;

    return this;
  }

  /**
   * Subtract a value.
   * @param value - The value to subtract.
   * @returns This point.
   */
  subtractVal(value: number): Point {
    this.x -= value;
    this.y -= value;

    return this;
  }

  /**
   * Subtract with a point.
   * @param other - The point to multiply with.
   * @returns This point.
   */
  multiply(other: Point): Point {
    this.x *= other.x;
    this.y *= other.y;

    return this;
  }

  /**
   * Subtract with a point.
   * @param value - The value to multiply with.
   * @returns This point.
   */
  multiplyVal(value: number): Point {
    this.x *= value;
    this.y *= value;

    return this;
  }

  /**
   * Divide by another point.
   * @param other - The point to device by.
   * @returns This point.
   */
  divide(other: Point): Point {
    this.x /= other.x;
    this.y /= other.y;

    return this;
  }

  /**
   * Divide this point by a value.
   * @param value - The value to divide by.
   * @returns This point.
   */
  divideVal(value: number): Point {
    this.x /= value;
    this.y /= value;

    return this;
  }

  /**
   * Get the dot product between two points.
   * @param other - The other point.
   * @returns The dot product.
   */
  dot(other: Point): number {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * Normalize this point.
   * @returns This point.
   */
  normalize(): Point {
    const l = this.getLength();
    if (l > 0) {
      this.x /= l;
      this.y /= l;
    }

    return this;
  }

  /**
   * Get a normalized version of this point.
   * @param out - Optional variable to store the values in.
   * @returns The normalized point.
   */
  normalized(out?: Point): Point {
    if (out) {
      return out.copyFrom(this).normalize();
    } else {
      return this.clone().normalize();
    }
  }

  /**
   * Put this point back into the pool.
   */
  put(): void {
    Point.pool.push(this);
  }

  /**
   * Helper to check if this point points left.
   * @returns True if this point is to the left of the origin.
   */
  isLeft(): boolean {
    return this.x < 0 && this.y === 0;
  }

  /**
   * Helper to check if this point points right.
   * @returns True if this point is to the right of the origin.
   */
  isRight(): boolean {
    return this.x > 0 && this.y === 0;
  }

  /**
   * Helper to check if this point points up.
   * @returns True if this point is above the origin.
   */
  isUp(): boolean {
    return this.x === 0 && this.y < 0;
  }

  /**
   * Helper to check if this point points down.
   * @returns True if this point is below the origin.
   */
  isDown(): boolean {
    return this.x === 0 && this.y > 0;
  }

  /**
   * Helper to check if this point is zero.
   * @returns True if this point is zero.
   */
  isZero(): boolean {
    return this.x === 0 && this.y === 0;
  }
}
