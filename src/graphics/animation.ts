import { Atlas, AtlasFrame } from './atlas';

export type AnimationMode = 'normal' | 'loop' | 'reversed' | 'loopReversed' | 'pingPong';

/**
 * The animation class uses a sprite atlas to cycle through sprite frames.
 */
export class Animation {
  /**
   * The animation name. Used to play animations.
   */
  readonly name: string;

  /**
   * The atlas to use for this animation.
   */
  readonly atlas: Atlas;

  /**
   * The names for each animation frame.
   */
  readonly frameNames: string[];

  /**
   * How long a frame is on screen in seconds.
   */
  frameDuration: number;

  /**
   * The animation play mode.
   */
  mode: AnimationMode;

  /**
   * Create a new animation.
   * @param name - The animation name.
   * @param atlas - The sprite atlas.
   * @param frameNames - The frame names.
   * @param frameDuration - Frame duration in seconds.
   * @param mode - Play mode.
   */
  constructor(name: string, atlas: Atlas, frameNames: string[], frameDuration: number, mode: AnimationMode = 'normal') {
    this.name = name;
    this.atlas = atlas;
    this.frameNames = frameNames;
    this.frameDuration = frameDuration;
    this.mode = mode;
  }

  /**
   * Get the frame for a time during the animation.
   * @param time - The time in seconds.
   * @returns The frame.
   */
  getFrame(time: number): AtlasFrame {
    return this.atlas.getFrame(this.frameNames[this.getFrameIndex(time)]);
  }

  /**
   * Get the frame name for a time during the animation.
   * @param time - The time in seconds.
   * @returns The frame name.
   */
  getFrameName(time: number): string {
    return this.frameNames[this.getFrameIndex(time)];
  }

  /**
   * Check if an animation is finished.
   * @param time - The time to check.
   * @returns True if the animation is finished.
   */
  finished(time: number): boolean {
    if (this.mode === 'loop' || this.mode === 'loopReversed' || this.mode === 'pingPong') {
      return false;
    }

    return math.floor(time / this.frameDuration) > this.frameNames.length;
  }

  /**
   * Get a frame index for a time during the animation depending on the mode.
   * @param time - The time to check.
   * @returns The index.
   */
  private getFrameIndex(time: number): number {
    if (this.frameNames.length === 1) {
      return 0;
    }

    let frameNumber = math.floor(time / this.frameDuration);
    switch (this.mode) {
      case 'normal':
        frameNumber = math.floor(math.min(this.frameNames.length - 1, frameNumber));
        break;

      case 'loop':
        frameNumber = frameNumber % this.frameNames.length;
        break;

      case 'pingPong':
        frameNumber = frameNumber % (this.frameNames.length * 2 - 2);
        if (frameNumber >= this.frameNames.length) {
          frameNumber = this.frameNames.length - 2 - (frameNumber - this.frameNames.length);
        }
        break;

      case 'reversed':
        frameNumber = Math.floor(Math.max(this.frameNames.length - frameNumber - 1, 0));
        break;

      case 'loopReversed':
        frameNumber = frameNumber % this.frameNames.length;
        frameNumber = this.frameNames.length - frameNumber - 1;
        break;
    }

    return frameNumber;
  }
}
