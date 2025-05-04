import { Aeony, Scene } from '../../../../src';

class TestScene extends Scene {
  override update(dt: number): void {
    print('update', dt);
  }
}

Aeony.init(TestScene);
