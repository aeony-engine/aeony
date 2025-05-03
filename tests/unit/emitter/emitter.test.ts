import { Emitter } from '../../../src/emitter/emitter';

describe('emitter/Emitter:', () => {
  type Events = {
    testEvent: [string];
    anotherEvent: [number, boolean];
  };

  let emitter: Emitter<Events>;

  before_each(() => {
    emitter = new Emitter<Events>();
  });

  it('should register and emit an event.', () => {
    let value = '';

    const callback = (message: string): void => {
      value = message;
    };

    emitter.on({ event: 'testEvent', callback });

    emitter.emit('testEvent', 'Hello');

    assert.equal('Hello', value);
  });

  it('should unregister an event handler.', () => {
    let value = '';

    const callback = (message: string): void => {
      value = message;
    };

    const handler = emitter.on({ event: 'testEvent', callback });

    emitter.off('testEvent', handler);
    emitter.emit('testEvent', 'Hello');

    assert.equal('', value);
  });

  it('should emit an event with multiple arguments.', () => {
    let value1 = 0;
    let value2 = false;

    const callback = (arg1: number, arg2: boolean): void => {
      value1 = arg1;
      value2 = arg2;
    };

    emitter.on({ event: 'anotherEvent', callback });
    emitter.emit('anotherEvent', 42, true);

    assert.equal(42, value1);
    assert.equal(true, value2);
  });

  it('should filter events based on the filter function.', () => {
    let value = '';
    const callback = (message: string): void => {
      value = message;
    };

    emitter.on({
      event: 'testEvent',
      callback,
      filter: (message) => message === 'Pass',
    });

    emitter.emit('testEvent', 'Fail');
    assert.equal('', value);

    emitter.emit('testEvent', 'Pass');
    assert.equal('Pass', value);
  });

  it('should only call active handlers.', () => {
    let value = '';
    const callback = (message: string): void => {
      value = message;
    };
    const handler = emitter.on({ event: 'testEvent', callback });
    handler.active = false;
    emitter.emit('testEvent', 'Hello');

    assert.equal('', value);
  });

  it('should clear all event handlers.', () => {
    let value = '';
    const callback = (message: string): void => {
      value = message;
    };

    emitter.on({ event: 'testEvent', callback });

    emitter.clear();
    emitter.emit('testEvent', 'Hello');

    assert.equal('', value);
  });
});
