/**
 * rgba color class stored as 0 - 1 values.
 */
export class Color {
  /**
   * The red color value (0 - 1).
   */
  red: number;

  /**
   * The green color value (0 - 1).
   */
  green: number;

  /**
   * The blue color value (0 - 1).
   */
  blue: number;

  /**
   * The alpha color value (0 - 1).
   */
  alpha: number;

  /**
   * Interpolate between two colors.
   * @param color1 - The first color.
   * @param color2 - The second color.
   * @param factor - Interpolate factor (0 - 1).
   * @param out - Optional color to store the result in.
   * @returns The new color.
   * @noSelf
   */
  static interpolate(color1: Color, color2: Color, factor: number, out?: Color): Color {
    const red = (color2.red - color1.red) * factor + color1.red;
    const green = (color2.green - color1.green) * factor + color1.green;
    const blue = (color2.blue - color1.blue) * factor + color1.blue;
    const alpha = (color2.alpha - color1.alpha) * factor + color1.alpha;

    if (out) {
      out.set(red, green, blue, alpha);

      return out;
    }

    return new Color(red, green, blue, alpha);
  }

  /**
   * Create a new color from bytes (0 - 255).
   * @param red - The red color value (0 - 255).
   * @param green - The green color value (0 - 255).
   * @param blue - The blue color value (0 - 255).
   * @param alpha - The alpha color value (0 - 255).
   * @returns The new color.
   */
  static fromBytes(red: number, green: number, blue: number, alpha = 255): Color {
    return new Color(red / 255.0, green / 255.0, blue / 255.0, alpha / 255.0);
  }

  /**
   * Create a new color.
   * @param red - The red color value (0 - 1).
   * @param green - The green color value (0 - 1).
   * @param blue - The blue color value (0 - 1).
   * @param alpha - The alpha color value (0 - 1).
   */
  constructor(red: number, green: number, blue: number, alpha = 1.0) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
  }

  /**
   * Set new color values.
   * @param red - The red color value (0 - 1).
   * @param green - The green color value (0 - 1).
   * @param blue - The blue color value (0 - 1).
   * @param alpha - The alpha color value (0 - 1).
   */
  set(red: number, green: number, blue: number, alpha = 1.0): void {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
  }

  /**
   * Clone this color into a new color.
   * @param out - Optional color to store the cloned values in.
   * @returns A new color if out is undefined, otherwise the out value.
   */
  clone(out?: Color): Color {
    if (out) {
      out.set(this.red, this.green, this.blue, this.alpha);

      return out;
    }

    return new Color(this.red, this.green, this.blue, this.alpha);
  }

  /**
   * Copy the values from another color.
   * @param source - The color to copy from.
   */
  copyFrom(source: Color): void {
    this.set(source.red, source.green, source.blue, source.alpha);
  }

  /**
   * Get the separate rgba color.
   * @returns The red, green, blue, alpha colors.
   */
  parts(): LuaMultiReturn<[number, number, number, number]> {
    return $multi(this.red, this.green, this.blue, this.alpha);
  }
}
