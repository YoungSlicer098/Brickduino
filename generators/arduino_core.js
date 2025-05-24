/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

goog.provide('Blockly.Arduino');

goog.require('Blockly.Generator');

// Initialize Blockly if it doesn't exist
if (typeof Blockly === 'undefined') {
    var Blockly = {};
}

// Initialize the Arduino generator
if (typeof Blockly.Arduino === 'undefined') {
    Blockly.Arduino = new Blockly.Generator('Arduino');
}

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function name.
 * @private
 */
Blockly.Arduino.addReservedWords(
    'setup_block,loop_block,set_pin_mode,digital_write,digital_read,analog_read,analog_write,pin_dropdown,pin_analog_dropdown,turn_led_on,turn_led_off,custom_led,blink_led,fade_led,delay_ms,delay_seconds,delay_variable,repeat_times,while_true_loop,repeat_until,for_loop_variable,break_loop,continue_loop,declare_variable,set_variable,get_variable,number_value,boolean_value,string_value,math_arithmetic,math_modulo,math_increment,math_minmax,math_map,logic_boolean,logic_compare,logic_operation,logic_negate,control_if,control_else_if,control_else,controls_repeat,controls_switch_case,controls_case,define_function,call_function,define_function_with_params,call_function_with_args,define_function_with_return,return_value');

/**
 * Order of operation ENUMs.
 */
Blockly.Arduino.ORDER_ATOMIC = 0;           // 0 "" ...
Blockly.Arduino.ORDER_UNARY_POSTFIX = 1;   // expr++ expr-- () [] .
Blockly.Arduino.ORDER_UNARY_PREFIX = 2;    // -expr !expr ~expr ++expr --expr
Blockly.Arduino.ORDER_MULTIPLICATIVE = 3;   // * / % ~/
Blockly.Arduino.ORDER_ADDITIVE = 4;        // + -
Blockly.Arduino.ORDER_SHIFT = 5;           // << >>
Blockly.Arduino.ORDER_RELATIONAL = 6;      // >= > <= <
Blockly.Arduino.ORDER_EQUALITY = 7;        // == != === !==
Blockly.Arduino.ORDER_BITWISE_AND = 8;     // &
Blockly.Arduino.ORDER_BITWISE_XOR = 9;     // ^
Blockly.Arduino.ORDER_BITWISE_OR = 10;     // |
Blockly.Arduino.ORDER_LOGICAL_AND = 11;    // &&
Blockly.Arduino.ORDER_LOGICAL_OR = 12;     // ||
Blockly.Arduino.ORDER_CONDITIONAL = 13;    // expr ? expr : expr
Blockly.Arduino.ORDER_ASSIGNMENT = 14;     // = += -= *= /= %= <<= >>= ...
Blockly.Arduino.ORDER_NONE = 99;           // (...)

/**
 * Store setup code
 */
Blockly.Arduino.setups_ = Object.create(null);

/**
 * Store function definitions
 */
Blockly.Arduino.definitions_ = Object.create(null);

/**
 * Store included libraries
 */
Blockly.Arduino.includes_ = new Set();

/**
 * Arduino generator initialization.
 * @param {Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.Arduino.init = function (workspace) {
    // Clear previous data
    Blockly.Arduino.definitions_ = Object.create(null);
    Blockly.Arduino.setups_ = Object.create(null);
    Blockly.Arduino.includes_ = new Set();

    if (!Blockly.Arduino.variableDB_) {
        Blockly.Arduino.variableDB_ = new Blockly.Names(Blockly.Arduino.RESERVED_WORDS_);
    } else {
        Blockly.Arduino.variableDB_.reset();
    }

    if (workspace) {
        Blockly.Arduino.variableDB_.setVariableMap(workspace.getVariableMap());
    }
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Arduino.finish = function (code) {
    // Convert the includes, definitions, and functions to a single string of code
    let includes = Array.from(Blockly.Arduino.includes_).join('\n');
    if (includes) {
        includes += '\n\n';
    }

    let definitions = '';
    for (let name in Blockly.Arduino.definitions_) {
        definitions += Blockly.Arduino.definitions_[name] + '\n';
    }
    if (definitions) {
        definitions += '\n';
    }

    // Convert the setups into a string
    let setups = '';
    for (let name in Blockly.Arduino.setups_) {
        setups += '  ' + Blockly.Arduino.setups_[name] + '\n';
    }

    let allDefs = includes + definitions;

    // Define the setup() and loop() functions
    let setup = 'void setup() {\n' + setups + '}\n\n';
    let loop = 'void loop() {\n  ' + code.replace(/\n/g, '\n  ') + '\n}';

    // Clean up temporary data
    delete Blockly.Arduino.definitions_;
    delete Blockly.Arduino.includes_;
    delete Blockly.Arduino.setups_;
    Blockly.Arduino.variableDB_.reset();

    return allDefs + setup + loop;
};

/**
 * Common tasks for generating Arduino from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Arduino code created for this block.
 * @param {boolean=} opt_thisOnly True to generate code for only this statement.
 * @return {string} Arduino code with comments and subsequent blocks added.
 * @protected
 */
Blockly.Arduino.scrub_ = function (block, code, opt_thisOnly) {
    if (code === null) {
        // Block has handled code generation itself.
        return '';
    }
    let nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    if (opt_thisOnly) {
        // Disable following blocks.
        nextBlock = null;
    }
    return code + (nextBlock ? '\n' + Blockly.Arduino.blockToCode(nextBlock) : '');
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything. A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Arduino.scrubNakedValue = function (line) {
    return line + ';\n';
};

// Add a setup snippet
Blockly.Arduino.addSetup = function (key, code, overwrite) {
    if (overwrite || !Blockly.Arduino.setups_[key]) {
        Blockly.Arduino.setups_[key] = code;
    }
};

// Add a definition snippet
Blockly.Arduino.addDefinition = function (key, code) {
    Blockly.Arduino.definitions_[key] = code;
};

// Add an include
Blockly.Arduino.addInclude = function (include) {
    Blockly.Arduino.includes_.add(include);
};

// Helper function to ensure proper indentation
Blockly.Arduino.prefixLines = function (text, prefix) {
    return prefix + text.replace(/(?!\n$)\n/g, '\n' + prefix);
};

// Helper function to quote strings
Blockly.Arduino.quote_ = function (string) {
    return '"' + string.replace(/"/g, '\\"') + '"';
}; 