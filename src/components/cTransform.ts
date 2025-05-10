import { Point } from '../math';

/**
 * The transform initial value options.
 */
export type CTransformOptions = {
  /**
   * The x position.
   */
  x?: number;

  /**
   * The y position.
   */
  y?: number;

  /**
   * The angle in degrees.
   */
  angle?: number;

  /**
   * The x axis scale.
   */
  scaleX?: number;

  /**
   * The y axis scale.
   */
  scaleY?: number;

  /**
   * Optional parent for parent child movement.
   */
  parent?: CTransform;
};

/**
 * Transform component used for position, rotation and scale.
 */
export class CTransform {
  /**
   * The local space position.
   */
  position = new Point();

  /**
   * The local space angle in degrees.
   */
  angle = 0;

  /**
   * The local space scale.
   */
  scale = new Point(1, 1);

  /**
   * The parent transform.
   */
  parent?: CTransform;

  /**
   * Create a new transform instance.
   * @param options - Initial value options.
   */
  constructor({ x, y, angle, scaleX, scaleY, parent }: CTransformOptions = {}) {
    this.position.x = x ?? 0;
    this.position.y = y ?? 0;
    this.angle = angle ?? 0;
    this.scale.x = scaleX ?? 1.0;
    this.scale.y = scaleY ?? 1.0;
    this.parent = parent;
  }

  /**
   * Convert a parent space position to a local space position.
   * @param x - The x axis position.
   * @param y - The y axis position.
   * @returns The local space x and y position.
   */
  parentToLocalPosition(x: number, y: number): LuaMultiReturn<[number, number]> {
    let newX = 0;
    let newY = 0;

    // No need to calculate the angle.
    if (this.angle === 0) {
      // No need to calculate scale.
      if (this.scale.x === 1.0 && this.scale.y === 1.0) {
        newX = x - this.position.x;
        newY = y - this.position.y;
      } else {
        newX = (x - this.position.x) / this.scale.x;
        newY = (y - this.position.y) / this.scale.y;
      }
    } else {
      const c = math.cos(math.rad(this.angle));
      const s = math.sin(math.rad(this.angle));
      const toX = x - this.position.x;
      const toY = y - this.position.y;
      newX = (toX * c + toY * s) / this.scale.x;
      newY = (toY * -s + toY * c) / this.scale.y;
    }

    return $multi(newX, newY);
  }

  /**
   * Convert a local space position to a parent space position.
   * @param x - The x axis position.
   * @param y - The y axis position.
   * @returns The parent space x and y position.
   */
  localToParentPosition(x: number, y: number): LuaMultiReturn<[number, number]> {
    let newX = 0;
    let newY = 0;

    if (this.angle === 0) {
      if (this.scale.x === 1.0 && this.scale.y === 1.0) {
        newX = x + this.position.x;
        newY = y + this.position.y;
      } else {
        newX = x * this.scale.x + this.position.x;
        newY = y * this.scale.y + this.position.y;
      }
    } else {
      const c = math.cos(math.rad(-this.angle));
      const s = math.sin(math.rad(-this.angle));
      const toX = x * this.scale.x;
      const toY = y * this.scale.y;
      newX = toX * c + toY * s + this.position.x;
      newY = toX * -s + toY * c + this.position.y;
    }

    return $multi(newX, newY);
  }

  /**
   * Convert a position from local to world space.
   * @param x - The x axis position.
   * @param y - The y axis position.
   * @returns Return the position in world space.
   */
  localToWorldPosition(x: number, y: number): LuaMultiReturn<[number, number]> {
    let p = this.parent;
    while (p) {
      const [newX, newY] = p.localToParentPosition(x, y);
      x = newX;
      y = newY;
      p = p.parent;
    }

    return $multi(x, y);
  }

  /**
   * Convert a position from world to local space.
   * @param x - The x axis position.
   * @param y - The y axis position.
   * @returns Return the position in local space.
   */
  worldToLocalPosition(x: number, y: number): LuaMultiReturn<[number, number]> {
    if (this.parent) {
      const [newX, newY] = this.parent.parentToLocalPosition(x, y);
      x = newX;
      y = newY;
    }

    return $multi(x, y);
  }

  /**
   * Get the world position of this transform.
   * @returns The x and y world position.
   */
  getWorldPosition(): LuaMultiReturn<[number, number]> {
    return this.localToWorldPosition(this.position.x, this.position.y);
  }

  /**
   * Set a new world position.
   * @param x - The x axis position.
   * @param y - The y axis position.
   */
  setWorldPosition(x: number, y: number): void {
    const [newX, newY] = this.worldToLocalPosition(x, y);
    this.position.x = newX;
    this.position.y = newY;
  }

  /**
   * Get the world angle for this transform.
   * @returns The world angle in degrees.
   */
  getWorldAngle(): number {
    if (this.parent) {
      return this.parent.getWorldAngle() + this.angle;
    }

    return this.angle;
  }

  /**
   * Set a new world angle.
   * @param angle - The new angle in degrees.
   */
  setWorldAngle(angle: number): void {
    if (this.parent) {
      this.angle = angle - this.parent.getWorldAngle();
    } else {
      this.angle = angle;
    }
  }

  /**
   * Get world world scale for this transform.
   * @returns The world scale.
   */
  getWorldScale(): LuaMultiReturn<[number, number]> {
    if (this.parent) {
      const [sx, sy] = this.parent.getWorldScale();
      return $multi(this.scale.x * sx, this.scale.y * sy);
    }

    return $multi(this.scale.x, this.scale.y);
  }

  /**
   * Set a new world scale.
   * @param scaleX - The x axis scale.
   * @param scaleY - The y axis scale.
   */
  setWorldScale(scaleX: number, scaleY: number): void {
    if (this.parent) {
      const [sx, sy] = this.parent.getWorldScale();
      scaleX /= sx;
      scaleY /= sy;
    }

    this.scale.x = scaleX;
    this.scale.y = scaleY;
  }

  /**
   * Set a new local position.
   * @param x - The x axis position.
   * @param y - The y axis position.
   */
  setPosition(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
  }

  /**
   * Set a new local scale.
   * @param scaleX - The x axis scale.
   * @param scaleY - The y axis scale.
   */
  setScale(scaleX: number, scaleY: number): void {
    this.scale.x = scaleX;
    this.scale.y = scaleY;
  }

  /**
   * Get all transform values.
   * @returns The x and y position, the rotation angle, and the x and y scale.
   */
  getValues(): LuaMultiReturn<[number, number, number, number, number]> {
    return $multi(this.position.x, this.position.y, this.angle, this.scale.x, this.scale.y);
  }

  /**
   * Get all world transform values.
   * @returns The x and y position, the rotation angle, and the x and y scale.
   */
  getWorldValues(): LuaMultiReturn<[number, number, number, number, number]> {
    const [x, y] = this.getWorldPosition();
    const angle = this.getWorldAngle();
    const [sx, sy] = this.getWorldScale();
    return $multi(x, y, angle, sx, sy);
  }
}
