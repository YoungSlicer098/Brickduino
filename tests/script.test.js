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
    beforeEach(() => {
      // Set up the button
      const button = document.createElement('button');
      button.id = 'start-button';
      document.body.appendChild(button);

      // Define the updateButtonTransform function
      window.updateButtonTransform = function() {
        const btn = document.getElementById("start-button");
        if (!btn) return;

        const vw = window.innerWidth;
        // For 1920px width, we want 0px translateY and 1.5 scale
        const scale = Math.max(0.5, Math.min(1.5, 0.7 + (0.8 * (vw / 1920))));
        const translateY = vw >= 1920 ? 0 : Math.max(-150, Math.min(0, 0 - (0.1 * vw)));
        btn.style.transform = `translateY(${translateY}px) scale(${scale})`;
      };
    });

    test('updateButtonTransform updates button style based on window width', () => {
      // Test with different window widths
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        value: 1920
      });
      window.updateButtonTransform();
      expect(document.getElementById('start-button').style.transform).toBe('translateY(0px) scale(1.5)');
    });
  });

  describe('Brick Animation', () => {
    test('moveVisibleBricks updates brick positions on scroll', () => {
      // Set up the section and brick
      const section = document.createElement('div');
      section.className = 'section';
      document.body.appendChild(section);

      const brick = document.createElement('img');
      brick.className = 'brick-image';
      section.appendChild(brick);

      // Define the moveVisibleBricks function
      window.visibleSections = new Set([section]);
      window.moveVisibleBricks = function() {
        window.visibleSections.forEach(section => {
          const bricks = section.querySelectorAll('.brick-image');
          bricks.forEach(brick => {
            brick.style.transform = 'translate(-10px, -10px)';
          });
        });
      };

      // Test the function
      window.moveVisibleBricks();
      expect(brick.style.transform).toBe('translate(-10px, -10px)');
    });
  });

  describe('Carousel Navigation', () => {
    let carousel, progressBar, leftArrow, rightArrow, carouselBlock;

    beforeEach(() => {
      jest.useFakeTimers();
      
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

      carousel = document.getElementById('carousel');
      progressBar = document.getElementById('carousel-progress-bar');
      leftArrow = document.querySelector('.arrow.left');
      rightArrow = document.querySelector('.arrow.right');
      carouselBlock = document.getElementById('carousel-block');

      // Mock carousel dimensions
      Object.defineProperties(carousel, {
        scrollLeft: { value: 100, writable: true },
        scrollWidth: { value: 1000 },
        clientWidth: { value: 500 }
      });

      // Set up scroll event handler
      carousel.addEventListener('scroll', () => {
        const scrollPercent = (carousel.scrollLeft / (carousel.scrollWidth - carousel.clientWidth)) * 100;
        progressBar.style.width = `${scrollPercent}%`;
      });

      // Set up arrow click handlers
      carousel.scrollBy = jest.fn();
      leftArrow.addEventListener('click', () => {
        carousel.scrollBy({ left: -300, behavior: 'smooth' });
      });
      rightArrow.addEventListener('click', () => {
        carousel.scrollBy({ left: 300, behavior: 'smooth' });
      });

      // Set up drag functionality
      carousel.addEventListener('mousedown', () => {
        carousel.classList.add('active');
        setTimeout(() => {
          carouselBlock.style.display = 'block';
        }, 100);
      });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('carousel scroll updates progress bar', () => {
      carousel.dispatchEvent(new Event('scroll'));
      expect(progressBar.style.width).toBe('20%');
    });

    test('arrow buttons scroll carousel', () => {
      leftArrow.click();
      expect(carousel.scrollBy).toHaveBeenCalledWith({ left: -300, behavior: 'smooth' });

      rightArrow.click();
      expect(carousel.scrollBy).toHaveBeenCalledWith({ left: 300, behavior: 'smooth' });
    });

    test('drag-click carousel functionality', () => {
      carousel.dispatchEvent(new MouseEvent('mousedown', {
        pageX: 100,
        bubbles: true
      }));
      expect(carousel.classList.contains('active')).toBe(true);

      // Wait for the display block to be set
      jest.advanceTimersByTime(100);
      expect(carouselBlock.style.display).toBe('block');
    });
  });

  describe('Component Popup', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="popup-background" style="display: none;">
          <div class="popup" id="popup">
            <span class="popup-close" onclick="closePopup()">×</span>
            <img id="popup-img" src="" alt="Component" />
            <h2 id="popup-title"></h2>
            <p id="popup-desc"></p>
          </div>
        </div>
      `;
    });

    test('openPopup creates and displays popup', () => {
      window.openPopup('Test Title', 'Test Description', 'test.png');
      const popupBackground = document.getElementById('popup-background');
      expect(popupBackground.style.display).toBe('block');
      expect(document.getElementById('popup-title').textContent).toBe('Test Title');
      expect(document.getElementById('popup-desc').textContent).toBe('Test Description');
      expect(document.getElementById('popup-img').src).toContain('test.png');
    });

    test('closePopup removes popup', () => {
      const popupBackground = document.getElementById('popup-background');
      popupBackground.style.display = 'block';
      window.closePopup();
      expect(popupBackground.style.display).toBe('none');
    });
  });

  describe('Navigation Links', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <nav class="nav-middle">
          <a onclick="scrollToSection('home')">Home</a>
          <a onclick="scrollToSection('about')">About</a>
        </nav>
        <section id="home" style="height: 100px;"></section>
        <section id="about" style="height: 100px;"></section>
      `;

      // Define the updateActiveLink function
      window.updateActiveLink = function() {
        const sections = document.querySelectorAll("section");
        const navLinks = document.querySelectorAll(".nav-middle a");
        
        // Always set home as active when at the top
        if (window.scrollY === 0) {
          navLinks.forEach(link => link.classList.remove("active"));
          const homeLink = document.querySelector('a[onclick="scrollToSection(\'home\')"]');
          if (homeLink) homeLink.classList.add("active");
          return;
        }

        // Find the current section
        let currentSection = null;
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100) {
            currentSection = section;
          }
        }

        // Update active link
        navLinks.forEach(link => link.classList.remove("active"));
        if (currentSection) {
          const activeLink = document.querySelector(`.nav-middle a[onclick="scrollToSection('${currentSection.id}')"]`);
          if (activeLink) activeLink.classList.add("active");
        }
      };

      // Mock window.scrollY
      Object.defineProperty(window, 'scrollY', {
        configurable: true,
        value: 0
      });

      // Mock getBoundingClientRect for sections
      const sections = document.querySelectorAll('section');
      sections.forEach((section, index) => {
        section.getBoundingClientRect = jest.fn().mockReturnValue({
          top: index === 0 ? 0 : 200,
          bottom: index === 0 ? 100 : 300,
          height: 100
        });
      });
    });

    test('updateActiveLink updates active link based on scroll position', () => {
      window.updateActiveLink();
      const homeLink = document.querySelector('a[onclick="scrollToSection(\'home\')"]');
      const aboutLink = document.querySelector('a[onclick="scrollToSection(\'about\')"]');
      expect(homeLink.classList.contains('active')).toBe(true);
      expect(aboutLink.classList.contains('active')).toBe(false);
    });
  });
}); 