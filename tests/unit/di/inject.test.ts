import { inject, Services } from '../../../src/di';

describe('di/inject tests:', () => {
  teardown(() => {
    Services.clear();
  });

  it('should inject a service.', () => {
    const value = 'this is a test';
    const testService = new TestService(value);
    Services.add(TestService, testService);

    const testClass = new TestClass();

    assert.is_equal(value, testClass.testService.testValue);
  });
});

class TestService {
  testValue: string;

  constructor(value: string) {
    this.testValue = value;
  }
}

class TestClass {
  testService = inject(TestService);

  constructor() {}
}
