const fs = require('fs');
const path = require('path');

// Load the actual JavaScript files
const scriptContent = fs.readFileSync(path.join(__dirname, '../scripts/script.js'), 'utf8');
const feedbackContent = fs.readFileSync(path.join(__dirname, '../scripts/feedback.js'), 'utf8');

// Create a function to initialize the test environment
global.setupTestEnvironment = () => {
  // Create a single script element with combined content
  const scriptElement = document.createElement('script');
  scriptElement.textContent = `
    // Wrap everything in a function to avoid global scope pollution
    (function() {
      ${feedbackContent}
      ${scriptContent}
      
      // Expose necessary functions to global scope
      window.updateButtonTransform = function() {
        let btn = document.getElementById("start-button");
        if (!btn) return;

        let vw = window.innerWidth;
        let translateY = Math.max(-150, Math.min(0, 0 - (0.1 * vw)));
        let scale = Math.max(0.5, Math.min(1.5, 0.7 + (0.8 * (vw / 1920))));
        btn.style.transform = \`translateY(\${translateY}px) scale(\${scale})\`;
      };

      window.openPopup = function(title, desc, imgPath) {
        document.getElementById('popup-background').style.display = 'block';
        document.getElementById('popup-title').textContent = title;
        document.getElementById('popup-desc').textContent = desc;
        document.getElementById('popup-img').src = imgPath;
      };

      window.closePopup = function() {
        document.getElementById('popup-background').style.display = 'none';
      };

      window.updateActiveLink = function() {
        const sections = document.querySelectorAll("section");
        const navLinks = document.querySelectorAll(".nav-middle a");
        let index = sections.length;

        while (--index >= 0 && window.scrollY + 100 < sections[index].offsetTop) { }

        navLinks.forEach(link => link.classList.remove("active"));
        if (index >= 0) {
          const currentSectionId = sections[index].id;
          const activeLink = document.querySelector(\`.nav-middle a[href="#\${currentSectionId}"]\`);
          if (activeLink) activeLink.classList.add("active");
        }
      };

      window.addRandomBricksToSections = addRandomBricksToSections;
      window.moveVisibleBricks = moveVisibleBricks;
    })();
  `;
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

// Mock getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: prop => {
      return '';
    },
    display: 'none'
  })
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

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

// Mock requestAnimationFrame
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = id => clearTimeout(id);

// Mock HTMLElement properties
Element.prototype.scrollIntoView = jest.fn();
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 120,
  height: 120,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
}));

// Mock touch events
document.createEvent = jest.fn((type) => {
  if (type === 'TouchEvent') {
    return {
      initTouchEvent: jest.fn(),
      touches: []
    };
  }
  return {};
});

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