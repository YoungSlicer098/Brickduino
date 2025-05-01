// ---------------------- Variables ----------------------

const pinList = [
    ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"],
    ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"],
    ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"],
    ["12", "12"], ["13", "13"]
];

const pinModes = [
    ["INPUT", "INPUT"],
    ["OUTPUT", "OUTPUT"],
    ["INPUT_PULLUP", "INPUT_PULLUP"]
];

const pinAnalog = [
    ["A0", "A0"], ["A1", "A1"], ["A2", "A2"],
    ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]
];

const digitalStates = [
    ["HIGH", "HIGH"],
    ["LOW", "LOW"]
];

// ---------------------- Setup & Configurations Category ----------------------

Blockly.Blocks['setup_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Setup code here");
        this.appendDummyInput()
            .appendField("void setup() {");
        this.appendStatementInput("SETUP_CONTENT")
            .setCheck(null);
        this.setColour('#996f21');
        this.setTooltip("The setup function runs once at the start.");
        this.setHelpUrl("");
        this.setDeletable(false);
        this.setPreviousStatement(false);
        this.setNextStatement(false);
    }
};

Blockly.Blocks['loop_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Loop code here");
        this.appendDummyInput()
            .appendField("void loop() {");
        this.appendStatementInput("LOOP_CONTENT")
            .setCheck(null);
        this.setColour('#996f21');
        this.setTooltip("The loop function runs repeatedly after setup.");
        this.setHelpUrl("");
        this.setDeletable(false);
        this.setPreviousStatement(false);
        this.setNextStatement(false);
    }
};

Blockly.Blocks['set_pin_mode'] = {
    init: function () {

        this.appendValueInput("PIN")
            .setCheck("Number")
            .appendField("Set pin");
        this.appendDummyInput()
            .appendField("as")
            .appendField(new Blockly.FieldDropdown(pinModes), "MODE");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#996f21');
        this.setTooltip("Sets pin mode (INPUT, OUTPUT, or INPUT_PULLUP).");
    }
};

Blockly.Blocks['digital_write'] = {
    init: function () {

        this.appendValueInput("PIN")
            .setCheck("Number")
            .appendField("Set digital pin");
        this.appendDummyInput()
            .appendField("to")
            .appendField(new Blockly.FieldDropdown(digitalStates), "STATE");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#996f21');
        this.setTooltip("Writes HIGH or LOW to a digital pin.");
    }
};

Blockly.Blocks['digital_read'] = {
    init: function () {
        this.appendValueInput("PIN")
            .setCheck("Number")
            .appendField("Read digital pin");
        this.setOutput(true, "Boolean");
        this.setColour('#996f21');
        this.setTooltip("Reads HIGH or LOW from a digital pin.");
    }
};

Blockly.Blocks['analog_read'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Read analog pin A")
            .appendField(new Blockly.FieldDropdown([
                ["A0", "0"], ["A1", "1"], ["A2", "2"],
                ["A3", "3"], ["A4", "4"], ["A5", "5"]
            ]), "PIN");
        this.setOutput(true, "Number");
        this.setColour('#996f21');
        this.setTooltip("Reads analog value from the selected analog pin.");
    }
};

Blockly.Blocks['analog_write'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Write analog value")
            .appendField(new Blockly.FieldNumber(0, 0, 255), "VALUE")
            .appendField("to pin")
            .appendField(new Blockly.FieldDropdown(pinList), "PIN");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#996f21');
        this.setTooltip("Writes analog value (0-255) to PWM pin.");
    }
};

Blockly.Blocks['pin_dropdown'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("pin")
            .appendField(new Blockly.FieldDropdown(pinList), "PIN");
        this.setOutput(true, "Number");
        this.setColour('#996f21');
        this.setTooltip("Returns the selected pin number.");
    }
};

Blockly.Blocks['pin_analog_dropdown'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("pin")
            .appendField(new Blockly.FieldDropdown(pinAnalog), "PIN");
        this.setOutput(true, "Number");
        this.setColour('#996f21');
        this.setTooltip("Returns the selected analog pin number.");
    }
};

// ---------------------- LED Category ----------------------
Blockly.Blocks['turn_led_on'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Turn LED ON at pin")
            .appendField(new Blockly.FieldDropdown(pinList), "PIN");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#3d9921');
        this.setTooltip("Turns the LED on by sending HIGH signal to the selected pin.");
    }
};

Blockly.Blocks['turn_led_off'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Turn LED OFF at pin")
            .appendField(new Blockly.FieldDropdown(pinList), "PIN");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#3d9921');
        this.setTooltip("Turns the LED off by sending LOW signal to the selected pin.");
    }
};

Blockly.Blocks['custom_led'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("On pin")
            .appendField(new Blockly.FieldDropdown(pinList), "PIN")
            .appendField("with an intensity of")
            .appendField(new Blockly.FieldNumber(0, 0, 255), "INTENSITY");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#3d9921');
        this.setTooltip("Controls LED brightness using PWM (0 is off, 255 is brightest).");
    }
};

Blockly.Blocks['blink_led'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Blink LED at pin")
            .appendField(new Blockly.FieldDropdown(pinList), "PIN");
        this.appendDummyInput()
            .appendField("for")
            .appendField(new Blockly.FieldNumber(1, 1), "TIMES")
            .appendField("times with delay")
            .appendField(new Blockly.FieldNumber(500, 1), "DELAY")
            .appendField("ms");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#3d9921');
        this.setTooltip("Blink the LED a number of times with a delay.");
    }
};

Blockly.Blocks['fade_led'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Fade LED at pin")
            .appendField(new Blockly.FieldDropdown(pinList), "PIN");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#3d9921');
        this.setTooltip("Fade LED brightness up and down continuously once.");
    }
};

// ---------------------- Delay Category ----------------------

Blockly.Blocks['delay_ms'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Wait")
            .appendField(new Blockly.FieldNumber(1000, 0), "DELAY")
            .appendField("ms");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#259e58');
        this.setTooltip("Wait for some milliseconds.");
    }
};

Blockly.Blocks['delay_seconds'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Wait")
            .appendField(new Blockly.FieldNumber(1, 0), "SECONDS")
            .appendField("seconds");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#259e58');
        this.setTooltip("Wait for a number of seconds.");
    }
};

Blockly.Blocks['delay_variable'] = {
    init: function () {
        this.appendValueInput("DELAY")
            .setCheck("Number")
            .appendField("Wait for (ms):");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#259e58');
        this.setTooltip("Wait using a value from a variable.");
    }
};

// ---------------------- Loops Category ----------------------

Blockly.Blocks['repeat_times'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Repeat")
            .appendField(new Blockly.FieldNumber(5, 1), "TIMES")
            .appendField("times");
        this.appendStatementInput("DO")
            .setCheck(null)
            .appendField("do");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#2894a7');
        this.setTooltip("Repeat the enclosed blocks a specific number of times.");
    }
};

Blockly.Blocks['while_true_loop'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Repeat forever");
        this.appendStatementInput("DO")
            .setCheck(null)
            .appendField("do");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#2894a7');
        this.setTooltip("Repeat the enclosed blocks forever.");
    }
};

Blockly.Blocks['repeat_until'] = {
    init: function () {
        this.appendValueInput("CONDITION")
            .setCheck("Boolean")
            .appendField("Repeat until");
        this.appendStatementInput("DO")
            .setCheck(null)
            .appendField("do");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#2894a7');
        this.setTooltip("Repeat the enclosed blocks until the condition becomes true.");
    }
};

Blockly.Blocks['for_loop_variable'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("For")
            .appendField(new Blockly.FieldVariable("i"), "VAR")
            .appendField("from")
            .appendField(new Blockly.FieldNumber(0), "FROM")
            .appendField("to")
            .appendField(new Blockly.FieldNumber(10), "TO")
            .appendField("by")
            .appendField(new Blockly.FieldNumber(1, 1), "STEP");
        this.appendStatementInput("DO")
            .setCheck(null)
            .appendField("do");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#2894a7');
        this.setTooltip("Count from one number to another by a given step.");
    }
};

Blockly.Blocks['break_loop'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Break loop");
        this.setPreviousStatement(true);
        this.setNextStatement(false); // 'break' usually ends a loop block
        this.setColour(0);
        this.setTooltip("Exit the current loop immediately.");
    }
};

Blockly.Blocks['continue_loop'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Continue loop");
        this.setPreviousStatement(true);
        this.setNextStatement(false); // Continues to the next iteration
        this.setColour(0);
        this.setTooltip("Skip the rest of this loop iteration.");
    }
};

// ---------------------- Variable & Value Category ----------------------

Blockly.Blocks['declare_variable'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Create")
            .appendField(new Blockly.FieldDropdown([
                ["int", "int"],
                ["float", "float"],
                ["double", "double"],
                ["boolean", "boolean"],
                ["String", "String"]
            ]), "TYPE")
            .appendField("variable")
            .appendField(new Blockly.FieldVariable("item"), "VAR");
        this.appendValueInput("VALUE")
            .setCheck(null)
            .appendField("with value");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#224299');
        this.setTooltip("Declare a typed variable with an initial value.");
    }
};

Blockly.Blocks['set_variable'] = {
    init: function () {
        this.appendValueInput("VALUE")
            .setCheck(null)
            .appendField("Set")
            .appendField(new Blockly.FieldVariable("item"), "VAR")
            .appendField("to");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#224299');
        this.setTooltip("Set the value of an existing variable.");
    }
};

Blockly.Blocks['get_variable'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Get")
            .appendField(new Blockly.FieldVariable("item"), "VAR");
        this.setOutput(true, null);
        this.setColour('#224299');
        this.setTooltip("Returns the value of a variable.");
    }
};

Blockly.Blocks['number_value'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(0), "NUM");
        this.setOutput(true, "Number");
        this.setColour('#224299');
        this.setTooltip("A number value.");
    }
};


Blockly.Blocks['boolean_value'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["true", "true"],
                ["false", "false"]
            ]), "BOOL");
        this.setOutput(true, "Boolean");
        this.setColour('#224299');
        this.setTooltip("A true or false value.");
    }
};

Blockly.Blocks['string_value'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("\"")
            .appendField(new Blockly.FieldTextInput("Hello"), "TEXT")
            .appendField("\"");
        this.setOutput(true, "String");
        this.setColour('#224299');
        this.setTooltip("A text value.");
    }
};

// ---------------------- Math Category ----------------------

Blockly.Blocks['math_arithmetic'] = {
    init: function () {
        this.appendValueInput("A").setCheck("Number");
        this.appendDummyInput().appendField(new Blockly.FieldDropdown([
            ["+", "ADD"],
            ["−", "MINUS"],
            ["×", "MULTIPLY"],
            ["÷", "DIVIDE"]
        ]), "OP");
        this.appendValueInput("B").setCheck("Number");
        this.setOutput(true, "Number");
        this.setColour('#52249c');
        this.setTooltip("Basic math operations: +, −, ×, ÷");
    }
};

Blockly.Blocks['math_modulo'] = {
    init: function () {
        this.appendValueInput("DIVIDEND").setCheck("Number").appendField("remainder of");
        this.appendValueInput("DIVISOR").setCheck("Number").appendField("÷");
        this.setOutput(true, "Number");
        this.setColour('#52249c');
        this.setTooltip("Returns the remainder of a division.");
    }
};

Blockly.Blocks['math_increment'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Change")
            .appendField(new Blockly.FieldVariable("item"), "VAR")
            .appendField("by")
            .appendField(new Blockly.FieldNumber(1), "AMOUNT");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#52249c');
        this.setTooltip("Increase or decrease a number variable.");
    }
};

Blockly.Blocks['math_power'] = {
    init: function () {
        this.appendValueInput("BASE").setCheck("Number").appendField("base");
        this.appendValueInput("EXPONENT").setCheck("Number").appendField("raised to power");
        this.setOutput(true, "Number");
        this.setColour('#52249c');
        this.setTooltip("Returns base raised to the power of exponent (x^y).");
    }
};

Blockly.Blocks['math_minmax'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("get")
            .appendField(new Blockly.FieldDropdown([
                ["minimum", "MIN"],
                ["maximum", "MAX"]
            ]), "MODE");
        this.appendValueInput("A").setCheck("Number").appendField("of");
        this.appendValueInput("B").setCheck("Number").appendField("and");
        this.setOutput(true, "Number");
        this.setColour('#52249c');
        this.setTooltip("Returns the smaller or larger of two numbers.");
    }
};

Blockly.Blocks['math_map'] = {
    init: function () {
        this.appendDummyInput().appendField("map");
        this.appendValueInput("VALUE").setCheck("Number").appendField("value");
        this.appendValueInput("FROM_LOW").setCheck("Number").appendField("from low");
        this.appendValueInput("FROM_HIGH").setCheck("Number").appendField("to high");
        this.appendValueInput("TO_LOW").setCheck("Number").appendField("map to low");
        this.appendValueInput("TO_HIGH").setCheck("Number").appendField("map to high");
        this.setOutput(true, "Number");
        this.setColour('#52249c');
        this.setTooltip("Maps a number from one range to another.");
    }
};

// ---------------------- Math Category ----------------------

Blockly.Blocks['logic_boolean'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["true", "TRUE"],
                ["false", "FALSE"]
            ]), "BOOL");
        this.setOutput(true, "Boolean");
        this.setColour('#88249c');
        this.setTooltip("Boolean value: true or false.");
    }
};

Blockly.Blocks['logic_compare'] = {
    init: function () {
        this.appendValueInput("A").setCheck("Number");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["=", "=="],
                ["≠", "!="],
                ["<", "<"],
                [">", ">"],
                ["≤", "<="],
                ["≥", ">="]
            ]), "OP");
        this.appendValueInput("B").setCheck("Number");
        this.setOutput(true, "Boolean");
        this.setColour('#88249c');
        this.setTooltip("Compares two values and returns true or false.");
    }
};

Blockly.Blocks['logic_operation'] = {
    init: function () {
        this.appendValueInput("A").setCheck("Boolean");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["and", "&&"],
                ["or", "||"]
            ]), "OP");
        this.appendValueInput("B").setCheck("Boolean");
        this.setOutput(true, "Boolean");
        this.setColour('#88249c');
        this.setTooltip("Returns true if both or one condition is true.");
    }
};

Blockly.Blocks['logic_negate'] = {
    init: function () {
        this.appendValueInput("BOOL").setCheck("Boolean").appendField("not");
        this.setOutput(true, "Boolean");
        this.setColour('#88249c');
        this.setTooltip("Returns the opposite of the input (true → false).");
    }
};

// ---------------------- Control/Condition Category ----------------------

Blockly.Blocks['control_if'] = {
    init: function () {
        this.appendValueInput("IF")
            .setCheck("Boolean")
            .appendField("if");
        this.appendStatementInput("DO")
            .appendField("do");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#9c2448');
        this.setTooltip("If the condition is true, do something.");
    }
};

Blockly.Blocks['control_else_if'] = {
    init: function () {
        this.appendValueInput("IF")
            .setCheck("Boolean")
            .appendField("else if");
        this.appendStatementInput("DO")
            .appendField("do");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#9c2448');
        this.setTooltip("If the previous condition was false, check this one.");
    }
};

Blockly.Blocks['control_else'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("else");
        this.appendStatementInput("DO")
            .appendField("do");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#9c2448');
        this.setTooltip("If no conditions matched, do this.");
    }
};

Blockly.Blocks['controls_repeat'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("repeat")
            .appendField(new Blockly.FieldNumber(10, 1), "TIMES")
            .appendField("times");
        this.appendStatementInput("DO")
            .appendField("do");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#9c2448');
        this.setTooltip("Repeat a block of code a set number of times.");
    }
};

Blockly.Blocks['controls_switch_case'] = {
    init: function () {
        this.appendValueInput("SWITCH")
            .setCheck(null)
            .appendField("switch (");
        this.appendDummyInput()
            .appendField(")");
        this.appendStatementInput("CASES")
            .appendField("cases");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#9c2448');
        this.setTooltip("Switch statement with multiple cases.");
    }
};

Blockly.Blocks['controls_case'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("case")
            .appendField(new Blockly.FieldTextInput("value"), "CASE_VALUE");
        this.appendStatementInput("DO")
            .appendField("do");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#9c2448');
        this.setTooltip("A single case for a switch statement.");
    }
};

// ---------------------- Function Category ----------------------

Blockly.Blocks['define_function'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("define function")
            .appendField(new Blockly.FieldTextInput("myFunction"), "FUNC_NAME");
        this.appendStatementInput("FUNC_BODY")
            .setCheck(null)
            .appendField("do");
        this.setColour('#9c2424');
        this.setTooltip("Defines a custom function with no return value.");
        this.setHelpUrl("");
        this.setPreviousStatement(false);
        this.setNextStatement(false);
    }
};

Blockly.Blocks['call_function'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("call function")
            .appendField(new Blockly.FieldTextInput("myFunction"), "FUNC_NAME");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#9c2424');
        this.setTooltip("Calls a custom function.");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['define_function_with_params'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("define function")
            .appendField(new Blockly.FieldTextInput("myFunction"), "FUNC_NAME")
            .appendField("with parameters");
        this.appendValueInput("PARAMS")
            .setCheck("Array")
            .appendField("parameters");
        this.appendStatementInput("FUNC_BODY")
            .setCheck(null)
            .appendField("do");
        this.setColour('#9c2424');
        this.setTooltip("Defines a function with input parameters.");
        this.setHelpUrl("");
        this.setPreviousStatement(false);
        this.setNextStatement(false);
    }
};

Blockly.Blocks['call_function_with_args'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("call function")
            .appendField(new Blockly.FieldTextInput("myFunction"), "FUNC_NAME")
            .appendField("with arguments");
        this.appendValueInput("ARGS")
            .setCheck("Array")
            .appendField("arguments");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#9c2424');
        this.setTooltip("Calls a function with arguments.");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['define_function_with_return'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("define function")
            .appendField(new Blockly.FieldTextInput("myFunction"), "FUNC_NAME")
            .appendField("with return type");
        this.appendDummyInput()
            .appendField("return type")
            .appendField(new Blockly.FieldDropdown([["void", "void"], ["int", "int"], ["float", "float"], ["bool", "bool"], ["string", "string"]]), "RETURN_TYPE");
        this.appendStatementInput("FUNC_BODY")
            .setCheck(null)
            .appendField("do");
        this.setColour('#9c2424');
        this.setTooltip("Defines a function with a return value.");
        this.setHelpUrl("");
        this.setPreviousStatement(false);
        this.setNextStatement(false);
    }
};

Blockly.Blocks['return_value'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("return");
        this.appendValueInput("RETURN")
            .setCheck(null)
            .appendField("value");
        this.setColour('#9c2424');
        this.setTooltip("Returns a value from a function.");
        this.setHelpUrl("");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};