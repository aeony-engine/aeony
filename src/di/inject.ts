import { Services } from './services';

/**
 * Inject a service from the container.
 * @param type - The type of the service to inject.
 * @returns The service instance.
 */
export function inject<T>(type: new (...args: any[]) => T): T {
  return Services.get(type);
}
