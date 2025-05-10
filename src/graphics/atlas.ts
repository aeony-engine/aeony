import { Image, Quad } from 'love.graphics';

import { Json } from '../lualibs';
import { Rectangle, Size } from '../math';

/**
 * Sprite atlas class. Having sprites in a single atlas can help with batching draw calls.
 */
export class Atlas {
  /**
   * Map of frames.
   */
  readonly frames = new LuaTable<string, AtlasFrame>();

  /**
   * The atlas image to render.
   */
  readonly image: Image;

  static load(path: string): Atlas {
    const image = love.graphics.newImage(`${path}.png`);
    const [content] = love.filesystem.read(`${path}.json`);
    const data = Json.decode<FrameData>(content!);

    return new Atlas(image, data);
  }

  /**
   * Create a new atlas.
   * @param image - The atlas image.
   * @param data - The json string.
   */
  constructor(image: Image, data: FrameData) {
    this.image = image;

    const width = image.getWidth();
    const height = image.getHeight();

    for (const frameData of data.frames) {
      const frame = new AtlasFrame(frameData, width, height);
      this.frames.set(frame.name, frame);
    }
  }

  /**
   * Get a frame from the atlas.
   * @param name - The frame name.
   * @returns The frame.
   */
  getFrame(name: string): AtlasFrame {
    return this.frames.get(name);
  }

  /**
   * Draw a frame to the screen.
   * @param frame - The frame to draw.
   * @param x - The x position in pixels.
   * @param y - The y position in pixels.
   * @param angle - The angle in radians.
   * @param scaleX - The x axis scale.
   * @param scaleY - The y axis scale.
   * @param anchorX - The x axis offset anchor.
   * @param anchorY - The y axis offset anchor.
   */
  drawFrame(
    frame: AtlasFrame,
    x: number,
    y: number,
    angle = 0,
    scaleX = 1,
    scaleY = 1,
    anchorX = 0.5,
    anchorY = 0.5
  ): void {
    love.graphics.draw(
      this.image,
      frame.quad,
      x,
      y,
      angle,
      scaleX,
      scaleY,
      frame.sourceSize.width * anchorX - frame.sourceRect.x,
      frame.sourceSize.height * anchorY - frame.sourceRect.y
    );
  }

  /**
   * Draw a frame to the screen using the frame name.
   * @param frameName - The name of the frame to draw.
   * @param x - The x position in pixels.
   * @param y - The y position in pixels.
   * @param angle - The angle in radians.
   * @param scaleX - The x axis scale.
   * @param scaleY - The y axis scale.
   * @param anchorX - The x axis offset anchor.
   * @param anchorY - The y axis offset anchor.
   */
  drawFrameWithName(
    frameName: string,
    x: number,
    y: number,
    angle = 0,
    scaleX = 1,
    scaleY = 1,
    anchorX = 0.5,
    anchorY = 0.5
  ): void {
    this.drawFrame(this.getFrame(frameName), x, y, angle, scaleX, scaleY, anchorX, anchorY);
  }
}

/**
 * A single frame in the atlas.
 */
export class AtlasFrame {
  /**
   * The frame name.
   */
  readonly name: string;

  /**
   * The love quad to draw.
   */
  readonly quad: Quad;

  /**
   * Is this frame trimmed.
   */
  readonly trimmed: boolean;

  /**
   * The source rectangle before trimming. Has the original size and offset.
   */
  readonly sourceRect: Rectangle;

  /**
   * The frame size before trimming.
   */
  readonly sourceSize: Size;

  /**
   * Create a new frame.
   * @param frameInfo - The frame info information for drawing..
   * @param imageWidth - The full image width in pixels.
   * @param imageHeight - The full atlas image height in pixels.
   */
  constructor(frameInfo: FrameInfo, imageWidth: number, imageHeight: number) {
    const frame = frameInfo.frame;
    const spriteSize = frameInfo.spriteSourceSize;

    this.name = frameInfo.filename;
    this.quad = love.graphics.newQuad(frame.x, frame.y, frame.width, frame.height, imageWidth, imageHeight);
    this.trimmed = frameInfo.trimmed;
    this.sourceRect = new Rectangle(spriteSize.x, spriteSize.y, spriteSize.width, spriteSize.height);
    this.sourceSize = { width: spriteSize.width, height: spriteSize.height };
  }
}

type FrameData = {
  frames: FrameInfo[];
};

type FrameInfo = {
  filename: string;
  frame: { x: number; y: number; width: number; height: number };
  trimmed: boolean;
  spriteSourceSize: { x: number; y: number; width: number; height: number };
};
