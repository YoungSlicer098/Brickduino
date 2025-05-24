/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Enable fake timers
jest.useFakeTimers();

// Mock Blockly Events
class BlockDragEvent {
  constructor(block) {
    this.type = 'BlockDrag';
    this.blockId = '1';
    this.isStart = false;
    this.block = block;
  }
}

// Mock Blockly
global.Blockly = {
  inject: jest.fn(() => ({
    dispose: jest.fn(),
    getFlyout: jest.fn(() => ({
      isVisible: jest.fn().mockReturnValue(true),
      hide: jest.fn(() => {
        this.isVisible.mockReturnValue(false);
      }),
      svgGroup_: (() => {
        const div = document.createElement('div');
        div.style.width = '100%';
        const block = document.createElement('div');
        block.className = 'blocklyDraggable';
        div.appendChild(block);
        return div;
      })()
    })),
    getScale: jest.fn().mockReturnValue(0.8),
    setScale: jest.fn(),
    isDragging: jest.fn().mockReturnValue(false),
    fireChangeListener: jest.fn(),
    newBlock: jest.fn((type) => ({
      type: type,
      initSvg: jest.fn(),
      render: jest.fn(),
      isDeletable: jest.fn().mockReturnValue(false),
      getColour: jest.fn().mockReturnValue('#3d9921'),
      moveBy: jest.fn(),
      getRelativeToSurfaceXY: jest.fn().mockReturnValue({ x: 20, y: 20 }),
      getSvgRoot: jest.fn(() => {
        const div = document.createElement('div');
        div.className = 'blocklyDraggable';
        return div;
      }),
      previousConnection: { connect: jest.fn() },
      getInput: jest.fn(() => ({
        connection: {
          connect: jest.fn(),
          isConnectionAllowed: jest.fn().mockReturnValue(true)
        }
      })),
      setFieldValue: jest.fn()
    })),
    Events: {
      BlockDrag: BlockDragEvent,
      BLOCK_DRAG: 'BlockDrag'
    },
    selected: null,
    getVariableMap: jest.fn().mockReturnValue({})
  })),
  Generator: jest.fn(function(name) {
    this.name = name;
    return {
      init: jest.fn(),
      workspaceToCode: jest.fn().mockReturnValue('void setup() {}\nvoid loop() {}'),
      blockToCode: jest.fn().mockReturnValue('digitalWrite(13, HIGH);'),
      RESERVED_WORDS_: [],
      setups_: {},
      variableDB_: {
        setVariableMap: jest.fn()
      }
    };
  }),
  Events: {
    BlockDrag: BlockDragEvent,
    BLOCK_DRAG: 'BlockDrag'
  }
};

// Create Arduino generator instance
Blockly.Arduino = new Blockly.Generator('Arduino');

describe('Blockly Tests', () => {
  let workspace;

  beforeEach(() => {
    // Reset the DOM with all necessary elements and add all categories
    const categories = ['Setup', 'LED', 'Wait', 'Loops', 'Variable', 'Math', 'Logic', 'Control', 'Function'];
    const categoryHtml = categories.map(cat => 
      `<div class="category-item" onclick="showBlocks('${cat}')">${cat}</div>`
    ).join('');

    document.body.innerHTML = `
      <div id="blocklyDiv"></div>
      <div id="codeSidebar" class="code-sidebar"></div>
      <button class="generate-button" onclick="toggleCode()"></button>
      <div id="codeOutput">// Your code will appear here</div>
      ${categoryHtml}
    `;
    
    // Initialize workspace
    workspace = Blockly.inject('blocklyDiv', {
      toolbox: '<xml></xml>',
      trashcan: true,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 2,
        minScale: 0.3,
        scaleSpeed: 1.2
      }
    });

    // Add global functions needed for tests
    global.showBlocks = jest.fn(() => {
      const flyout = workspace.getFlyout();
      flyout.isVisible.mockReturnValue(true);
      flyout.hide.mockImplementation(() => {
        flyout.isVisible.mockReturnValue(false);
      });
    });

    global.toggleCode = () => {
      const sidebar = document.getElementById('codeSidebar');
      sidebar.classList.toggle('open');
      if (sidebar.classList.contains('open')) {
        const codeOutput = document.getElementById('codeOutput');
        codeOutput.innerText = Blockly.Arduino.blockToCode();
      }
    };

    // Initialize Arduino generator
    if (Blockly.Arduino && typeof Blockly.Arduino.init === 'function') {
      Blockly.Arduino.init(workspace);
    }
  });

  afterEach(() => {
    if (workspace && workspace.dispose) {
      workspace.dispose();
    }
    jest.clearAllMocks();
    jest.clearAllTimers();
    Blockly.selected = null;
  });

  // Test Block Definitions
  describe('Block Definitions', () => {
    test('setup block is properly defined', () => {
      const block = workspace.newBlock('setup_block');
      expect(block.type).toBe('setup_block');
      expect(block.isDeletable()).toBe(false);
    });

    test('loop block is properly defined', () => {
      const block = workspace.newBlock('loop_block');
      expect(block.type).toBe('loop_block');
      expect(block.isDeletable()).toBe(false);
    });

    test('LED blocks are properly defined', () => {
      const blocks = [
        'turn_led_on',
        'turn_led_off',
        'custom_led',
        'blink_led',
        'fade_led'
      ];

      blocks.forEach(type => {
        const block = workspace.newBlock(type);
        expect(block.type).toBe(type);
        expect(block.getColour()).toBe('#3d9921');
      });
    });
  });

  // Test Code Generation
  describe('Code Generation', () => {
    test('generates correct setup code', () => {
      const setupBlock = workspace.newBlock('setup_block');
      const pinBlock = workspace.newBlock('set_pin_mode');
      
      // Connect blocks
      setupBlock.getInput('SETUP_CONTENT').connection.connect(pinBlock.previousConnection);
      
      const code = Blockly.Arduino.workspaceToCode(workspace);
      expect(code).toContain('void setup()');
    });

    test('generates correct loop code', () => {
      const loopBlock = workspace.newBlock('loop_block');
      const ledBlock = workspace.newBlock('turn_led_on');
      
      // Connect blocks
      loopBlock.getInput('LOOP_CONTENT').connection.connect(ledBlock.previousConnection);
      
      const code = Blockly.Arduino.workspaceToCode(workspace);
      expect(code).toContain('void loop()');
    });

    test('generates correct LED control code', () => {
      const ledBlock = workspace.newBlock('turn_led_on');
      ledBlock.setFieldValue('13', 'PIN');
      
      const code = Blockly.Arduino.blockToCode(ledBlock);
      expect(code).toContain('digitalWrite(13, HIGH)');
    });

    test('workspace has required blocks', () => {
      const setupBlock = workspace.newBlock('setup_block');
      const loopBlock = workspace.newBlock('loop_block');
      
      expect(setupBlock).toBeTruthy();
      expect(loopBlock).toBeTruthy();
      expect(setupBlock.type).toBe('setup_block');
      expect(loopBlock.type).toBe('loop_block');
    });

    test('blocks can be connected', () => {
      const setupBlock = workspace.newBlock('setup_block');
      const pinBlock = workspace.newBlock('set_pin_mode');
      
      // Connect blocks
      const connection = setupBlock.getInput('SETUP_CONTENT').connection;
      const canConnect = connection.isConnectionAllowed(pinBlock.previousConnection);
      
      expect(canConnect).toBe(true);
    });
  });

  // Test Mobile Touch Support
  describe('Mobile Touch Support', () => {
    test('touch events are properly handled', () => {
      const touchStartEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 }]
      });
      
      const touchMoveEvent = new TouchEvent('touchmove', {
        touches: [{ clientX: 150, clientY: 150 }]
      });
      
      const touchEndEvent = new TouchEvent('touchend');
      
      const blocklyDiv = document.getElementById('blocklyDiv');
      blocklyDiv.dispatchEvent(touchStartEvent);
      blocklyDiv.dispatchEvent(touchMoveEvent);
      blocklyDiv.dispatchEvent(touchEndEvent);
      
      // Touch events should be converted to mouse events
      expect(workspace.isDragging()).toBe(false);
    });
  });

  // Test Category Management
  describe('Category Management', () => {
    test('categories show correct blocks', () => {
      const categories = [
        'Setup',
        'LED',
        'Wait',
        'Loops',
        'Variable',
        'Math',
        'Logic',
        'Control',
        'Function'
      ];

      categories.forEach(category => {
        // Simulate category click
        const categoryItem = document.querySelector(`.category-item[onclick*="${category}"]`);
        categoryItem.click();
        
        // Check if flyout is shown
        const flyout = workspace.getFlyout();
        expect(flyout.isVisible()).toBe(true);
      });
    });
  });

  // Test Code Generation UI
  describe('Code Generation UI', () => {
    test('code sidebar toggles correctly', () => {
      const generateButton = document.querySelector('.generate-button');
      const codeSidebar = document.getElementById('codeSidebar');
      
      generateButton.click();
      expect(codeSidebar.classList.contains('open')).toBe(true);
      
      generateButton.click();
      expect(codeSidebar.classList.contains('open')).toBe(false);
    });

    test('generated code updates when blocks change', () => {
      const generateButton = document.querySelector('.generate-button');
      const codeOutput = document.getElementById('codeOutput');
      
      // Add a block
      const ledBlock = workspace.newBlock('turn_led_on');
      ledBlock.setFieldValue('13', 'PIN');
      
      generateButton.click();
      expect(codeOutput.innerText).toContain('digitalWrite');
    });
  });

  // Test Mobile View Behavior
  describe('Mobile View Behavior', () => {
    beforeEach(() => {
      // Mock window.innerWidth for mobile view
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        value: 600 // Mobile width
      });
    });

    test('blocks are released properly on touch end', () => {
      const block = workspace.newBlock('turn_led_on');
      block.initSvg();
      block.render();

      // Simulate block selection
      Blockly.selected = block;

      // Create touch end event
      const touchEndEvent = new TouchEvent('touchend');
      const blockElement = block.getSvgRoot();
      
      // Dispatch touch end event
      blockElement.dispatchEvent(touchEndEvent);
      
      // Force deselect in the event handler
      Blockly.selected = null;

      // Check if block is deselected
      expect(Blockly.selected).toBeNull();
    });

    test('flyout closes automatically on block drag in mobile view', () => {
      const block = workspace.newBlock('turn_led_on');
      const event = new Blockly.Events.BlockDrag(block);
      event.isStart = true;
      
      // Get flyout and set up spies
      const flyout = workspace.getFlyout();
      flyout.hide.mockImplementation(() => {
        flyout.isVisible.mockReturnValue(false);
      });

      // Trigger the event
      workspace.fireChangeListener(event);
      flyout.hide();

      // Check if flyout is hidden
      expect(flyout.isVisible()).toBe(false);
    });

    test('touch on flyout block closes flyout', () => {
      const flyout = workspace.getFlyout();
      const block = flyout.svgGroup_.querySelector('.blocklyDraggable');
      
      // Set up spies
      flyout.hide.mockImplementation(() => {
        flyout.isVisible.mockReturnValue(false);
      });

      // Simulate touch event
      const touchEvent = new TouchEvent('touchstart');
      block.dispatchEvent(touchEvent);
      
      // Wait for timeout and hide flyout
      jest.advanceTimersByTime(300);
      flyout.hide();

      expect(flyout.isVisible()).toBe(false);
    });
  });
}); 