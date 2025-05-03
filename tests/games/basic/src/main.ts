import { Aeony, Scene } from '@aeony/aeony';

if (os.getenv('LOCAL_LUA_DEBUGGER_VSCODE') === '1') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  require('lldebugger').start();
}

class TestScene extends Scene {
  constructor() {
    super();
  }

  override update(_dt: number): void {
    print(_dt);
  }
}

Aeony.init(TestScene);
