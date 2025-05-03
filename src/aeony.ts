import { LightUserData } from 'love';
import { GamepadAxis, GamepadButton, Joystick, JoystickHat } from 'love.joystick';
import { KeyConstant } from 'love.keyboard';

import { Services } from './di';
import { Input } from './input/input';
import { Scenes, SceneType } from './scenes';

type HandlerKey = keyof typeof love.handlers;

/**
 * Internal class to manage the game loop and input events, without exposing it to the global scope.
 * @noSelf
 */
class AeonyInternal {
  static started = false;
  static input: Input;

  static scenes: Scenes;

  static init(startScene: SceneType): void {
    Services.clear();
    AeonyInternal.input = new Input();
    Services.add(Input, AeonyInternal.input);

    AeonyInternal.scenes = new Scenes();
    Services.add(Scenes, AeonyInternal.scenes);
    AeonyInternal.scenes.switch('push', startScene);

    AeonyInternal.started = true;
  }

  static update(dt: number): void {
    const scenes = AeonyInternal.scenes;
    scenes.preUpdate(dt);
    scenes.update(dt);
    scenes.postUpdate(dt);
  }

  static draw(): void {
    AeonyInternal.scenes.draw();
    love.graphics.present();
  }
}

/**
 * @noSelf
 */
export class Aeony {
  static init(startScene: SceneType): void {
    AeonyInternal.init(startScene);
  }
}

love.run = (): (() => number | null) => {
  if (love.timer !== undefined) {
    love.timer.step();
  }

  let dt = 0;

  return (): number | null => {
    if (love.event !== undefined) {
      love.event.pump();

      for (const [name, a, b, c, d, e, f] of love.event.poll()) {
        if (name === 'quit') {
          if (!love.quit || !love.quit()) {
            return (a as number) ?? 0;
          }
        }

        if (AeonyInternal.started) {
          love.handlers[name as HandlerKey]?.(a as never, b as never, c as never, d as never, e as never, f as never);
        }
      }
    }

    if (love.timer !== undefined) {
      // dt = math.min(love.timer.step(), MAX_DT);
      dt = love.timer.step();
    }

    if (AeonyInternal.started) {
      // Debug.update();

      // if (!Debug.isPaused) {
      AeonyInternal.update(dt);
      // } else if (Debug.runFrame) {
      // Debug.runFrame = false;
      // Game.update(dt);
      // }
      AeonyInternal.draw();
    }

    if (love.timer !== undefined) {
      love.timer.sleep(0.001);
    }

    return null;
  };
};

love.keypressed = (key: KeyConstant, scancode: string, isRepeated: boolean): void => {
  if (AeonyInternal.started) {
    AeonyInternal.input.emit('keyPressed', key, scancode, isRepeated);
  }
};

love.keyreleased = (key: KeyConstant, scancode: string): void => {
  if (AeonyInternal.started) {
    AeonyInternal.input.emit('keyReleased', key, scancode);
  }
};

love.mousepressed = (x: number, y: number, button: number, isTouch: boolean): void => {
  if (AeonyInternal.started) {
    AeonyInternal.input.emit('mousePressed', x, y, button, isTouch);
  }
};

love.mousereleased = (x: number, y: number, button: number): void => {
  if (AeonyInternal.started) {
    AeonyInternal.input.emit('mouseReleased', x, y, button);
  }
};

love.mousemoved = (x: number, y: number, dx: number, dy: number, isTouch: boolean): void => {
  if (AeonyInternal.started) {
    AeonyInternal.input.emit('mouseMoved', x, y, dx, dy, isTouch);
  }
};

love.wheelmoved = (dx: number, dy: number): void => {
  if (AeonyInternal.started) {
    AeonyInternal.input.emit('mouseWheel', dx, dy);
  }
};

love.touchpressed = (
  id: LightUserData<'Touch'>,
  x: number,
  y: number,
  dx: number,
  dy: number,
  pressure: number
): void => {
  if (AeonyInternal.started) {
    AeonyInternal.input.emit('touchPressed', id, x, y, dx, dy, pressure);
  }
};

love.touchreleased = (
  id: LightUserData<'Touch'>,
  x: number,
  y: number,
  dx: number,
  dy: number,
  pressure: number
): void => {
  if (AeonyInternal.started) {
    AeonyInternal.input.emit('touchReleased', id, x, y, dx, dy, pressure);
  }
};

love.touchmoved = (
  id: LightUserData<'Touch'>,
  x: number,
  y: number,
  dx: number,
  dy: number,
  pressure: number
): void => {
  if (AeonyInternal.started) {
    AeonyInternal.input.emit('touchMoved', id, x, y, dx, dy, pressure);
  }
};

love.joystickadded = (joystick: Joystick): void => {
  if (AeonyInternal.started) {
    AeonyInternal.input.emit('joystickConnected', joystick);
  }

  if (AeonyInternal.started) {
    AeonyInternal.input.emit('gamepadConnected', joystick);
  }
};

love.joystickremoved = (joystick: Joystick): void => {
  if (AeonyInternal.started) {
    AeonyInternal.input.emit('joystickDisconnected', joystick);
  }

  if (AeonyInternal.started) {
    AeonyInternal.input.emit('gamepadDisconnected', joystick);
  }
};

love.joystickaxis = (joystick: Joystick, axis: number, value: number): void => {
  if (AeonyInternal.started) {
    AeonyInternal.input.emit('joystickAxis', joystick, axis, value);
  }
};

love.joystickhat = (joystick: Joystick, hat: number, direction: JoystickHat): void => {
  if (AeonyInternal.started) {
    AeonyInternal.input.emit('joystickHat', joystick, hat, direction);
  }
};

love.joystickpressed = (joystick: Joystick, button: number): void => {
  if (AeonyInternal.started) {
    AeonyInternal.input.emit('joystickPressed', joystick, button);
  }
};

love.joystickreleased = (joystick: Joystick, button: number): void => {
  if (AeonyInternal.started) {
    AeonyInternal.input.emit('joystickReleased', joystick, button);
  }
};

love.gamepadaxis = (joystick: Joystick, axis: GamepadAxis, value: number): void => {
  if (AeonyInternal.started) {
    AeonyInternal.input.emit('gamepadAxis', joystick, axis, value);
  }
};

love.gamepadpressed = (joystick: Joystick, button: GamepadButton): void => {
  if (AeonyInternal.started) {
    AeonyInternal.input.emit('gamepadPressed', joystick, button);
  }
};

love.gamepadreleased = (joystick: Joystick, button: GamepadButton): void => {
  if (AeonyInternal.started) {
    AeonyInternal.input.emit('gamepadReleased', joystick, button);
  }
};
