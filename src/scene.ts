export class Scene {
  isSubScene = false;

  constructor() {}

  preUpdate(_dt: number): void {
    // Pre-update logic for the scene
  }

  update(_dt: number): void {
    // Update logic for the scene
  }

  postUpdate(_dt: number): void {
    // Post-update logic for the scene
  }

  draw(): void {
    // Draw logic for the scene
  }

  pause(): void {
    // Pause when a new scene is pushed.
  }

  resume(): void {
    // Resume when the scene above scene is popped.
  }

  destroy(): void {}
}
