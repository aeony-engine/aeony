import { Font } from 'love.graphics';

import { Color } from '../graphics';
import { Point, XY } from '../math';

/**
 * The CText creation options.
 */
export type CTextOptions = {
  /**
   * The font to use.
   */
  font: Font;

  /**
   * The text to draw.
   */
  text: string;

  /**
   * The text color.
   */
  color?: Color;

  /**
   * The anchor (0 - 1).
   */
  anchor?: XY;
};

/**
 * Simple text component.
 */
export class CText {
  anchor = new Point();

  /**
   * The font to draw with.
   */
  font: Font;

  /**
   * The text to display.
   */
  text: string;

  /**
   * The text color.
   */
  color: Color;

  /**
   * Create a new CText instance.
   * @param font - The font to use.
   * @param text - The text to display.
   * @param color - The text color.
   */
  constructor({ font, text, color, anchor }: CTextOptions) {
    this.font = font;
    this.text = text;
    this.color = color ?? new Color(1, 1, 1, 1);
    this.anchor.x = anchor?.x ?? 0.5;
    this.anchor.y = anchor?.y ?? 0.5;
  }

  /**
   * Draw the text.
   * @param x - The x position in pixels.
   * @param y - The y position in pixels.
   * @param angle - The angle in degrees.
   * @param scaleX - The x axis scale.
   * @param scaleY - The y axis scale.
   */
  draw(x: number, y: number, angle: number, scaleX: number, scaleY: number): void {
    love.graphics.setFont(this.font);
    const [r, g, b, a] = this.color.parts();
    love.graphics.setColor(r, g, b, a);

    const width = this.font.getWidth(this.text);
    const height = this.font.getHeight();

    love.graphics.print(
      this.text,
      x,
      y,
      math.rad(angle),
      scaleX,
      scaleY,
      width * this.anchor.x,
      height * this.anchor.y
    );
  }
}
