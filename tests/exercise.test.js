/**
 * @jest-environment jsdom
 */

describe('Exercise Page Tests', () => {
  let menuBtn, mobileMenu;

  beforeEach(() => {
    // Reset the DOM
    document.body.innerHTML = `
      <div id="navbar-mobile-button" class="navbar-mobile">
        <img src="img/brick_logo.png" alt="menu" class="mobile-logo" />
      </div>
      <nav id="navbar-mobile-menu" class="navbar-mobile-menu">
        <h2>EXERCISES</h2>
        <nav>
          <a href="#stoplight">🚦 Stop Light</a>
          <a href="#pushbutton">🔘 Pushbutton</a>
        </nav>
        <div class="install-button">
          <button id="install-button">⬇️ Install IDE</button>
        </div>
      </nav>
    `;

    // Initialize elements
    menuBtn = document.getElementById('navbar-mobile-button');
    mobileMenu = document.getElementById('navbar-mobile-menu');

    // Add event listeners
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });

    const installButton = mobileMenu.querySelector('#install-button');
    if (installButton) {
      installButton.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    }
  });

  test('mobile menu opens when button is clicked', () => {
    menuBtn.click();
    expect(mobileMenu.classList.contains('open')).toBe(true);
  });

  test('mobile menu closes when a link is clicked', () => {
    // First open the menu
    mobileMenu.classList.add('open');
    expect(mobileMenu.classList.contains('open')).toBe(true);
    
    // Click a link
    const link = mobileMenu.querySelector('a');
    link.click();
    expect(mobileMenu.classList.contains('open')).toBe(false);
  });

  test('mobile menu closes when install button is clicked', () => {
    // First open the menu
    mobileMenu.classList.add('open');
    expect(mobileMenu.classList.contains('open')).toBe(true);
    
    // Click the install button
    const installButton = mobileMenu.querySelector('#install-button');
    installButton.click();
    expect(mobileMenu.classList.contains('open')).toBe(false);
  });

  test('mobile menu toggles open/close on multiple button clicks', () => {
    // First click - open
    menuBtn.click();
    expect(mobileMenu.classList.contains('open')).toBe(true);
    
    // Second click - close
    menuBtn.click();
    expect(mobileMenu.classList.contains('open')).toBe(false);
    
    // Third click - open again
    menuBtn.click();
    expect(mobileMenu.classList.contains('open')).toBe(true);
  });
}); 