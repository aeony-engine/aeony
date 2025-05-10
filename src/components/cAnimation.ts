import { Animation } from '../graphics';

/**
 * Component for playing animations.
 */
export class CAnimation {
  /**
   * Flag to indicate whether an animation is currently playing.
   */
  playing = false;

  /**
   * Name of the current frame being displayed.
   */
  currentFrame = '';

  /**
   * Current Animation object being played.
   */
  private anim?: Animation;

  /**
   * Elapsed time during animation.
   */
  private time = 0;

  /**
   * Collection of animations.
   */
  private animations = new LuaTable<string, Animation>();

  /**
   * Constructor for CAnimation class.
   * @param animations - An array of Animation objects to initialize the collection.
   */
  constructor(animations?: Animation[]) {
    // If animations are provided, add them to the animations collection
    if (animations) {
      for (const anim of animations) {
        this.animations.set(anim.name, anim);
      }
    }
  }

  /**
   * Update method to be called during each frame update.
   * @param dt - The time elapsed since the last frame update.
   */
  update(dt: number): void {
    // Check if the animation is playing and not finished
    if (this.playing && this.anim && !this.isFinished()) {
      // Update the elapsed time
      this.time += dt;

      // Get the current frame name based on the elapsed time
      this.currentFrame = this.anim.getFrameName(this.time);
    }
  }

  /**
   * Start playing the animation with the specified name.
   * @param name - The name of the animation to play.
   */
  play(name?: string): void {
    // Reset the elapsed time to zero
    this.time = 0;

    if (name) {
      if (this.animations.has(name)) {
        this.anim = this.animations.get(name);
      }
    }

    this.playing = true;
  }

  /**
   * Stop the animation.
   */
  stop(): void {
    this.playing = false;
  }

  /**
   * Resume playing the animation.
   */
  resume(): void {
    this.playing = true;
  }

  /**
   * Add a new animation to the collection.
   * @param animation - The Animation object to add.
   */
  add(animation: Animation): void {
    this.animations.set(animation.name, animation);
  }

  /**
   * Remove an animation from the collection by name.
   * @param name - The name of the animation to remove.
   */
  remove(name: string): void {
    this.animations.delete(name);
  }

  /**
   * Get an animation from the collection by name.
   * @param name - The name of the animation to retrieve.
   * @returns The Animation.
   */
  getByName(name: string): Animation {
    return this.animations.get(name);
  }

  /**
   * Check if the current animation is finished.
   * @returns True if the current animation is finished, false otherwise.
   */
  isFinished(): boolean {
    if (this.anim) {
      return this.anim.finished(this.time);
    }

    // If there is no current animation, consider it finished
    return true;
  }

  /**
   * Get the name of the currently playing animation.
   * @returns The name of the currently playing animation.
   */
  getCurrent(): string {
    if (this.anim) {
      return this.anim.name;
    }

    // If there is no current animation, return an empty string
    return '';
  }
}
