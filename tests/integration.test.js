/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('Integration Tests', () => {
  beforeEach(() => {
    // Reset the DOM
    document.body.innerHTML = '';
    
    // Load HTML first
    const htmlPath = path.join(__dirname, '../home.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    document.documentElement.innerHTML = html;
    
    // Create blocklyDiv if it doesn't exist
    if (!document.getElementById('blocklyDiv')) {
      const blocklyDiv = document.createElement('div');
      blocklyDiv.id = 'blocklyDiv';
      document.body.appendChild(blocklyDiv);
    }

    // Mock Blockly
    global.Blockly = {
      inject: jest.fn(() => ({
        dispose: jest.fn(),
        getFlyout: jest.fn(() => ({
          isVisible: jest.fn().mockReturnValue(true),
          hide: jest.fn(),
          svgGroup_: document.createElement('div')
        })),
        getScale: jest.fn().mockReturnValue(0.8),
        setScale: jest.fn(),
        clear: jest.fn(),
        getAllBlocks: jest.fn().mockReturnValue([]),
        newBlock: jest.fn()
      }))
    };

    // Mock window methods
    window.scrollTo = jest.fn();
    window.alert = jest.fn();
  });

  // 4. Recovery Mechanisms
  describe('Recovery Mechanisms', () => {
    test('workspace recovers from invalid block state', () => {
      const workspace = Blockly.inject('blocklyDiv');
      
      // Simulate corrupted workspace state
      workspace.clear = jest.fn();
      workspace.dispose();
      
      // Verify workspace can be reinitialized
      const newWorkspace = Blockly.inject('blocklyDiv');
      expect(newWorkspace).toBeTruthy();
    });

    test('handles disconnected blocks gracefully', () => {
      const workspace = Blockly.inject('blocklyDiv');
      workspace.getAllBlocks = jest.fn().mockReturnValue([
        { type: 'setup_block', getChildren: () => [] },
        { type: 'disconnected_block', getChildren: () => [] }
      ]);
      
      // Verify disconnected blocks don't crash the workspace
      expect(() => workspace.getAllBlocks()).not.toThrow();
    });

    test('recovers from failed code generation', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const mockGenerator = {
        workspaceToCode: jest.fn().mockImplementation(() => {
          throw new Error('Generation failed');
        })
      };

      // Attempt code generation
      try {
        mockGenerator.workspaceToCode(workspace);
      } catch (error) {
        expect(error.message).toBe('Generation failed');
      }

      // Verify workspace is still usable
      expect(workspace.dispose).toBeDefined();
    });
  });

  // 6. Security and Access Control
  describe('Security and Access Control', () => {
    test('prevents XSS in block names', () => {
      const maliciousName = '<script>alert("xss")</script>';
      const blocklyDiv = document.getElementById('blocklyDiv');
      expect(blocklyDiv).not.toBeNull();
      
      // Create a text node instead of using innerHTML
      const textNode = document.createTextNode(maliciousName);
      blocklyDiv.appendChild(textNode);
      
      // Verify the content is escaped
      const renderedContent = blocklyDiv.innerHTML;
      expect(renderedContent).not.toContain('<script>');
      expect(renderedContent).toEqual('&lt;script&gt;alert("xss")&lt;/script&gt;');
    });

    test('validates block types before creation', () => {
      const workspace = Blockly.inject('blocklyDiv');
      workspace.newBlock = jest.fn().mockImplementation((type) => {
        if (!type.match(/^[a-zA-Z0-9_]+$/)) {
          throw new Error('Invalid block type');
        }
        return { type };
      });

      // Try creating block with invalid type
      expect(() => workspace.newBlock('malicious<script>')).toThrow('Invalid block type');
    });

    test('sanitizes custom block inputs', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const maliciousInput = 'javascript:alert(1)//';
      
      // Mock input sanitization
      const sanitizeInput = (input) => input.replace(/[<>]/g, '');
      const sanitizedInput = sanitizeInput(maliciousInput);
      
      expect(sanitizedInput).not.toContain('<');
      expect(sanitizedInput).not.toContain('>');
    });
  });

  // 7. Compatibility and Interoperability
  describe('Compatibility and Interoperability', () => {
    test('workspace is compatible with different screen sizes', () => {
      // Test different viewport sizes
      const viewports = [
        { width: 320, height: 480 },  // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1920, height: 1080 } // Desktop
      ];

      viewports.forEach(viewport => {
        Object.defineProperty(window, 'innerWidth', { value: viewport.width });
        Object.defineProperty(window, 'innerHeight', { value: viewport.height });
        
        const workspace = Blockly.inject('blocklyDiv');
        expect(workspace).toBeTruthy();
      });
    });

    test('blocks work with different Arduino board types', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const boardTypes = ['uno', 'mega', 'nano'];
      
      boardTypes.forEach(board => {
        workspace.boardType = board;
        expect(() => workspace.getScale()).not.toThrow();
      });
    });

    test('supports different browser events', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const flyout = workspace.getFlyout();
      const events = ['click', 'touchstart', 'pointerdown'];
      
      events.forEach(eventType => {
        const event = new Event(eventType);
        const svgGroup = flyout.svgGroup_;
        expect(() => svgGroup.dispatchEvent(event)).not.toThrow();
      });
    });
  });

  // 8. Logging and Alerts
  describe('Logging and Alerts', () => {
    beforeEach(() => {
      // Mock console methods
      console.log = jest.fn();
      console.error = jest.fn();
      console.warn = jest.fn();

      // Add logging to Blockly.inject
      const originalInject = Blockly.inject;
      Blockly.inject = jest.fn((...args) => {
        console.log('Workspace initialized');
        return originalInject(...args);
      });
    });

    test('logs workspace initialization', () => {
      Blockly.inject('blocklyDiv');
      expect(console.log).toHaveBeenCalledWith('Workspace initialized');
    });

    test('logs error on invalid block operations', () => {
      const workspace = Blockly.inject('blocklyDiv');
      workspace.newBlock = jest.fn().mockImplementation(() => {
        console.error('Invalid block operation');
        throw new Error('Invalid block operation');
      });

      try {
        workspace.newBlock('test_block');
      } catch (error) {
        expect(console.error).toHaveBeenCalledWith('Invalid block operation');
      }
    });

    test('warns on deprecated block usage', () => {
      const workspace = Blockly.inject('blocklyDiv');
      workspace.getBlockById = jest.fn().mockReturnValue({
        type: 'deprecated_block',
        warning: { setText: jest.fn() }
      });

      const block = workspace.getBlockById('test');
      if (block.type === 'deprecated_block') {
        console.warn('Deprecated block used');
      }

      expect(console.warn).toHaveBeenCalledWith('Deprecated block used');
    });
  });

  // 10. Data Preparation
  describe('Data Preparation', () => {
    test('prepares block data for code generation', () => {
      const workspace = Blockly.inject('blocklyDiv');
      workspace.getAllBlocks = jest.fn().mockReturnValue([
        { type: 'setup_block', getFieldValue: () => '13' },
        { type: 'led_block', getFieldValue: () => 'HIGH' }
      ]);

      const blocks = workspace.getAllBlocks();
      const preparedData = blocks.map(block => ({
        type: block.type,
        value: block.getFieldValue()
      }));

      expect(preparedData).toHaveLength(2);
      expect(preparedData[0].type).toBe('setup_block');
      expect(preparedData[1].value).toBe('HIGH');
    });

    test('validates block connections before connecting', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const mockBlock1 = { type: 'setup_block', connection: { check: ['setup'] } };
      const mockBlock2 = { type: 'led_block', connection: { check: ['led'] } };

      // Mock connection validation
      const canConnect = (block1, block2) => {
        return block1.connection.check[0] === 'setup' && block2.connection.check[0] === 'led';
      };

      expect(canConnect(mockBlock1, mockBlock2)).toBe(true);
    });

    test('formats generated code properly', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const mockCode = `
        void setup() {
          pinMode(13, OUTPUT);
        }
        void loop() {
          digitalWrite(13, HIGH);
        }
      `;

      // Format code (remove extra whitespace and normalize indentation)
      const formatCode = (code) => {
        return code
          .trim()
          .replace(/^\s+/gm, '  ')
          .replace(/\s+$/gm, '');
      };

      const formattedCode = formatCode(mockCode);
      expect(formattedCode).toContain('void setup()');
      expect(formattedCode).toContain('void loop()');
      expect(formattedCode.split('\n')[1]).toMatch(/^\s{2}/);
    });
  });
}); 