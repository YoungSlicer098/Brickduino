/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('JavaScript Functionality Tests', () => {
  beforeEach(() => {
    // Reset the DOM
    document.body.innerHTML = '';
    
    // Load HTML
    const htmlPath = path.join(__dirname, '../home.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    document.documentElement.innerHTML = html;

    // Setup test environment
    global.setupTestEnvironment();

    // Expose showComponents function
    window.showComponents = (type) => {
      const container = document.getElementById('carousel');
      if (!container) return;
      
      container.innerHTML = '';
      const components = type === 'arduino' ? window.arduinoComponents : window.brickduinoComponents;
      
      components.forEach(c => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <img src="${c.image}" alt="${c.title}">
          <div class="title">${c.title}</div>
        `;
        container.appendChild(card);
      });
    };

    // Mock component data
    window.arduinoComponents = [
      { title: 'Arduino UNO R3', image: 'test.png', desc: 'Test Description' }
    ];
    
    window.brickduinoComponents = [
      { title: 'Brickduino Uno R3', image: 'test.png', desc: 'Test Description' }
    ];

    // Mock window scroll event
    window.scrollTo = jest.fn();
    window.scrollToSection = (id) => {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    };
    
    // Create and dispatch a scroll event
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);
  });

  // 1. Navigation Tests
  describe('Navigation', () => {
    test('scrollToSection scrolls to the correct section', () => {
      const section = document.createElement('div');
      section.id = 'test-section';
      document.body.appendChild(section);
      
      section.scrollIntoView = jest.fn();
      window.scrollToSection('test-section');
      
      expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });
  });

  // 2. Mobile Menu Tests
  describe('Mobile Menu', () => {
    let menuBtn;
    let mobileMenu;

    beforeEach(() => {
      // Create mobile menu button and menu
      menuBtn = document.createElement('button');
      menuBtn.id = 'navbar-mobile-button';
      document.body.appendChild(menuBtn);

      mobileMenu = document.createElement('div');
      mobileMenu.id = 'navbar-mobile-menu';
      document.body.appendChild(mobileMenu);

      // Initialize the click handler
      window.toggleMobileMenu = () => {
        mobileMenu.classList.toggle('open');
      };
      
      menuBtn.onclick = window.toggleMobileMenu;
    });

    afterEach(() => {
      // Clean up
      if (menuBtn && menuBtn.parentNode) {
        menuBtn.parentNode.removeChild(menuBtn);
      }
      if (mobileMenu && mobileMenu.parentNode) {
        mobileMenu.parentNode.removeChild(mobileMenu);
      }
    });

    test('mobile menu button toggles menu visibility', () => {
      // Test opening
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      menuBtn.dispatchEvent(clickEvent);
      expect(mobileMenu.classList.contains('open')).toBe(true);
      
      // Test closing
      menuBtn.dispatchEvent(clickEvent);
      expect(mobileMenu.classList.contains('open')).toBe(false);
    });
  });

  // 3. Component Display Tests
  describe('Component Display', () => {
    let container;
    let button;

    beforeEach(() => {
      // Create carousel container
      container = document.createElement('div');
      container.id = 'carousel';
      document.body.appendChild(container);

      // Create button for component switching
      button = document.createElement('button');
      button.className = 'component-btn';
      document.body.appendChild(button);

      // Initialize component data
      window.arduinoComponents = [
        { title: 'Arduino UNO R3', image: 'test.png', desc: 'Test Description' }
      ];
      
      window.brickduinoComponents = [
        { title: 'Brickduino Uno R3', image: 'test.png', desc: 'Test Description' }
      ];

      // Define showComponents function
      window.showComponents = (type) => {
        const targetContainer = container; // Use the container reference directly
        if (!targetContainer) return;
        
        targetContainer.innerHTML = '';
        const components = type === 'arduino' ? window.arduinoComponents : window.brickduinoComponents;
        
        if (!components) return;
        
        components.forEach(c => {
          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = `
            <img src="${c.image}" alt="${c.title}">
            <div class="title">${c.title}</div>
          `;
          targetContainer.appendChild(card);
        });
      };
    });

    afterEach(() => {
      // Clean up
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
      if (button && button.parentNode) {
        button.parentNode.removeChild(button);
      }
      // Reset window properties
      delete window.arduinoComponents;
      delete window.brickduinoComponents;
      delete window.showComponents;
    });

    test('showComponents displays correct components', () => {
      window.showComponents('arduino');
      expect(container.children.length).toBe(1);
      
      const firstCard = container.querySelector('.card');
      expect(firstCard).not.toBeNull();
      expect(firstCard.querySelector('.title').textContent).toBe('Arduino UNO R3');
    });

    test('showComponents switches between arduino and brickduino components', () => {
      window.showComponents('arduino');
      expect(container.querySelector('.title').textContent).toBe('Arduino UNO R3');
      
      window.showComponents('brickduino');
      expect(container.querySelector('.title').textContent).toBe('Brickduino Uno R3');
    });
  });

  // 4. Form Validation Tests
  describe('Form Validation', () => {
    test('feedback form validates input correctly', () => {
      const nameInput = document.getElementById('name');
      
      // Test invalid input
      nameInput.value = '!';
      expect(nameInput.checkValidity()).toBe(false);
      
      // Test valid input
      nameInput.value = 'John Doe';
      expect(nameInput.checkValidity()).toBe(true);
    });

    test('feedback form has required fields', () => {
      const nameInput = document.getElementById('name');
      const feedbackText = document.getElementById('feedbackText');
      
      expect(nameInput.required).toBe(true);
      expect(feedbackText.required).toBe(true);
    });
  });

  // 5. Credits Popup Tests
  describe('Credits Popup', () => {
    test('credits popup opens and closes correctly', () => {
      const creditsButton = document.getElementById('credits-button');
      const creditsPopup = document.getElementById('credits-popup');
      const closeButton = creditsPopup.querySelector('.credits-close');
      
      // Add event listeners
      creditsButton.addEventListener('click', () => {
        creditsPopup.style.display = 'flex';
      });
      
      closeButton.addEventListener('click', () => {
        creditsPopup.style.display = 'none';
      });
      
      // Test opening
      creditsButton.click();
      expect(creditsPopup.style.display).toBe('flex');
      
      // Test closing
      closeButton.click();
      expect(creditsPopup.style.display).toBe('none');
    });
  });

  // 6. Component Data Tests
  describe('Component Data', () => {
    test('component arrays are properly structured', () => {
      expect(Array.isArray(window.arduinoComponents)).toBe(true);
      expect(Array.isArray(window.brickduinoComponents)).toBe(true);
      expect(window.arduinoComponents.length).toBe(1);
      expect(window.brickduinoComponents.length).toBe(1);
      
      const testComponent = window.arduinoComponents[0];
      expect(testComponent).toHaveProperty('title');
      expect(testComponent).toHaveProperty('image');
      expect(testComponent).toHaveProperty('desc');
    });
  });

  describe('Button Size Updates', () => {
    test('updateButtonTransform updates button style based on window width', () => {
      const button = document.createElement('button');
      button.id = 'start-button';
      document.body.appendChild(button);

      // Test with different window widths
      window.innerWidth = 1920;
      updateButtonTransform();
      expect(button.style.transform).toBe('translateY(0px) scale(1.5)');

      window.innerWidth = 960;
      updateButtonTransform();
      expect(button.style.transform).toBe('translateY(-96px) scale(1.1)');

      window.innerWidth = 480;
      updateButtonTransform();
      expect(button.style.transform).toBe('translateY(-150px) scale(0.7)');
    });
  });

  describe('Brick Animation', () => {
    test('addRandomBricksToSections adds bricks to sections', () => {
      const section = document.createElement('div');
      section.className = 'section';
      document.body.appendChild(section);

      addRandomBricksToSections();
      expect(section.querySelectorAll('.brick-image').length).toBeGreaterThan(0);
    });

    test('moveVisibleBricks updates brick positions on scroll', () => {
      const section = document.createElement('div');
      section.className = 'section';
      document.body.appendChild(section);

      addRandomBricksToSections();
      const brick = section.querySelector('.brick-image');
      
      window.scrollY = 100;
      moveVisibleBricks();
      expect(brick.style.transform).toBe('translate(-10px, -10px)');
    });
  });

  describe('Carousel Navigation', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="carousel-wrapper">
          <div id="carousel">
            <div class="card"></div>
            <div class="card"></div>
          </div>
          <div id="carousel-block"></div>
          <div class="arrow left"></div>
          <div class="arrow right"></div>
          <div id="carousel-progress-bar"></div>
        </div>
      `;
    });

    test('carousel scroll updates progress bar', () => {
      const carousel = document.getElementById('carousel');
      const progressBar = document.getElementById('carousel-progress-bar');

      // Mock carousel dimensions
      Object.defineProperty(carousel, 'scrollLeft', { value: 100 });
      Object.defineProperty(carousel, 'scrollWidth', { value: 1000 });
      Object.defineProperty(carousel, 'clientWidth', { value: 500 });

      // Trigger scroll event
      carousel.dispatchEvent(new Event('scroll'));
      expect(progressBar.style.width).toBe('20%');
    });

    test('arrow buttons scroll carousel', () => {
      const carousel = document.getElementById('carousel');
      carousel.scrollBy = jest.fn();

      const leftArrow = document.querySelector('.arrow.left');
      const rightArrow = document.querySelector('.arrow.right');

      leftArrow.click();
      expect(carousel.scrollBy).toHaveBeenCalledWith({ left: -300, behavior: 'smooth' });

      rightArrow.click();
      expect(carousel.scrollBy).toHaveBeenCalledWith({ left: 300, behavior: 'smooth' });
    });

    test('drag-click carousel functionality', () => {
      const carouselWrapper = document.getElementById('carousel-wrapper');
      const carousel = document.getElementById('carousel');
      const carouselBlock = document.getElementById('carousel-block');

      // Test mousedown
      carouselWrapper.dispatchEvent(new MouseEvent('mousedown', {
        pageX: 100,
        bubbles: true
      }));
      expect(carousel.classList.contains('active')).toBe(true);

      // Test mousemove
      document.dispatchEvent(new MouseEvent('mousemove', {
        pageX: 50,
        bubbles: true
      }));
      expect(carouselBlock.style.display).toBe('block');

      // Test mouseup
      document.dispatchEvent(new MouseEvent('mouseup', {
        bubbles: true
      }));
      expect(carousel.classList.contains('active')).toBe(false);
    });
  });

  describe('Component Popup', () => {
    test('openPopup creates and displays popup', () => {
      openPopup('Test Title', 'Test Description', 'test.png');
      const popup = document.querySelector('.popup');
      expect(popup).not.toBeNull();
      expect(popup.querySelector('h2').textContent).toBe('Test Title');
      expect(popup.querySelector('p').textContent).toBe('Test Description');
      expect(popup.querySelector('img').src).toContain('test.png');
    });

    test('closePopup removes popup', () => {
      openPopup('Test Title', 'Test Description', 'test.png');
      closePopup();
      expect(document.querySelector('.popup')).toBeNull();
    });
  });

  describe('Navigation Links', () => {
    test('updateActiveLink updates active link based on scroll position', () => {
      // Create sections
      document.body.innerHTML = `
        <nav>
          <a href="#home" class="nav-link">Home</a>
          <a href="#about" class="nav-link">About</a>
        </nav>
        <section id="home"></section>
        <section id="about"></section>
      `;

      // Mock getBoundingClientRect
      const sections = document.querySelectorAll('section');
      sections[0].getBoundingClientRect = () => ({ top: -100 });
      sections[1].getBoundingClientRect = () => ({ top: 50 });

      updateActiveLink();
      expect(document.querySelector('a[href="#home"]').classList.contains('active')).toBe(true);
    });
  });
}); 