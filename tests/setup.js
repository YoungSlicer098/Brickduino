const fs = require('fs');
const path = require('path');

// Load the actual JavaScript files
const scriptContent = fs.readFileSync(path.join(__dirname, '../scripts/script.js'), 'utf8');
const feedbackContent = fs.readFileSync(path.join(__dirname, '../scripts/feedback.js'), 'utf8');

// Create a function to initialize the test environment
global.setupTestEnvironment = () => {
  // Create a script element for feedback.js
  const feedbackScript = document.createElement('script');
  feedbackScript.textContent = feedbackContent;
  document.body.appendChild(feedbackScript);

  // Create a script element for script.js
  const scriptElement = document.createElement('script');
  scriptElement.textContent = scriptContent;
  document.body.appendChild(scriptElement);

  // Mock fetch API
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ id: 1, name: 'Test User', feedback: 'Test Feedback', date: new Date().toISOString() }]),
      text: () => Promise.resolve(JSON.stringify([{ id: 1, name: 'Test User', feedback: 'Test Feedback', date: new Date().toISOString() }]))
    })
  );

  // Initialize any required event listeners
  document.dispatchEvent(new Event('DOMContentLoaded'));
};

// Mock IntersectionObserver
class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
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

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  key: jest.fn(),
  length: 0
};
global.localStorage = localStorageMock;

// Mock window functions
window.scrollTo = jest.fn();
window.alert = jest.fn();
window.confirm = jest.fn();
window.prompt = jest.fn();

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