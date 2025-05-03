/**
 * Service class to manage a collection of services.
 * @noSelf
 */
export class Services {
  /**
   * The service container that holds all the services.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static readonly CONTAINER: Map<new (...args: any[]) => any, any> = new Map();

  /**
   * Gets a service by name.
   * @param type - The type of the service to get.
   * @returns The service instance. Throws an error if the service does not exist.
   */
  static get<T>(type: new (...args: any[]) => T): T {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const service = Services.CONTAINER.get(type);

    if (!service) {
      throw new Error('Service does not exist.');
    }

    return service as T;
  }

  /**
   * Add a service to the container.
   * @packaged type - The type of the service to add.
   * @param service - The service instance to add.
   */
  static add<T>(type: new (...args: any[]) => T, service: T): void {
    Services.CONTAINER.set(type, service);
  }

  /**
   * Records a service from the container.
   * @param type - The type of the service to remove.
   */
  static remove<T>(type: new (...args: any[]) => T): void {
    if (Services.CONTAINER.has(type)) {
      Services.CONTAINER.delete(type);
    }
  }

  /**
   * Clears all services from the container.
   */
  static clear(): void {
    Services.CONTAINER.clear();
  }
}
