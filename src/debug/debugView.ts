/**
 * Debug functions.
 */
export class DebugView {
  /**
   * Indicates if debug information should be shown.
   */
  get visible(): boolean {
    return this.viewEnabled && this.isVisible;
  }

  set visible(value: boolean) {
    this.isVisible = value;
  }

  /**
   * Indicates if the game is paused.
   */
  get isPaused(): boolean {
    return this.paused;
  }

  private isVisible = true;

  private viewEnabled: boolean;

  /**
   * Track the paused state.
   */
  private paused = false;

  /**
   * Indicates if the next frame should be run.
   */
  runFrame = false;

  private debugFont = love.graphics.newFont(16);

  private mouseWasDown = false;

  constructor(viewEnabled: boolean) {
    this.viewEnabled = viewEnabled;
  }

  /**
   * Updates the debug state.
   */
  update(): void {
    if (this.visible) {
      if (love.mouse.isDown(1) && !this.mouseWasDown) {
        this.mouseWasDown = true;
      } else if (!love.mouse.isDown(1) && this.mouseWasDown) {
        this.mouseWasDown = false;
        this.checkMouseUp();
      }
    }
  }

  /**
   * Pauses the game.
   */
  pause(): void {
    this.paused = true;
  }

  /**
   * Resumes the game.
   */
  play(): void {
    this.paused = false;
  }

  /**
   * Runs the next frame.
   */
  nextFrame(): void {
    this.runFrame = true;
  }

  /**
   * Draws the debug information.
   */
  draw(): void {
    if (this.visible) {
      const stats = love.graphics.getStats();
      const fps = love.timer.getFPS();

      const windowWidth = love.graphics.getWidth();
      const windowHeight = love.graphics.getHeight();

      love.graphics.setFont(this.debugFont);
      love.graphics.setColor(1, 1, 1);
      love.graphics.print(`draw calls: ${stats.drawcalls}`, 20, windowHeight - 40);

      const memory = string.format('texture mem: %.2f MB', stats.texturememory / 1024 / 1024);
      love.graphics.print(memory, 20, windowHeight - 60);

      love.graphics.print(`fps: ${fps}`, 20, windowHeight - 80);

      const [x, y] = love.mouse.getPosition();

      // Draw the play / pause / next frame buttons.
      if (this.paused) {
        if (this.mouseWasDown && this.insidePlayButton(x, y)) {
          love.graphics.setColor(0.5, 0.5, 0.5);
        } else {
          love.graphics.setColor(1, 1, 1);
        }
        love.graphics.polygon('fill', windowWidth - 80, 16, windowWidth - 56, 26, windowWidth - 80, 36);

        if (this.mouseWasDown && this.insideNextFrameButton(x, y)) {
          love.graphics.setColor(0.5, 0.5, 0.5);
        } else {
          love.graphics.setColor(1, 1, 1);
        }
        love.graphics.polygon('fill', windowWidth - 40, 18, windowWidth - 28, 26, windowWidth - 40, 34);
        love.graphics.polygon('fill', windowWidth - 28, 18, windowWidth - 16, 26, windowWidth - 28, 34);
      } else {
        if (this.mouseWasDown && this.insidePlayButton(x, y)) {
          love.graphics.setColor(0.5, 0.5, 0.5);
        } else {
          love.graphics.setColor(1, 1, 1);
        }

        love.graphics.rectangle('fill', windowWidth - 80, 16, 8, 20);
        love.graphics.rectangle('fill', windowWidth - 64, 16, 8, 20);
      }
    }
  }

  /**
   * Checks if the mouse was released over a button.
   */
  private checkMouseUp(): void {
    const [x, y] = love.mouse.getPosition();

    if (this.insidePlayButton(x, y)) {
      this.paused = !this.paused;
    } else if (this.insideNextFrameButton(x, y)) {
      this.nextFrame();
    }
  }

  /**
   * Checks if the mouse is inside the play button.
   * @param x - The x-coordinate of the mouse.
   * @param y - The y-coordinate of the mouse.
   * @returns True if the mouse is inside the play button.
   */
  private insidePlayButton(x: number, y: number): boolean {
    return x > love.graphics.getWidth() - 80 && x < love.graphics.getWidth() - 56 && y > 16 && y < 36;
  }

  /**
   * Checks if the mouse is inside the next frame button.
   * @param x - The x-coordinate of the mouse.
   * @param y - The y-coordinate of the mouse.
   * @returns True if the mouse is inside the next frame button.
   */
  private insideNextFrameButton(x: number, y: number): boolean {
    return this.paused && x > love.graphics.getWidth() - 40 && x < love.graphics.getWidth() - 16 && y > 18 && y < 34;
  }
}
