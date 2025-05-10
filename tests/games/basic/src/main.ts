import { Aeony, Scene } from '../../../../src';

class TestScene extends Scene {
  override update(dt: number): void {
    print('update', dt);
  }
}

Aeony.start(800, 600, TestScene);
