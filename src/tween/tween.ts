import { Ease, easeLinear } from './easing';

type PropertyData = {
  from: number;
  to: number;
  change: number;
  propertyName: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Target = { [key: string]: any };

export class Tween {
  target: Target;

  from: Record<string, number>;

  to: Record<string, number>;

  duration = 0;

  private time = 0;

  private delay = 0;

  private delayTime = 0;

  private finished = false;

  private ease: Ease;

  private dataList: PropertyData[];

  /**
   * @noSelf
   */
  private onComplete?: () => void;

  /**
   * @noSelf
   */
  private onUpdate?: (target: Target) => void;

  constructor(target: Target, from: Record<string, number>, to: Record<string, number>, duration: number) {
    this.target = target;
    this.to = to;
    this.from = from;
    this.duration = duration;

    this.ease = easeLinear;
    this.time = 0;
    this.delay = 0;
    this.dataList = [];
    this.finished = false;

    this.createDataList(target, from, to);
  }

  update(dt: number): void {
    if (this.finished) {
      return;
    }

    if (this.delayTime < this.delay) {
      this.delayTime += dt;
      return;
    }

    this.time += dt;

    if (this.time > this.duration) {
      this.time = this.duration;
      this.finished = true;
    }

    for (const property of this.dataList) {
      this.updateProperty(property);
    }

    if (this.onUpdate) {
      this.onUpdate(this.target);
    }

    if (this.finished && this.onComplete) {
      this.onComplete();
    }
  }

  setDelay(delay: number): Tween {
    this.delay = delay;

    return this;
  }

  setEase(ease: Ease): Tween {
    this.ease = ease;

    return this;
  }

  setOnComplete(onComplete: () => void): Tween {
    this.onComplete = onComplete;

    return this;
  }

  setOnUpdate(onUpdate: (target: Target) => void): Tween {
    this.onUpdate = onUpdate;

    return this;
  }

  reset(): void {
    this.time = 0;
    this.delayTime = 0;
    this.finished = false;
  }

  private createDataList(target: Target, from: Record<string, number>, to: Record<string, number>): void {
    for (const key in from) {
      if (target[key] !== undefined) {
        const fromValue = from[key];
        const toValue = to[key];
        const change = toValue - fromValue;
        this.dataList.push({ from: fromValue, to: toValue, change, propertyName: key });
      }
    }
  }

  private updateProperty(property: PropertyData): void {
    let value = this.ease(this.time, property.from, property.change, this.duration);

    if (this.finished) {
      value = property.to;
    }

    this.target[property.propertyName] = value;
  }
}
