export class Time {
  timeScale: number;

  dt: number;

  dtUnscaled: number;

  fps: number;

  private frameTimes: number[] = [];

  constructor() {
    this.timeScale = 1;
    this.dt = 0;
    this.dtUnscaled = 0;
    this.fps = 0;
    this.frameTimes = [];
  }

  update(dt: number): void {
    this.dtUnscaled = dt;
    this.dt = dt * this.timeScale;

    this.frameTimes.push(dt);
    if (this.frameTimes.length > 240) {
      this.frameTimes.shift();
    }

    let average = 0;
    for (const frameTime of this.frameTimes) {
      average += frameTime;
    }

    this.fps = math.floor(1 / (average / this.frameTimes.length));
  }
}
