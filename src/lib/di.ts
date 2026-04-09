/**
 * Dependency Injection Container
 * 
 * Function-based DI system for managing dependencies
 * without using classes
 */

type Dependencies = Record<string, any>;

class DIContainer {
  private dependencies: Dependencies = {};
  private singletons: Dependencies = {};

  /**
   * Register a factory function or value
   */
  register<T>(key: string, factory: (() => T) | T): void {
    if (typeof factory === 'function') {
      this.dependencies[key] = factory;
    } else {
      this.singletons[key] = factory;
    }
  }

  /**
   * Register a singleton (created once and reused)
   */
  registerSingleton<T>(key: string, factory: () => T): void {
    if (this.singletons[key]) {
      return;
    }
    this.singletons[key] = factory();
  }

  /**
   * Resolve a dependency
   */
  resolve<T = any>(key: string): T {
    if (this.singletons[key]) {
      return this.singletons[key];
    }

    const factory = this.dependencies[key];
    if (!factory) {
      throw new Error(`Dependency not found: ${key}`);
    }

    if (typeof factory === 'function') {
      return factory();
    }

    return factory;
  }

  /**
   * Check if dependency exists
   */
  has(key: string): boolean {
    return this.dependencies.hasOwnProperty(key) || this.singletons.hasOwnProperty(key);
  }

  /**
   * Clear all dependencies (useful for testing)
   */
  clear(): void {
    this.dependencies = {};
    this.singletons = {};
  }
}

// Global DI Container instance
export const container = new DIContainer();

/**
 * Helper function to create injectable functions
 * 
 * Usage:
 * const myService = createInjectable('myService', (deps) => {
 *   return {
 *     doSomething: () => {}
 *   }
 * }, ['myRepository'])
 */
export function createInjectable<T>(
  key: string,
  factory: (deps: Record<string, any>) => T,
  dependencies: string[] = []
): void {
  container.register(key, () => {
    const resolvedDeps: Record<string, any> = {};
    for (const dep of dependencies) {
      resolvedDeps[dep] = container.resolve(dep);
    }
    return factory(resolvedDeps);
  });
}

/**
 * Helper to resolve multiple dependencies at once
 */
export function resolveDeps<T>(keys: string[]): Record<string, T> {
  const resolved: Record<string, T> = {};
  for (const key of keys) {
    resolved[key] = container.resolve<T>(key);
  }
  return resolved;
}

/**
 * Higher-order function to inject dependencies into a function
 * 
 * Usage:
 * const myHandler = inject(['myService'], ({ myService }) => {
 *   return async (request) => {
 *     // use myService
 *   }
 * })
 */
export function inject<T>(
  dependencies: string[],
  fn: (deps: Record<string, any>) => T
): T {
  const resolvedDeps: Record<string, any> = {};
  for (const dep of dependencies) {
    resolvedDeps[dep] = container.resolve(dep);
  }
  return fn(resolvedDeps);
}

/**
 * Helper to create a provider function that lazily injects dependencies
 * 
 * Usage:
 * const getService = lazyInject(['repo'], ({ repo }) => ({
 *   getData: () => repo.find()
 * }))
 * 
 * const service = getService(); // Called when needed
 */
export function lazyInject<T>(
  dependencies: string[],
  fn: (deps: Record<string, any>) => T
): () => T {
  return () => {
    const resolvedDeps: Record<string, any> = {};
    for (const dep of dependencies) {
      resolvedDeps[dep] = container.resolve(dep);
    }
    return fn(resolvedDeps);
  };
}

export default container;
