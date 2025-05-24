require('@testing-library/jest-dom');

// Set default timeout for all tests
jest.setTimeout(10000);

// Mock IntersectionObserver
class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
}

global.IntersectionObserver = IntersectionObserver;

// Mock window properties
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock performance
if (!window.performance) {
  window.performance = {
    now: () => Date.now(),
    memory: {
      usedJSHeapSize: 0,
      jsHeapSizeLimit: 0
    }
  };
}

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Add custom matchers
expect.extend({
  toHaveBeenCalledBefore(received, other) {
    const pass = received.mock.invocationCallOrder[0] < other.mock.invocationCallOrder[0];
    return {
      pass,
      message: () => `expected ${received} to have been called before ${other}`
    };
  }
}); 