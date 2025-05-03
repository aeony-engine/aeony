import { LightUserData } from 'love';
import { GamepadAxis, GamepadButton, Joystick, JoystickHat } from 'love.joystick';
import { KeyConstant } from 'love.keyboard';

import { EmitHandler, Emitter, EmitterOnParams } from '../emitter/emitter';

/**
 * All input types and their parameters.
 */
export type InputEvents = {
  keyPressed: [key: KeyConstant, scancode: string, isRepeated: boolean];
  keyReleased: [key: KeyConstant, scancode: string];
  mousePressed: [x: number, y: number, button: number, isTouch: boolean];
  mouseReleased: [x: number, y: number, button: number];
  mouseMoved: [x: number, y: number, dx: number, dy: number, isTouch: boolean];
  mouseWheel: [dx: number, dy: number];
  touchPressed: [id: LightUserData<'Touch'>, x: number, y: number, dx: number, dy: number, pressure: number];
  touchReleased: [id: LightUserData<'Touch'>, x: number, y: number, dx: number, dy: number, pressure: number];
  touchMoved: [id: LightUserData<'Touch'>, x: number, y: number, dx: number, dy: number, pressure: number];
  joystickConnected: [joystick: Joystick];
  joystickDisconnected: [joystick: Joystick];
  joystickAxis: [joystick: Joystick, axis: number, value: number];
  joystickHat: [joystick: Joystick, hat: number, direction: JoystickHat];
  joystickPressed: [joystick: Joystick, button: number];
  joystickReleased: [joystick: Joystick, button: number];
  gamepadConnected: [joystick: Joystick];
  gamepadDisconnected: [joystick: Joystick];
  gamepadAxis: [joystick: Joystick, axis: GamepadAxis, value: number];
  gamepadPressed: [joystick: Joystick, button: GamepadButton];
  gamepadReleased: [joystick: Joystick, button: GamepadButton];
};

/**
 * Handles input events in the game.
 */
export class Input {
  /**
   * Flag to enable or disable keyboard input.
   */
  keyboardEnabled = true;

  /**
   * Flag to enable or disable mouse input.
   */
  mouseEnabled = true;

  /**
   * Flag to enable or disable touch input.
   */
  touchEnabled = true;

  /**
   * Flag to enable or disable joystick input.
   */
  joystickEnabled = true;

  /**
   * Flag to enable or disable gamepad input.
   */
  gamepadEnabled = true;

  /**
   * The event emitter instance for handling input events.
   */
  private emitter: Emitter<InputEvents>;

  constructor() {
    this.emitter = new Emitter<InputEvents>();
  }

  /**
   * Registers an event listener for a specific input event.
   * @param params - The parameters for the event listener.
   * @returns The handler for the event listener.
   */
  on<K extends keyof InputEvents>(params: EmitterOnParams<InputEvents, K>): EmitHandler<InputEvents[K]> | null {
    return this.emitter.on(params);
  }

  /**
   * Unregister an event listener for a specific input event.
   * @param event - The event to unregister the listener from.
   * @param handler - The handler to remove.
   */
  off<K extends keyof InputEvents>(event: K, handler: EmitHandler<InputEvents[K]>): void {
    this.emitter.off(event, handler);
  }

  /**
   * Emits a specific input event with the provided data.
   * @param event - The event to emit.
   * @param data - The data to emit with the event.
   */
  emit<K extends keyof InputEvents>(event: K, ...data: InputEvents[K]): void {
    // Block events based on the type of input event.
    if (
      (event.startsWith('key') && !this.keyboardEnabled) ||
      (event.startsWith('mouse') && !this.mouseEnabled) ||
      (event.startsWith('touch') && !this.touchEnabled) ||
      (event.startsWith('joystick') && !this.joystickEnabled) ||
      (event.startsWith('gamepad') && !this.gamepadEnabled)
    ) {
      return;
    }

    this.emitter.emit(event, ...data);
  }

  /**
   * Clears all registered event listeners.
   */
  clear(): void {
    this.emitter.clear();
  }
}
