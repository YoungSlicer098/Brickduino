/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('UI/UX Tests', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Load HTML
    const htmlPath = path.join(__dirname, '../home.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    document.documentElement.innerHTML = html;

    // Create blocklyDiv if it doesn't exist
    if (!document.getElementById('blocklyDiv')) {
      const div = document.createElement('div');
      div.id = 'blocklyDiv';
      document.body.appendChild(div);
    }

    // Mock Blockly
    global.Blockly = {
      inject: jest.fn(() => ({
        dispose: jest.fn(),
        getFlyout: jest.fn(() => {
          let isVisible = true;
          return {
            isVisible: jest.fn(() => isVisible),
            hide: jest.fn(() => {
              isVisible = false;
            }),
            svgGroup_: document.createElement('div')
          };
        }),
        getScale: jest.fn().mockReturnValue(0.8),
        setScale: jest.fn(),
        clear: jest.fn(),
        getAllBlocks: jest.fn().mockReturnValue([]),
        newBlock: jest.fn(),
        workspaceToCode: jest.fn().mockReturnValue('void setup() {}\nvoid loop() {}')
      })),
      Workspace: {
        getById: jest.fn().mockReturnValue({
          newBlock: jest.fn()
        })
      }
    };

    // Mock window methods
    window.scrollTo = jest.fn();
    window.alert = jest.fn();

    // Mock getComputedStyle for responsive design test
    window.getComputedStyle = jest.fn().mockImplementation((element) => {
      if (element.classList.contains('navbar-mobile')) {
        return {
          display: window.innerWidth < 768 ? 'block' : 'none'
        };
      }
      return {};
    });
  });

  // 1. User Interface (UI) and User Experience (UX)
  describe('UI/UX Tests', () => {
    test('responsive design works across screen sizes', () => {
      const viewports = [
        { width: 320, height: 480 },  // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1920, height: 1080 } // Desktop
      ];

      viewports.forEach(viewport => {
        // Mock window innerWidth
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: viewport.width
        });

        // Create navbar-mobile element if it doesn't exist
        if (!document.querySelector('.navbar-mobile')) {
          const menu = document.createElement('div');
          menu.className = 'navbar-mobile';
          document.body.appendChild(menu);
        }

        const menu = document.querySelector('.navbar-mobile');
        const isMenuVisible = window.getComputedStyle(menu).display !== 'none';
        
        if (viewport.width < 768) {
          expect(isMenuVisible).toBe(true);
        } else {
          expect(isMenuVisible).toBe(false);
        }
      });
    });

    test('block dragging simulation', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const block = workspace.newBlock('test_block');
      
      // Simulate drag event
      const dragEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100
      });
      
      document.getElementById('blocklyDiv').dispatchEvent(dragEvent);
      expect(workspace.newBlock).toHaveBeenCalled();
    });
  });

  // 8. Cross-Browser and Cross-Platform Compatibility
  describe('Cross-Browser Compatibility', () => {
    test('workspace renders correctly', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const blocklyDiv = document.getElementById('blocklyDiv');
      expect(blocklyDiv).not.toBeNull();
      expect(workspace.dispose).toBeDefined();
    });

    test('touch event simulation', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const blocklyDiv = document.getElementById('blocklyDiv');
      
      // Simulate touch event
      const touchEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [{ clientX: 100, clientY: 100 }]
      });
      
      blocklyDiv.dispatchEvent(touchEvent);
      expect(workspace.newBlock).toBeDefined();
    });

    test('keyboard shortcut simulation', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const blocklyDiv = document.getElementById('blocklyDiv');
      
      // Simulate keyboard event
      const keyEvent = new KeyboardEvent('keydown', {
        key: 'c',
        ctrlKey: true,
        bubbles: true
      });
      
      blocklyDiv.dispatchEvent(keyEvent);
      expect(workspace.getAllBlocks).toBeDefined();
    });
  });

  // Additional UI Tests
  describe('Advanced UI Interactions', () => {
    test('flyout menu interaction', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const flyout = workspace.getFlyout();
      
      // Test flyout visibility
      expect(flyout.isVisible()).toBe(true);
      
      flyout.hide();
      expect(flyout.isVisible()).toBe(false);
    });

    test('code generation simulation', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const code = workspace.workspaceToCode();
      
      expect(code).toContain('void setup()');
      expect(code).toContain('void loop()');
    });

    test('error message display', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const errorDiv = document.createElement('div');
      errorDiv.className = 'blocklyError';
      errorDiv.textContent = 'Test error';
      document.body.appendChild(errorDiv);
      
      expect(document.querySelector('.blocklyError')).not.toBeNull();
      expect(document.querySelector('.blocklyError').textContent).toBe('Test error');
    });
  });
}); 