/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('Home Page Tests', () => {
  beforeAll(() => {
    const htmlPath = path.join(__dirname, '../home.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    document.documentElement.innerHTML = html;
  });

  // 1. Functionality Testing
  describe('Functionality', () => {
    test('page has correct title', () => {
      expect(document.title).toBe('BrickDuino');
    });

    test('navigation links exist', () => {
      const navLinks = document.querySelectorAll('.nav-middle a');
      expect(navLinks.length).toBe(5); // Home, About, Components, Exercises, Coding Blocks
    });

    test('logo images are present', () => {
      const logoImages = document.querySelectorAll('.nav-left img');
      expect(logoImages.length).toBe(2); // brick_logo and flat_logo
    });
  });

  // 2. Input Validation
  describe('Input Validation', () => {
    test('feedback form has proper validation attributes', () => {
      const nameInput = document.getElementById('name');
      expect(nameInput.getAttribute('maxlength')).toBe('50');
      expect(nameInput.getAttribute('pattern')).toBe('[a-zA-Z0-9\\s._-]{2,}');
    });

    test('feedback textarea has character limit', () => {
      const textarea = document.getElementById('feedbackText');
      expect(textarea.getAttribute('maxlength')).toBe('500');
    });
  });

  // 3. Output Verification
  describe('Output Verification', () => {
    test('sections are properly loaded', () => {
      const sections = document.querySelectorAll('.section');
      const sectionIds = ['home', 'about', 'components', 'exercises', 'coding-blocks', 'feedback'];
      expect(sections.length).toBe(sectionIds.length);
      
      sectionIds.forEach(id => {
        const section = document.getElementById(id);
        expect(section).not.toBeNull();
      });
    });

    test('component category buttons exist', () => {
      const componentBtns = document.querySelectorAll('.component-btn');
      expect(componentBtns.length).toBe(2); // Arduino and BrickDuino components
    });
  });

  // 4. Structure Verification
  describe('Structure Verification', () => {
    test('has required meta tags', () => {
      const metaTags = document.querySelectorAll('meta');
      const hasViewport = Array.from(metaTags).some(tag => 
        tag.getAttribute('name') === 'viewport'
      );
      expect(hasViewport).toBe(true);
    });

    test('has required stylesheets', () => {
      const styleLinks = document.querySelectorAll('link[rel="stylesheet"]');
      expect(styleLinks.length).toBeGreaterThan(0);
    });
  });

  // 5. Content Verification
  describe('Content Verification', () => {
    test('about section has content', () => {
      const aboutDesc = document.querySelector('.aboutus-description');
      expect(aboutDesc.textContent.length).toBeGreaterThan(0);
    });

    test('components section has description', () => {
      const compDesc = document.querySelector('.components-description');
      expect(compDesc.textContent.length).toBeGreaterThan(0);
    });
  });

  // 6. Footer Verification
  describe('Footer Verification', () => {
    test('footer links are present', () => {
      const footerLinks = document.querySelectorAll('.footer-links a');
      expect(footerLinks.length).toBe(2); // GitHub and TUP links
    });

    test('footer has copyright text', () => {
      const footerText = document.querySelector('.footer-text');
      expect(footerText.textContent).toContain('Brickduino');
    });
  });

  // 7. Interactive Elements
  describe('Interactive Elements', () => {
    test('start button exists', () => {
      const startButton = document.getElementById('start-button');
      expect(startButton).not.toBeNull();
    });

    test('credits button exists', () => {
      const creditsButton = document.getElementById('credits-button');
      expect(creditsButton).not.toBeNull();
    });
  });

  // 8. Form Elements
  describe('Form Elements', () => {
    test('feedback form exists', () => {
      const feedbackForm = document.getElementById('feedbackForm');
      expect(feedbackForm).not.toBeNull();
    });

    test('form has submit button', () => {
      const submitButton = document.getElementById('submit-feedback');
      expect(submitButton).not.toBeNull();
      expect(submitButton.type).toBe('submit');
    });
  });

  // 9. Image Resources
  describe('Image Resources', () => {
    test('logo images have correct sources', () => {
      const brickLogo = document.querySelector('.img-logo');
      const flatLogo = document.querySelector('.img-flat-logo');
      
      expect(brickLogo.getAttribute('src')).toBe('img/brick_logo.png');
      expect(flatLogo.getAttribute('src')).toBe('img/flat_logo.png');
    });
  });

  // 10. Script Loading
  describe('Script Loading', () => {
    test('required scripts are included', () => {
      const scripts = document.querySelectorAll('script');
      const scriptSources = Array.from(scripts).map(script => script.getAttribute('src'));
      
      expect(scriptSources).toContain('scripts/script.js');
      expect(scriptSources).toContain('scripts/feedback.js');
    });
  });
}); 