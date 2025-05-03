import { Scene } from './scene';

/**
 * SceneSwitchType is a type that defines the possible types of scene switches.
 * It can be 'push', 'replace', or 'replaceAll'.
 * - 'push': Pushes a new scene onto the stack.
 * - 'replace': Replaces the current scene with a new one.
 * - 'replaceAll': Replaces all scenes in the stack with a new one.
 */
export type SceneSwitchType = 'push' | 'replace' | 'replaceAll';

export type SceneType = new (...args: any[]) => Scene;

/**
 * Scene manager class that handles switching between different scenes.
 */
export class Scenes {
  /**
   * The current active scene.
   */
  get current(): Scene | null {
    return this.sceneStack[this.sceneStack.length - 1] ?? null;
  }

  /**
   * The scene stack. The last scene in the array is the current scene.
   */
  private sceneStack: Scene[];

  private sceneTypeToSwitch?: {
    type: SceneSwitchType | 'pop';
    sceneType?: SceneType;
  };

  constructor() {
    this.sceneStack = [];
  }

  /**
   * Switch to a new scene.
   * @param type The type of switch.
   * @param sceneType The new scene type to switch to.
   */
  switch(type: SceneSwitchType = 'replace', sceneType: SceneType): void {
    this.sceneTypeToSwitch = {
      type,
      sceneType,
    };
  }

  /**
   * Pop the current scene from the stack.
   */
  pop(): void {
    this.sceneTypeToSwitch = {
      type: 'pop',
    };
  }

  /**
   * Updates the current scene before the main update loop.
   * @param dt Delta time since the last update in seconds.
   */
  preUpdate(dt: number): void {
    this.updateStack();

    this.current?.preUpdate(dt);
  }

  /**
   * Updates the current scene.
   * @param dt Delta time since the last update in seconds.
   */
  update(dt: number): void {
    this.current?.update(dt);
  }

  /**
   * Updates the current scene after the main update loop.
   * @param dt Delta time since the last update in seconds.
   */
  postUpdate(dt: number): void {
    this.current?.postUpdate(dt);
  }

  draw(): void {
    if (this.current) {
      if (this.current.isSubScene && this.sceneStack.length > 1) {
        this.sceneStack[this.sceneStack.length - 2].draw();
      }

      this.current.draw();
    }
  }

  private updateStack(): void {
    if (this.sceneTypeToSwitch) {
      const { type, sceneType } = this.sceneTypeToSwitch;

      if (type === 'pop') {
        const scene = this.sceneStack.pop();
        if (scene) {
          scene.destroy();
        }

        if (this.sceneStack.length > 0) {
          this.current?.resume();
        }
      } else if (sceneType) {
        const newScene = new sceneType();

        switch (type) {
          case 'push':
            this.current?.pause();
            this.sceneStack.push(newScene);
            break;

          case 'replace':
            this.current?.destroy();
            this.sceneStack.pop();
            this.sceneStack.push(newScene);
            break;

          case 'replaceAll':
            while (this.sceneStack.length > 0) {
              const scene = this.sceneStack.pop()!;
              scene.destroy();
            }

            this.sceneStack.push(newScene);
        }
      }

      this.sceneTypeToSwitch = undefined;
    }
  }
}
