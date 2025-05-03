import { Services } from '../../../src/di';

class TestService {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

class TestService2 {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

describe('di/services:', () => {
  before_each(() => {
    Services.clear();
  });

  teardown(() => {
    Services.clear();
  });

  it('should add and get a service.', () => {
    const serviceInstance = new TestService('testName');

    Services.add(TestService, serviceInstance);

    const retrievedService = Services.get(TestService);
    assert.are_equal(serviceInstance.name, retrievedService.name);
  });

  it('should throw an error when getting a non-existent service.', () => {
    assert.has_error(() => {
      Services.get(TestService);
    }, 'Error: Service does not exist.');
  });

  it('should remove a service.', () => {
    const serviceInstance = new TestService('testName');

    Services.add(TestService, serviceInstance);
    Services.remove(TestService);

    assert.has_error(() => {
      Services.get(TestService);
    }, 'Error: Service does not exist.');
  });

  it('should clear all services.', () => {
    const serviceInstance = new TestService('testName');
    const serviceInstance2 = new TestService2('testName2');

    Services.add(TestService, serviceInstance);
    Services.add(TestService2, serviceInstance2);
    Services.clear();

    assert.has_error(() => {
      Services.get(TestService);
    }, 'Error: Service does not exist.');

    assert.has_error(() => {
      Services.get(TestService2);
    }, 'Error: Service does not exist.');
  });
});
