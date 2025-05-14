// Create the Arduino generator
Blockly.Arduino = new Blockly.Generator('Arduino');

Blockly.Arduino.addReservedWords(
    'setup_block,loop_block,set_pin_mode,digital_write,digital_read,analog_read,analog_write,pin_dropdown,pin_analog_dropdown,turn_led_on,turn_led_off,custom_led,blink_led,fade_led,delay_ms,delay_seconds,delay_variable,repeat_times,while_true_loop,repeat_until,for_loop_variable,break_loop,continue_loop,declare_variable,set_variable,get_variable,number_value,boolean_value,string_value,math_arithmetic,math_modulo,math_increment,math_minmax,math_map,logic_boolean,logic_compare,logic_operation,logic_negate,control_if,control_else_if,control_else,controls_repeat,controls_switch_case,controls_case,define_function,call_function,define_function_with_params,call_function_with_args,define_function_with_return,return_value');

// Optional: for storing additional setup code
Blockly.Arduino.setups_ = Object.create(null);

// Used to initialize workspace generation
Blockly.Arduino.init = function (workspace) {
    Blockly.Arduino.setups_ = Object.create(null);
    Blockly.Arduino.variableDB_ = new Blockly.Names(Blockly.Arduino.RESERVED_WORDS_);
    Blockly.Arduino.variableDB_.setVariableMap(workspace.getVariableMap());
};

// Finalize generated code
Blockly.Arduino.finish = function (code) {
    // Merge setup code
    const setups = [];
    for (let name in Blockly.Arduino.setups_) {
        setups.push(Blockly.Arduino.setups_[name]);
    }

    // Compose final Arduino sketch
    return `
void setup() {
${setups.join('\n')}
}

void loop() {
${code}
}`.trim();
};

// Add a setup snippet
Blockly.Arduino.addSetup = function (key, code, overwrite = false) {
    if (!Blockly.Arduino.setups_.hasOwnProperty(key) || overwrite) {
        Blockly.Arduino.setups_[key] = code;
    }
};