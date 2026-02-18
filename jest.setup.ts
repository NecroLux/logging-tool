import "@testing-library/jest-dom";

// Suppress console.error in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      /Warning: ReactDOM.render is no longer supported in React 18/.test(
        args[0]
      )
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Provide a default BASE_URL for tests (so components that rely on a base path can use it)
(globalThis as any).__BASE_URL__ = "/";
