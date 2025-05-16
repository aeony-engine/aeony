import { Aeony, Scene } from '../../../../src';

class TestScene extends Scene {
  override update(dt: number): void {
    console.log('update', dt);
  }
}

new Aeony({ designWidth: 800, designHeight: 600, startScene: TestScene });
