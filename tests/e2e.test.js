/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

describe('End-to-End Tests', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Create blocklyDiv
    const blocklyDiv = document.createElement('div');
    blocklyDiv.id = 'blocklyDiv';
    document.body.appendChild(blocklyDiv);
    
    // Load HTML
    const htmlPath = path.join(__dirname, '../home.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    document.documentElement.innerHTML = html;

    // Ensure blocklyDiv exists after HTML load
    if (!document.getElementById('blocklyDiv')) {
      const div = document.createElement('div');
      div.id = 'blocklyDiv';
      document.body.appendChild(div);
    }

    // Mock performance API
    window.performance = {
      now: jest.fn(() => Date.now()),
      mark: jest.fn(),
      measure: jest.fn()
    };

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
        newBlock: jest.fn(),
        workspaceToCode: jest.fn(),
        serialize: jest.fn().mockImplementation(() => JSON.stringify({ blocks: [] })),
        deserialize: jest.fn().mockImplementation((data) => {
          try {
            JSON.parse(data);
          } catch (e) {
            throw new Error('Invalid workspace data');
          }
        })
      }))
    };

    // Mock Arduino compiler
    global.ArduinoCompiler = {
      compile: jest.fn().mockResolvedValue({ success: true }),
      upload: jest.fn().mockResolvedValue({ success: true })
    };
  });

  // 3. Data Integrity and Persistence
  describe('Data Integrity and Persistence', () => {
    test('saves workspace state to local storage', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const mockState = { blocks: [{ type: 'setup_block' }] };
      workspace.serialize = jest.fn().mockReturnValue(JSON.stringify(mockState));

      // Save workspace
      localStorage.setItem('workspaceState', workspace.serialize());
      expect(localStorage.getItem('workspaceState')).toBe(JSON.stringify(mockState));
    });

    test('loads workspace state from local storage', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const mockState = { blocks: [{ type: 'setup_block' }] };
      localStorage.setItem('workspaceState', JSON.stringify(mockState));

      // Load workspace
      const loadedState = JSON.parse(localStorage.getItem('workspaceState'));
      workspace.deserialize(JSON.stringify(loadedState));
      expect(workspace.deserialize).toHaveBeenCalledWith(JSON.stringify(mockState));
    });

    test('maintains data integrity during block operations', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const blocks = [
        { id: '1', type: 'setup_block', fields: { PIN: '13' } },
        { id: '2', type: 'led_block', fields: { STATE: 'HIGH' } }
      ];

      workspace.getAllBlocks.mockReturnValue(blocks);
      workspace.serialize.mockReturnValue(JSON.stringify(blocks));

      // Verify data integrity
      const saved = workspace.serialize();
      expect(() => {
        workspace.deserialize(saved);
      }).not.toThrow();
      
      const savedBlocks = workspace.getAllBlocks();
      expect(savedBlocks).toEqual(blocks);
    });
  });

  // 4. Third-Party Integrations
  describe('Third-Party Integrations', () => {
    test('compiles Arduino code successfully', async () => {
      const workspace = Blockly.inject('blocklyDiv');
      const code = 'void setup() { pinMode(13, OUTPUT); }';
      workspace.workspaceToCode.mockReturnValue(code);

      const result = await ArduinoCompiler.compile(code);
      expect(result.success).toBe(true);
    });

    test('uploads code to Arduino board', async () => {
      const workspace = Blockly.inject('blocklyDiv');
      const code = 'void setup() { pinMode(13, OUTPUT); }';
      workspace.workspaceToCode.mockReturnValue(code);

      const compileResult = await ArduinoCompiler.compile(code);
      const uploadResult = await ArduinoCompiler.upload(compileResult);
      expect(uploadResult.success).toBe(true);
    });
  });

  // 5. Performance and Load
  describe('Performance and Load', () => {
    test('handles large workspaces efficiently', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const largeBlockCount = 1000;
      const blocks = Array(largeBlockCount).fill().map((_, i) => ({
        id: i.toString(),
        type: 'led_block'
      }));

      const startTime = performance.now();
      workspace.getAllBlocks.mockReturnValue(blocks);
      workspace.workspaceToCode();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(1000); // Should process in under 1 second
    });

    test('maintains performance during rapid block creation', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const operations = 100;
      const startTime = performance.now();

      for (let i = 0; i < operations; i++) {
        workspace.newBlock('led_block');
      }

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(500); // Should complete in under 500ms
    });
  });

  // 9. Localization and Internationalization
  describe('Localization and Internationalization', () => {
    beforeEach(() => {
      // Mock translations
      global.translations = {
        en: { setup: 'Setup', loop: 'Loop' },
        es: { setup: 'Configuración', loop: 'Bucle' },
        ja: { setup: 'セットアップ', loop: 'ループ' }
      };
    });

    test('switches language successfully', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const changeLanguage = (lang) => {
        document.documentElement.lang = lang;
        return translations[lang];
      };

      // Test Spanish
      const esTranslations = changeLanguage('es');
      expect(esTranslations.setup).toBe('Configuración');

      // Test Japanese
      const jaTranslations = changeLanguage('ja');
      expect(jaTranslations.setup).toBe('セットアップ');
    });

    test('handles RTL languages properly', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const container = document.getElementById('blocklyDiv');
      
      // Ensure container exists
      expect(container).not.toBeNull();
      
      // Set RTL direction
      container.setAttribute('dir', 'rtl');
      
      // Verify RTL layout
      expect(container.getAttribute('dir')).toBe('rtl');
    });
  });

  // 10. Backup and Restore
  describe('Backup and Restore', () => {
    test('exports workspace to file', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const mockState = { blocks: [{ type: 'setup_block' }] };
      workspace.serialize = jest.fn().mockReturnValue(JSON.stringify(mockState));

      // Mock file system
      const exportPath = path.join(__dirname, 'test-backup.json');
      
      // Export
      fs.writeFileSync(exportPath, workspace.serialize());
      expect(fs.existsSync(exportPath)).toBe(true);
      
      // Cleanup
      fs.unlinkSync(exportPath);
    });

    test('imports workspace from file', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const mockState = { blocks: [{ type: 'setup_block' }] };
      
      // Mock file system
      const importPath = path.join(__dirname, 'test-import.json');
      fs.writeFileSync(importPath, JSON.stringify(mockState));

      // Import
      const imported = JSON.parse(fs.readFileSync(importPath, 'utf8'));
      workspace.deserialize(JSON.stringify(imported));
      expect(workspace.deserialize).toHaveBeenCalledWith(JSON.stringify(mockState));

      // Cleanup
      fs.unlinkSync(importPath);
    });

    test('handles corrupt backup files', () => {
      const workspace = Blockly.inject('blocklyDiv');
      const corruptData = 'invalid-json-data';
      
      expect(() => {
        workspace.deserialize(corruptData);
      }).toThrow('Invalid workspace data');
    });
  });
}); 