export type EmitHandler<T extends unknown[] = unknown[]> = {
  callback: (...args: T) => void;
  filter?: (...args: T) => boolean;
  active: boolean;
};

export type EmitterOnParams<T extends Record<string, unknown[]>, K extends keyof T> = {
  event: K;
  callback: (...event: T[K]) => void;
  filter?: (...event: T[K]) => boolean;
};

/**
 * Class representing an event emitter.
 * Provides methods to register, unregister, and emit events with optional filtering.
 */
export class Emitter<T extends Record<string, unknown[]>> {
  private handlers: { [K in keyof T]?: Set<EmitHandler<T[K]>> } = {};

  /**
   * Registers an event handler.
   * @param params - The event parameters.
   * @returns The registered event handler.
   */
  on<K extends keyof T>({ event, callback, filter }: EmitterOnParams<T, K>): EmitHandler<T[K]> {
    if (!this.handlers[event]) {
      this.handlers[event] = new Set();
    }

    const handler: EmitHandler<T[K]> = { callback, filter, active: true };
    this.handlers[event].add(handler);

    return handler;
  }

  /**
   * Unregister an event handler.
   * @param event - The event to unregister the handler from.
   * @param handler - The handler to unregister.
   */
  off<K extends keyof T>(event: K, handler: EmitHandler<T[K]>): void {
    this.handlers[event]?.delete(handler);
  }

  /**
   * Emits an event.
   * @param event - The event to emit.
   * @param data - The data to pass to the event handlers.
   */
  emit<K extends keyof T>(event: K, ...data: T[K]): void {
    if (!this.handlers[event]) {
      return;
    }

    for (const handler of this.handlers[event]) {
      if (handler.active && (!handler.filter || handler.filter(...data))) {
        handler.callback(...data);
      }
    }
  }

  /**
   * Clears all event handlers.
   */
  clear(): void {
    this.handlers = {};
  }
}
