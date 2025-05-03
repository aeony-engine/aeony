import { LightUserData } from 'love';
import { Joystick } from 'love.joystick';

import { Input } from '../../../src/input/input';

describe('input/Input:', () => {
  it('should toggle keyboard input.', () => {
    const input = new Input();

    let value = '';
    const callback = (): void => {
      value = 'called';
    };

    input.on({ event: 'keyPressed', callback });
    input.keyboardEnabled = false;
    input.emit('keyPressed', 'a', 'a', false);
    assert.equal('', value);

    input.keyboardEnabled = true;
    input.emit('keyPressed', 'a', 'a', false);
    assert.equal('called', value);
  });

  it('should toggle mouse input.', () => {
    const input = new Input();

    let value = '';
    const callback = (): void => {
      value = 'called';
    };

    input.on({ event: 'mousePressed', callback });
    input.mouseEnabled = false;
    input.emit('mousePressed', 0, 0, 1, false);
    assert.equal('', value);

    input.mouseEnabled = true;
    input.emit('mousePressed', 0, 0, 1, false);
    assert.equal('called', value);
  });

  it('should toggle touch input.', () => {
    const input = new Input();

    let value = '';
    const callback = (): void => {
      value = 'called';
    };

    input.on({ event: 'touchPressed', callback });
    input.touchEnabled = false;
    input.emit('touchPressed', '' as unknown as LightUserData<'Touch'>, 0, 1, 0, 0, 0);
    assert.equal('', value);

    input.touchEnabled = true;
    input.emit('touchPressed', '' as unknown as LightUserData<'Touch'>, 0, 1, 0, 0, 0);
    assert.equal('called', value);
  });

  it('should toggle joystick input.', () => {
    const input = new Input();

    let value = '';
    const callback = (): void => {
      value = 'called';
    };

    input.on({ event: 'joystickConnected', callback });
    input.joystickEnabled = false;
    input.emit('joystickConnected', {} as unknown as Joystick);
    assert.equal('', value);

    input.joystickEnabled = true;
    input.emit('joystickConnected', {} as unknown as Joystick);
    assert.equal('called', value);
  });

  it('should toggle gamepad input.', () => {
    const input = new Input();

    let value = '';
    const callback = (): void => {
      value = 'called';
    };

    input.on({ event: 'gamepadConnected', callback });
    input.gamepadEnabled = false;
    input.emit('gamepadConnected', {} as unknown as Joystick);
    assert.equal('', value);

    input.gamepadEnabled = true;
    input.emit('gamepadConnected', {} as unknown as Joystick);
    assert.equal('called', value);
  });
});
