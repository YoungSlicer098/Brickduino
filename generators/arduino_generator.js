// goog.provide('Blockly.Arduino.generator');

// goog.require('Blockly.Arduino');



// ---------------------- Setup & Configurations Category Generator ----------------------

Blockly.Arduino['setup_block'] = function (block) {
    const statements = Blockly.Arduino.statementToCode(block, 'SETUP_CONTENT');
    Blockly.Arduino.setups_['user_setup'] = statements;
    return '';
};


Blockly.Arduino['loop_block'] = function (block) {
    const statements = Blockly.Arduino.statementToCode(block, 'LOOP_CONTENT');
    Blockly.Arduino.setLoop(`void loop() {\n${statements}}\n`);
    return '';
};

Blockly.Arduino['set_pin_mode'] = function (block) {
    const pin = Blockly.Arduino.valueToCode(block, 'PIN', Blockly.Arduino.ORDER_ATOMIC);
    const mode = block.getFieldValue('MODE');
    return `pinMode(${pin}, ${mode});\n`;
};

Blockly.Arduino['digital_write'] = function (block) {
    const pin = Blockly.Arduino.valueToCode(block, 'PIN', Blockly.Arduino.ORDER_ATOMIC);
    const state = block.getFieldValue('STATE');
    return `digitalWrite(${pin}, ${state});\n`;
};

Blockly.Arduino['digital_read'] = function (block) {
    const pin = Blockly.Arduino.valueToCode(block, 'PIN', Blockly.Arduino.ORDER_ATOMIC);
    return [`digitalRead(${pin})`, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['analog_read'] = function (block) {
    const pin = Blockly.Arduino.valueToCode(block, 'PIN', Blockly.Arduino.ORDER_ATOMIC);
    return [`analogRead(A${pin})`, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['analog_write'] = function (block) {
    const value = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ATOMIC);
    const pin = Blockly.Arduino.valueToCode(block, 'PIN', Blockly.Arduino.ORDER_ATOMIC);
    return `analogWrite(${pin}, ${value});\n`;
};

Blockly.Arduino['pin_dropdown'] = function (block) {
    const pin = Blockly.Arduino.valueToCode(block, 'PIN', Blockly.Arduino.ORDER_ATOMIC);
    return [pin, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['pin_analog_dropdown'] = function (block) {
    const pin = Blockly.Arduino.valueToCode(block, 'PIN', Blockly.Arduino.ORDER_ATOMIC);
    return [pin, Blockly.Arduino.ORDER_ATOMIC];
};

// ---------------------- LED Category Generator ----------------------

Blockly.Arduino['turn_led_on'] = function (block) {
    var pin = block.getFieldValue('PIN');
    Blockly.Arduino.setups_['setup_led_' + pin] = 'pinMode(' + pin + ', OUTPUT);';
    return 'digitalWrite(' + pin + ', HIGH);\n';
};

Blockly.Arduino['turn_led_off'] = function (block) {
    var pin = block.getFieldValue('PIN');
    Blockly.Arduino.setups_['setup_led_' + pin] = 'pinMode(' + pin + ', OUTPUT);';
    return 'digitalWrite(' + pin + ', LOW);\n';
};

Blockly.Arduino['custom_led'] = function (block) {
    var pin = block.getFieldValue('PIN');
    var intensity = block.getFieldValue('INTENSITY');
    Blockly.Arduino.setups_['setup_led_pwm_' + pin] = 'pinMode(' + pin + ', OUTPUT);';
    return 'analogWrite(' + pin + ', ' + intensity + ');\n';
};

Blockly.Arduino['blink_led'] = function (block) {
    var pin = block.getFieldValue('PIN');
    var times = block.getFieldValue('TIMES');
    var delayMs = block.getFieldValue('DELAY');
    Blockly.Arduino.setups_['setup_blink_' + pin] = 'pinMode(' + pin + ', OUTPUT);';
    var code = `for(int i=0; i<${times}; i++) {
      digitalWrite(${pin}, HIGH);
      delay(${delayMs});
      digitalWrite(${pin}, LOW);
      delay(${delayMs});
    }\n`;
    return code;
};

Blockly.Arduino['fade_led'] = function (block) {
    var pin = block.getFieldValue('PIN');
    Blockly.Arduino.setups_['setup_fade_' + pin] = 'pinMode(' + pin + ', OUTPUT);';
    var code = `
  for (int fadeValue = 0; fadeValue <= 255; fadeValue += 5) {
    analogWrite(${pin}, fadeValue);
    delay(30);
  }
  for (int fadeValue = 255; fadeValue >= 0; fadeValue -= 5) {
    analogWrite(${pin}, fadeValue);
    delay(30);
  }
  `;
    return code;
};

// ---------------------- Delay Category Generator ----------------------

Blockly.Arduino['delay_ms'] = function (block) {
    const delayTime = block.getFieldValue('DELAY');
    return `delay(${delayTime});\n`;
};

Blockly.Arduino['delay_seconds'] = function (block) {
    const secs = block.getFieldValue('SECONDS');
    return `delay(${secs * 1000});\n`;
};

Blockly.Arduino['delay_variable'] = function (block) {
    const delayVal = Blockly.Arduino.valueToCode(block, 'DELAY', Blockly.Arduino.ORDER_ATOMIC) || '0';
    return `delay(${delayVal});\n`;
};

// ---------------------- Loops Category Generator ----------------------

Blockly.Arduino['repeat_times'] = function (block) {
    var repeats = block.getFieldValue('TIMES');
    var branch = Blockly.Arduino.statementToCode(block, 'DO');
    var code = '';
    var loopVar = Blockly.Arduino.variableDB_.getDistinctName('i', Blockly.Variables.NAME_TYPE);
    code += 'for (int ' + loopVar + ' = 0; ' + loopVar + ' < ' + repeats + '; ' + loopVar + '++) {\n';
    code += branch;
    code += '}\n';
    return code;
};

Blockly.Arduino['while_true_loop'] = function (block) {
    var branch = Blockly.Arduino.statementToCode(block, 'DO');
    var code = 'while (true) {\n' + branch + '}\n';
    return code;
};

Blockly.Arduino['repeat_until'] = function (block) {
    var condition = Blockly.Arduino.valueToCode(block, 'CONDITION', Blockly.Arduino.ORDER_NONE) || 'false';
    var branch = Blockly.Arduino.statementToCode(block, 'DO');
    var code = 'while (!(' + condition + ')) {\n' + branch + '}\n';
    return code;
};

Blockly.Arduino['for_loop_variable'] = function (block) {
    var variable = Blockly.Arduino.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    var from = block.getFieldValue('FROM');
    var to = block.getFieldValue('TO');
    var step = block.getFieldValue('STEP');
    var branch = Blockly.Arduino.statementToCode(block, 'DO');

    var code = `for (int ${variable} = ${from}; ${variable} <= ${to}; ${variable} += ${step}) {\n`;
    code += branch;
    code += '}\n';
    return code;
};

Blockly.Arduino['break_loop'] = function (block) {
    return 'break;\n';
};

Blockly.Arduino['continue_loop'] = function (block) {
    return 'continue;\n';
};

// ---------------------- Variable & Value Category Generator ----------------------

Blockly.Arduino['declare_variable'] = function (block) {
    const type = block.getFieldValue('TYPE');
    const variable = Blockly.Arduino.nameDB_.getName(
        block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
    const value = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ATOMIC) || '0';
    return `${type} ${variable} = ${value};\n`;
};

Blockly.Arduino['set_variable'] = function (block) {
    const variable = Blockly.Arduino.nameDB_.getName(
        block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
    const value = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ATOMIC) || '0';
    return `${variable} = ${value};\n`;
};

Blockly.Arduino['get_variable'] = function (block) {
    const variable = Blockly.Arduino.nameDB_.getName(
        block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
    return [variable, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['number_value'] = function (block) {
    const value = block.getFieldValue('NUM');
    return [value, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['boolean_value'] = function (block) {
    const value = block.getFieldValue('BOOL');
    return [value, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['string_value'] = function (block) {
    const text = block.getFieldValue('TEXT');
    return [`"${text}"`, Blockly.Arduino.ORDER_ATOMIC];
};

// ---------------------- Math Category Generator ----------------------

Blockly.Arduino['math_arithmetic'] = function (block) {
    const operator = block.getFieldValue('OP');
    const a = Blockly.Arduino.valueToCode(block, 'A', Blockly.Arduino.ORDER_ATOMIC) || '0';
    const b = Blockly.Arduino.valueToCode(block, 'B', Blockly.Arduino.ORDER_ATOMIC) || '0';

    const ops = {
        ADD: '+',
        MINUS: '-',
        MULTIPLY: '*',
        DIVIDE: '/'
    };

    return [`(${a} ${ops[operator]} ${b})`, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['math_modulo'] = function (block) {
    const dividend = Blockly.Arduino.valueToCode(block, 'DIVIDEND', Blockly.Arduino.ORDER_ATOMIC) || '0';
    const divisor = Blockly.Arduino.valueToCode(block, 'DIVISOR', Blockly.Arduino.ORDER_ATOMIC) || '1';
    return [`(${dividend} % ${divisor})`, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['math_increment'] = function (block) {
    const variable = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    const amount = block.getFieldValue('AMOUNT');
    return `${variable} += ${amount};\n`;
};

Blockly.Arduino['math_minmax'] = function (block) {
    const mode = block.getFieldValue("MODE");
    const a = Blockly.Arduino.valueToCode(block, 'A', Blockly.Arduino.ORDER_ATOMIC) || '0';
    const b = Blockly.Arduino.valueToCode(block, 'B', Blockly.Arduino.ORDER_ATOMIC) || '0';
    const func = (mode === 'MIN') ? 'min' : 'max';
    return [`${func}(${a}, ${b})`, Blockly.Arduino.ORDER_ATOMIC];
};


Blockly.Arduino['math_map'] = function (block) {
    const value = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ATOMIC) || '0';
    const fromLow = Blockly.Arduino.valueToCode(block, 'FROM_LOW', Blockly.Arduino.ORDER_ATOMIC) || '0';
    const fromHigh = Blockly.Arduino.valueToCode(block, 'FROM_HIGH', Blockly.Arduino.ORDER_ATOMIC) || '1023';
    const toLow = Blockly.Arduino.valueToCode(block, 'TO_LOW', Blockly.Arduino.ORDER_ATOMIC) || '0';
    const toHigh = Blockly.Arduino.valueToCode(block, 'TO_HIGH', Blockly.Arduino.ORDER_ATOMIC) || '255';

    return [`map(${value}, ${fromLow}, ${fromHigh}, ${toLow}, ${toHigh})`, Blockly.Arduino.ORDER_ATOMIC];
};

// ---------------------- Logic Category Generator ----------------------

Blockly.Arduino['logic_boolean'] = function (block) {
    const value = block.getFieldValue('BOOL') === 'TRUE' ? 'true' : 'false';
    return [value, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['logic_compare'] = function (block) {
    const op = block.getFieldValue('OP');
    const A = Blockly.Arduino.valueToCode(block, 'A', Blockly.Arduino.ORDER_ATOMIC) || '0';
    const B = Blockly.Arduino.valueToCode(block, 'B', Blockly.Arduino.ORDER_ATOMIC) || '0';
    return [`(${A} ${op} ${B})`, Blockly.Arduino.ORDER_RELATIONAL];
};


Blockly.Arduino['logic_operation'] = function (block) {
    const op = block.getFieldValue('OP');
    const A = Blockly.Arduino.valueToCode(block, 'A', Blockly.Arduino.ORDER_LOGICAL_AND) || 'false';
    const B = Blockly.Arduino.valueToCode(block, 'B', Blockly.Arduino.ORDER_LOGICAL_AND) || 'false';
    return [`(${A} ${op} ${B})`, Blockly.Arduino.ORDER_LOGICAL_AND];
};

Blockly.Arduino['logic_negate'] = function (block) {
    const bool = Blockly.Arduino.valueToCode(block, 'BOOL', Blockly.Arduino.ORDER_LOGICAL_NOT) || 'false';
    return [`!(${bool})`, Blockly.Arduino.ORDER_LOGICAL_NOT];
};

// ---------------------- Control/Condition Category Generator ----------------------

Blockly.Arduino['control_if'] = function (block) {
    const condition = Blockly.Arduino.valueToCode(block, 'IF', Blockly.Arduino.ORDER_NONE) || 'false';
    const statements = Blockly.Arduino.statementToCode(block, 'DO');
    return `if (${condition}) {\n${statements}}\n`;
};

Blockly.Arduino['control_else_if'] = function (block) {
    const condition = Blockly.Arduino.valueToCode(block, 'IF', Blockly.Arduino.ORDER_NONE) || 'false';
    const statements = Blockly.Arduino.statementToCode(block, 'DO');
    return `else if (${condition}) {\n${statements}}\n`;
};

Blockly.Arduino['control_else'] = function (block) {
    const statements = Blockly.Arduino.statementToCode(block, 'DO');
    return `else {\n${statements}}\n`;
};

Blockly.Arduino['controls_repeat'] = function (block) {
    const times = block.getFieldValue('TIMES');
    const body = Blockly.Arduino.statementToCode(block, 'DO');
    return `for (int i = 0; i < ${times}; i++) {\n${body}}\n`;
};

Blockly.Arduino['controls_switch_case'] = function (block) {
    const switchVar = Blockly.Arduino.valueToCode(block, 'SWITCH', Blockly.Arduino.ORDER_NONE) || '0';
    const cases = Blockly.Arduino.statementToCode(block, 'CASES');
    return `switch (${switchVar}) {\n${cases}}\n`;
};

Blockly.Arduino['controls_case'] = function (block) {
    const caseValue = block.getFieldValue('CASE_VALUE');
    const caseCode = Blockly.Arduino.statementToCode(block, 'DO');
    return `case ${caseValue}:\n${caseCode}  break;\n`;
};

// ---------------------- Function Category Generator ----------------------

Blockly.Arduino['define_function'] = function (block) {
    const funcName = block.getFieldValue('FUNC_NAME');
    const statements = Blockly.Arduino.statementToCode(block, 'FUNC_BODY');
    const code = `void ${funcName}() {\n${statements}}\n`;
    Blockly.Arduino.definitions_[`func_${funcName}`] = code;
    return ''; // No inline code, only definition
};

Blockly.Arduino['call_function'] = function (block) {
    const funcName = block.getFieldValue('FUNC_NAME');
    return `${funcName}();\n`;
};

Blockly.Arduino['define_function_with_params'] = function (block) {
    const funcName = block.getFieldValue('FUNC_NAME');
    const params = Blockly.Arduino.valueToCode(block, 'PARAMS', Blockly.Arduino.ORDER_NONE);
    const statements = Blockly.Arduino.statementToCode(block, 'FUNC_BODY');

    const paramList = params ? `(${params})` : '()'; // Ensure parameters are properly passed
    const code = `void ${funcName}${paramList} {\n${statements}}\n`;

    Blockly.Arduino.definitions_[`func_${funcName}`] = code;
    return ''; // No inline code, only function definition
};

Blockly.Arduino['call_function_with_args'] = function (block) {
    const funcName = block.getFieldValue('FUNC_NAME');
    const args = Blockly.Arduino.valueToCode(block, 'ARGS', Blockly.Arduino.ORDER_NONE);
    const code = `${funcName}(${args});\n`;
    return code;
};

Blockly.Arduino['define_function_with_return'] = function (block) {
    const funcName = block.getFieldValue('FUNC_NAME');
    const returnType = block.getFieldValue('RETURN_TYPE');
    const statements = Blockly.Arduino.statementToCode(block, 'FUNC_BODY');
    const code = `${returnType} ${funcName}() {\n${statements}  return 0;\n}\n`;

    Blockly.Arduino.definitions_[`func_${funcName}`] = code;
    return ''; // No inline code, only function definition
};

Blockly.Arduino['return_value'] = function (block) {
    const returnValue = Blockly.Arduino.valueToCode(block, 'RETURN', Blockly.Arduino.ORDER_NONE);
    return `return ${returnValue};\n`;
};
