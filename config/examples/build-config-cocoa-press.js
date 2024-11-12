/* Portions (c) 2019, Cocoa Press.
 * Portions (c) 2019 Aleph Objects, Inc.
 * Portions (c) 2019 Marcio Teixeira
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * To view a copy of the GNU General Public License, go to the following
 * location: <http://www.gnu.org/licenses/>.
 */

const path = require('path');
const fsOrig = require('fs');
const fs = fsOrig.promises;


const PRINTER_CHOICES = [
    "CocoaPress_MiniChef"
]

const TOOLHEAD_CHOICES = [
    "CocoaPress_SingleExtruder"
]

/************************** START OF CONFIGURATION **************************
 * Table of Contents:
 * ------------------
 *  1. PRINTER MODEL CHARACTERISTICS
 *  2. GENERAL CONFIGURATION
 *  3. EXPERIMENTAL FEATURES
 *  4. MOTHERBOARD AND PIN CONFIGURATION
 *  5. ENDSTOP CONFIGURATION
 *  6. HOMING & AXIS DIRECTIONS
 *  7. PROBING OPTIONS
 *  8. COCOA PRESS TOOLHEADS
 *  9. TEMPERATURE SETTINGS
 * 10. COOLING FAN CONFIGURATION
 * 11. AXIS TRAVEL LIMITS
 * 12. AUTOLEVELING / BED PROBE
 * 13. FILAMENT CONFIGURATION
 * 14. MOTOR DRIVER TYPE
 * 15. TRINAMIC DRIVER CONFIGURATION
 * 16. TRINAMIC SENSORLESS HOMING
 * 17. MOTOR CURRENTS
 * 18. ACCELERATION, FEEDRATES AND XYZ MOTOR STEPS
 * 19. LCD OPTIONS
 */

function C_STRING(str) {
    return "\"" + str.replace(/\n$/g, "").replace(/^\n/g, "").replace(/\n/g, "\\n") + "\"";
}

function format_val(val) {
    // Formats a list in C style, i.e. {0, 1, 2}
    const limitPrecision = (key, val) => val.toFixed ? Number(val.toFixed(2)) : val;
    return typeof val == 'string' ? val : JSON.stringify(val, limitPrecision).replace(/\[/g,'{').replace(/\]/g,'}')
}

function format(str, ...args) {
    return str.replace(/{}/g, () => format_val(args.shift()));
}

function make_config(PRINTER, TOOLHEAD) {
    MARLIN = {}

    const ENABLED = str => MARLIN.hasOwnProperty(str) && MARLIN[str];

/********************************* DEFAULTS **********************************/

    USE_AUTOLEVELING                                     = true
    USE_TOUCH_UI                                         = true
    USE_COOLING_CHAMBER                                  = false

    MARLIN["SDSUPPORT"]                                  = true
    MARLIN["USB_FLASH_DRIVE_SUPPORT"]                    = PRINTER.includes("USB")

    MARLIN["LIN_ADVANCE"]                                = true
    MARLIN["ADVANCE_K"]                                  = 0.0
    MARLIN["BINARY_FILE_TRANSFER"]                       = true
    MARLIN["EXPECTED_PRINTER_CHECK"]                     = true

    MARLIN["MARLIN_DEV_MODE"]                            = false
    MARLIN["USE_WATCHDOG"]                               = true
    if( ENABLED("USB_FLASH_DRIVE_SUPPORT") ) {
        MARLIN["USB_FLASH_DRIVE_SUPPORT"]                = true
        MARLIN["USE_UHS3_USB"]                           = false
        MARLIN["AO_EXP2_PINMAP"]                         = true // Daisy-chain LCD/USB
        MARLIN["USB_INTR_PIN"]                           = 'SD_DETECT_PIN'
    } else {
        MARLIN["AO_EXP1_PINMAP"]                         = true // Non-daisy chained
        //MARLIN["AO_EXP2_PINMAP"]                       = true // Daisy-chain LCD/SD; Not reliable
    }

/*********************** PRINTER MODEL CHARACTERISTICS ***********************/

    MARLIN["STRING_CONFIG_H_AUTHOR"]                     = C_STRING("(Cocoa Press Marlin)")
    MARLIN["EEPROM_SETTINGS"]                            = true // EW - Enabled
    MARLIN["PRINTCOUNTER"]                               = true // EW - Enabled
    MARLIN["CUSTOM_MACHINE_NAME"]                        = C_STRING("Cocoa Press")
    MARLIN["USB_DEVICE_PRODUCT_NAME"]                    = C_STRING("Cocoa Press ")
    MARLIN["M16_MACHINE_NAME"]                           = C_STRING("Cocoa Press MiniChef")
    MARLIN["MACHINE_UUID"]                               = C_STRING("c51664e3-50b4-40fb-9bd0-63a8cd30df18")
    MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]               = 22.66

/********************* MOTHERBOARD AND PIN CONFIGURATION *********************/

    MARLIN["MOTHERBOARD"]                                = 'BOARD_ARCHIM2'
    MARLIN["SERIAL_PORT"]                                = -1

    /* Force Archim to use same USB ID as Mini-Rambo and Rambo when flashed
     * NOTE: While in "erase" (bootloader) mode, the ID will be 03eb:6124
     */
    MARLIN["USB_DEVICE_VENDOR_ID"]                   = '0x27b1'
    MARLIN["USB_DEVICE_PRODUCT_ID"]                  = '0x0001'

    /* The host MMC bridge is impractically slow and should not be used
     */
    if (ENABLED("SDSUPPORT") || ENABLED("USB_FLASH_DRIVE_SUPPORT")) {
        MARLIN["DISABLE_DUE_SD_MMC"]                 = true
    }

/*************************** ENDSTOP CONFIGURATION ***************************/

    MARLIN["Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN"]         = true

    MARLIN["Y_MAX_ENDSTOP_HIT_STATE"]                    = 'HIGH'

    MARLIN["SD_ABORT_ON_ENDSTOP_HIT"]                    = ENABLED("SDSUPPORT")
    MARLIN["DIRECT_PIN_CONTROL"]                         = true

/************************* HOMING & AXIS DIRECTIONS **************************/

    MARLIN["COREXY"]                                     = true
    // Invert X and Y for production printers due to wiring mishap
    MARLIN["INVERT_X_DIR"]                               = 'true'
    MARLIN["INVERT_Y_DIR"]                               = 'true'

    MARLIN["INVERT_Z_DIR"]                               = 'false'
    MARLIN["INVERT_E0_DIR"]                              = 'false'
    MARLIN["INVERT_E1_DIR"]                              = 'false'

    MARLIN["X_HOME_DIR"]                                 =  1
    MARLIN["Y_HOME_DIR"]                                 =  1
    MARLIN["Z_HOME_DIR"]                                 = -1

    MARLIN["Z_SAFE_HOMING"]                              = true // EW - Enabled to zero z in the middle of the bed
    MARLIN["HOMING_FEEDRATE_MM_M"]                       = [50*60, 50*60, 5*60] // EW - changed Z from 4 to 6

/**************************** NOZZLE PARK FEATURE ****************************/

    MARLIN["NOZZLE_PARK_FEATURE"]                        = true
    MARLIN["NOZZLE_PARK_POINT"]                          = [70, 5, 20]

    // Parking the head does not seem to quite work, so leaving off for now
    //MARLIN["ADVANCED_PAUSE_FEATURE"]                     = true
    //MARLIN["PARK_HEAD_ON_PAUSE"]                         = true
    //MARLIN["PAUSE_PARK_RETRACT_LENGTH"]                  = 0

/*************************** COCOA PRESS TOOLHEADS ***************************/

    if(["CocoaPress_SingleExtruder"].includes(TOOLHEAD)) {
        MARLIN["EXTRUDERS"]                              = 1
        MARLIN["E0_CURRENT"]                             = 960 // mA
        MARLIN["COCOA_PRESS_EXTRUDER"]                   = true
    }

/**************************** TEMPERATURE SETTINGS ***************************/

    MARLIN["PIDTEMP"]                                    = true // EW - skipping this section for now
    MARLIN["PID_DEBUG"]                                  = true

    MARLIN["THERMAL_PROTECTION_HOTENDS"]                 = true
    MARLIN["THERMAL_PROTECTION_BED"]                     = false
    MARLIN["THERMAL_PROTECTION_CHAMBER"]                 = false
    MARLIN["THERMAL_PROTECTION_COOLER"]                  = false
    MARLIN["THERMAL_PROTECTION_HYSTERESIS"]              = 1 // EW - changed from 4 to 1
    MARLIN["PREVENT_COLD_EXTRUSION"]                     = false // EW - Turning off so we can use solenoid even when chocolate is cold
    MARLIN["EXTRUDE_MINTEMP"]                            = 10 // EW - changed from 175 to 10

    // 998 is the custom CocoaPress thermistor profile
    MARLIN["TEMP_SENSOR_0"]                              = 101
    MARLIN["TEMP_SENSOR_1"]                              = 101
    MARLIN["TEMP_SENSOR_BED"]                            = 0

    MARLIN["TOUCH_UI_LCD_TEMP_SCALING"]                  = 10 // Scale all UI temperatures by 10
    MARLIN["TOUCH_UI_LCD_TEMP_PRECISION"]                = 1  // Use one decimal point for temperatures

    // These values are scaled by 10, set temp to 800 + HOTEND_OVERSHOOT
    MARLIN["HEATER_0_MAXTEMP"]                           = 815
    MARLIN["HEATER_1_MAXTEMP"]                           = 815
    MARLIN["HEATER_2_MAXTEMP"]                           = 815
    MARLIN["HEATER_3_MAXTEMP"]                           = 815
    MARLIN["HEATER_4_MAXTEMP"]                           = 815
    MARLIN["HEATER_5_MAXTEMP"]                           = 815


    MARLIN["HEATER_0_MINTEMP"]                           = 100
    MARLIN["HEATER_1_MINTEMP"]                           = 100
    MARLIN["HEATER_2_MINTEMP"]                           = -10
    MARLIN["HEATER_3_MINTEMP"]                           = -10
    MARLIN["HEATER_4_MINTEMP"]                           = -10
    MARLIN["HEATER_5_MINTEMP"]                           = -10

    // Preheat options for chocolate

    MARLIN["PREHEAT_1_LABEL"]                            = C_STRING("Cocoa")
    MARLIN["COCOA_PRESS_PREHEAT_SECONDS"]                = 20*60
    MARLIN["COCOA_PRESS_PREHEAT_DARK_CHOCOLATE_SCRIPT"]  = C_STRING("M104 S331 T0\nM104 S330 T1")
    MARLIN["COCOA_PRESS_PREHEAT_MILK_CHOCOLATE_SCRIPT"]  = C_STRING("M104 S340 T0\nM104 S339 T1")
    MARLIN["COCOA_PRESS_PREHEAT_WHITE_CHOCOLATE_SCRIPT"] = C_STRING("M104 S314 T0\nM104 S313 T1")

    MARLIN["SD_ABORT_NO_COOLDOWN"]                       = true
    MARLIN["EVENT_GCODE_SD_ABORT"]                       = C_STRING( "G0 X5 Y5")
    MARLIN["SHOW_TEMP_ADC_VALUES"]                       = true

/************************* COOLING FAN CONFIGURATION *************************/

    // Enabling FAN_SOFT_PWM because otherwise it seems like PWM control isn't
    // working on the controller fan.
    MARLIN["FAN_SOFT_PWM"]                               = true
    MARLIN["USE_CONTROLLER_FAN"]                         = true
    MARLIN["CONTROLLER_FAN_EDITABLE"]                    = true
    MARLIN["CONTROLLER_FAN_PIN"]                         = 5  // D5 PC25 FET_PWM2
    MARLIN["CONTROLLERFAN_SPEED_IDLE"]                   = 48
    MARLIN["CONTROLLERFAN_SPEED_MIN"]                    = 0
    MARLIN["CONTROLLER_FAN_IGNORE_Z"]                    = true
    MARLIN["DISABLE_IDLE_Z"]                             = false
    MARLIN["FAN0_PIN"]                                   = -1
    MARLIN["FAN1_PIN"]                                   = -1

/****************************** AXIS TRAVEL LIMITS ******************************/

    MARLIN["X_MIN_POS"]                                  = 0
    MARLIN["Y_MIN_POS"]                                  = 0
    MARLIN["Z_MAX_POS"]                                  = 150

    MARLIN["X_BED_SIZE"]                                 = 140
    MARLIN["Y_BED_SIZE"]                                 = 150

    MARLIN["NO_MOTION_BEFORE_HOMING"]                    = true

/************************** AUTOLEVELING / BED PROBE *************************/

    if(USE_AUTOLEVELING) {
        MARLIN["FIX_MOUNTED_PROBE"]                      = true
        MARLIN["NOZZLE_TO_PROBE_OFFSET"]                 = [0, 37.20, 0.5]
        MARLIN["Z_MIN_PROBE_REPEATABILITY_TEST"]         = true // EW - enabled
        MARLIN["MESH_TEST_HOTEND_TEMP"]                  = 32 // EW - changed to 32 (celsius) Default nozzle temperature for the G26 Mesh Validation Tool.
        MARLIN["AUTO_BED_LEVELING_BILINEAR"]             = true
        MARLIN["ABL_BILINEAR_SUBDIVISION"]               = true
        MARLIN["RESTORE_LEVELING_AFTER_G28"]             = true
        MARLIN["GRID_MAX_POINTS_X"]                      = 5
        MARLIN["GRID_MAX_POINTS_Y"]                      = 5
        MARLIN["PROBING_MARGIN"]                         = 0
        MARLIN["Z_CLEARANCE_DEPLOY_PROBE"]               = 5
        MARLIN["BED_LEVELING_COMMANDS"]                  = C_STRING("M117 Starting bed probe\nG28\nG29\nG27 P2\nM500\n")
        MARLIN["G26_MESH_VALIDATION"]                    = false
    }


/**************************** FILAMENT SETTINGS ***************************/

    MARLIN["RETRACT_LENGTH"]                             = 0 // EW - changed retract to 0

/***************************** MOTOR DRIVER TYPE *****************************/

    DRIVER_TYPE                                          = 'TMC2130'

    /* Workaround for E stepper not working on Archim 2.0
     *   https://github.com/MarlinFirmware/Marlin/issues/13040
     *
     * For the Archim, setting this to the default (0) for TRINAMICS causes
     * the E stepper not to advance when LIN_ADVANCE is enabled, so force
     * the stepper pulse to 1 to match the other drivers.
     */
    MARLIN["MINIMUM_STEPPER_PULSE"]                      = 1

    MARLIN["X_DRIVER_TYPE"]                              =  DRIVER_TYPE
    MARLIN["Y_DRIVER_TYPE"]                              =  DRIVER_TYPE
    MARLIN["Z_DRIVER_TYPE"]                              =  DRIVER_TYPE
    MARLIN["E0_DRIVER_TYPE"]                             =  DRIVER_TYPE

/*********************** TRINAMIC DRIVER CONFIGURATION ***********************/

    RSENSE                                           = 0.12

    MARLIN["TMC_DEBUG"]                              = true
    MARLIN["MONITOR_DRIVER_STATUS"]                  = true
    MARLIN["HOLD_MULTIPLIER"]                        = 0.5

    MARLIN["X_RSENSE"]                               = RSENSE
    MARLIN["Y_RSENSE"]                               = RSENSE
    MARLIN["Z_RSENSE"]                               = RSENSE
    MARLIN["E0_RSENSE"]                              = RSENSE

    MARLIN["TMC_USE_SW_SPI"]                         = true

    // Turn off stealthchop on Z as it seems to cause skipped steps
    MARLIN["STEALTHCHOP_Z"]                          = false

    /* If LIN_ADVANCE enabled, then disable STEALTHCHOP_E, because of the
     * following bug:
     *
     * https://github.com/MarlinFirmware/Marlin/issues/17944
     */
    if (ENABLED("LIN_ADVANCE")) {
        MARLIN["STEALTHCHOP_E"]                      = false
    }

/******************************* MOTOR CURRENTS ******************************/

    /* These values specify the maximum current, but actual
     * currents may be lower when used with COOLCONF
     */

    MARLIN["X_CURRENT"]                              = 975 // mA
    MARLIN["Y_CURRENT"]                              = 975 // mA
    MARLIN["Z_CURRENT"]                              = 600 // mA

/**************** ACCELERATION, FEEDRATES AND XYZ MOTOR STEPS ****************/

    MARLIN["DEFAULT_AXIS_STEPS_PER_UNIT"]                = [80, 80, 400, 400]
    /*
     * EW - 1600 for IGUS Z changed from default of 4000
     * Z-axis leadscrew https://www.amazon.com/Witbot-Pillow-Bearing-Coupler-Printer/dp/B074Z4Q23M/ref=sr_1_4?ie=UTF8&qid=1549046242&sr=8-4&keywords=lead%20screw
     */

    MARLIN["DEFAULT_MAX_FEEDRATE"]                       = [50, 50, 5, 20] // mm/s
    MARLIN["MANUAL_FEEDRATE"]                            = [50*60, 50*60, 5*60, 20*60]             // mm/min
    MARLIN["XY_PROBE_FEEDRATE"]                          = (50*60)                              // mm/min

    // A 32-bit board can handle more segments
    MARLIN["MIN_STEPS_PER_SEGMENT"]                      = 1

/********************************* LCD OPTIONS *********************************/

    // Slow down SPI speed when using unshielded ribbon cables.
    MARLIN["SD_SPI_SPEED"]                               = 'SPI_SIXTEENTH_SPEED'

    MARLIN["LCD_TIMEOUT_TO_STATUS"]                      = 600000 // Ten Minutes
    MARLIN["TOUCH_UI_VERSION"]                           = C_STRING('Version: 1.2 (\" __DATE__  \")');
    MARLIN["TOUCH_UI_FTDI_EVE"]                          = true
    MARLIN["TOUCH_UI_COCOA_THEME"]                       = true
    MARLIN["TOUCH_UI_COCOA_PRESS"]                       = true
    MARLIN["LCD_LULZBOT_CLCD_UI"]                        = true
    MARLIN["TOUCH_UI_800x480"]                           = true
    MARLIN["TOUCH_UI_USE_UTF8"]                          = true
    MARLIN["TOUCH_UI_UTF8_COPYRIGHT"]                    = true
    MARLIN["TOUCH_UI_UTF8_SUPERSCRIPTS"]                 = true
    MARLIN["TOUCH_UI_DEBUG"]                             = false
    MARLIN["TOUCH_UI_DEVELOPER_MENU"]                    = false

    MARLIN["TOUCH_UI_FTDI_EVE"]                          = true
    MARLIN["TOUCH_UI_USE_UTF8"]                          = true
    MARLIN["TOUCH_UI_UTF8_COPYRIGHT"]                    = true
    MARLIN["TOUCH_UI_UTF8_SUPERSCRIPTS"]                 = true
    MARLIN["SET_PROGRESS_MANUALLY"]                      = true
    MARLIN["PAUSE_REHEAT_FAST_RESUME"]                   = true
    MARLIN["NO_TIME_AFTER_SD_PRINT"]                     = true
    MARLIN["LCD_TIMEOUT_TO_STATUS"]                      = 0
    // Prevent truncation of filenames
    MARLIN["SCROLL_LONG_FILENAMES"]                      = true
    

    // Virtual joystick functionality
    MARLIN["JOYSTICK"]                                   = true
    MARLIN["JOY_X_PIN"]                                  = -1
    MARLIN["JOY_Y_PIN"]                                  = -1
    MARLIN["JOY_Z_PIN"]                                  = -1
    MARLIN["JOY_EN_PIN"]                                 = -1
    MARLIN["JOY_X_LIMITS"]                               = false
    MARLIN["JOY_Y_LIMITS"]                               = false
    MARLIN["JOY_Z_LIMITS"]                               = false

    if(!MARLIN["AO_EXP1_PINMAP"]) {
      MARLIN["ARCHIM2_SPI_FLASH_EEPROM_BACKUP_SIZE"]     = 1000
    }

    if (ENABLED("USB_FLASH_DRIVE_SUPPORT")) {
        MARLIN["SDSUPPORT"]                              = true
    }

    MARLIN["SHOW_CUSTOM_BOOTSCREEN"]                     = true
    MARLIN["BABYSTEPPING"]                               = true
    MARLIN["BABYSTEP_XY"]                                = false
    MARLIN["BABYSTEP_WITHOUT_HOMING"]                    = true
    MARLIN["BABYSTEP_ALWAYS_AVAILABLE"]                  = true
    MARLIN["BABYSTEP_ZPROBE_OFFSET"]                     = true

    if(USE_AUTOLEVELING) {
      MARLIN["BABYSTEP_HOTEND_Z_OFFSET"]                 = false
    }

/*********************************** CLEAN UP **********************************/

    return MARLIN
}
/***************************** END OF CONFIGURATION ****************************/

function do_substitions(config, counts, line) {
    /* Perform substitutions on a #define line from the config using the following regex:
     *
     *   ^(\s*)                 - Match indentation
     *   ((?:\/\/)?#define\s*)  - Match #define or //#define followed by whitespace
     *   (?<variable>\w+)       - Match variable name
     *   ((?:\(\))?\s*)         - Match optional () followed by whitespace
     *   ((?:(?!\s*\/\/).)*)    - Match remainder up to but not including // and preceeding whitespace
     *   (\s*\/\/.*)?           - Match the comment and preceeding whitespace
     */
    const m = line.match(/^(\s*)((?:\/\/)?#define\s*)(?<variable>\w+)((?:\(\))?\s*)((?:(?!\s*\/\/).)*)(\s*\/\/.*)?/);
    if (m && config.hasOwnProperty(m.groups.variable)) {
        let [match, indent, define, variable, separator, value, comment] = m;
        counts[variable] += 1;
        const new_val = config[variable];
        if (typeof new_val == 'boolean' && new_val == false) {
            if(!define.startsWith("//")) {
                define = "//" + define;
            }
        } else {
            define = define.replace("//","");
        }
        if (typeof new_val != 'boolean') {
            value = format_val(new_val);
        }
        const new_line = indent + define + variable + (separator || (value ? " " : "")) + (value || "");
        if (new_line + (comment || "") != line) {
          return new_line + (comment ? comment.replace("//", "// <-- changed:") : " // <-- changed")
        }
    }
    return line
}

async function dump_variables(config, out_filename) {
    // Dump all the variables in the config in sorted order
    const out = [];
    for(const key of Object.keys(config).sort()) {
        const val = config[key]
        if(typeof val == 'boolean') {
            out.push((val ? "" : "//") + "#define " + key)
        } else {
            out.push("#define " + key + " " + format_val(val))
        }
    }
    await fs.writeFile(out_filename, out.join("\n"));
}

async function process_config(config, counts, in_filename, out_filename) {
    // Perform substitutions on an entire file
    if (out_filename == in_filename) {
        // Handle special case of in-place substitutions
        fs.renameSync(in_filename, in_filename + ".saved")
        in_filename = in_filename + ".saved"
    }
    const out = (await fs.readFile(in_filename, 'utf-8'))
                .split(/\r?\n/)
                .map(line => do_substitions(config, counts, line))
                .join("\n");
    await fs.writeFile(out_filename, out);
}

async function process_dir(directory, input) {
    //if (!await fs.access(directory)) {
        await fs.mkdir(directory, {recursive: true})
    //}
    counts = init_counters(config)
    for (const i of input) {
        await process_config(config, counts, i, directory + "/" + path.basename(i))
    }
    dump_counters(config, counts)

    if (args.summary) {
        dump_variables(config, directory + "/Configuration_summary.txt")
    }
}

function init_counters(config) {
    counts = {}
    for(const k of Object.keys(config)) {
        counts[k] = 0
    }
    return counts
}

function dump_counters(config, counts) {
    for(const k of Object.keys(config)) {
        if (counts[k] == 0) {
            console.error("Warning:", k, "not found in any of the configuration files.")
        }
    }
}

function invalid_printer(str) {
    console.error(str + "\n\nPrinter must be one of:\n\n   " + PRINTER_CHOICES.join("\n   ") + "\n")
    process.exit()
}

function invalid_toolhead(str) {
    console.error(str + "\n\nToolhead must be one of:\n\n   " + TOOLHEAD_CHOICES.join("\n   ") + "\n")
    process.exit()
}

function match_selection(str, list) {
    withoutOptions = (str.replace("BLTouch","")
                         .replace("HallEffect","")
                         .replace("LCD","")
                         .replace("TouchSD","")
                         .replace("TouchUSB","")
                         .replace("USB","")
                         .replace("Einsy","")
                         .replace("Archim","")
                         .replace("BTT002",""))
    // Try an exact match
    if (list.includes(withoutOptions)) {
        return str;
    }
    // Do a fuzzy match
    let re = new RegExp(str, 'i');
    let matches = list.filter(x => x.search(re) != -1);
    if (matches.length > 1) {
        // Try narrowing down the choices
        re = new RegExp("(\\b|_)" + str + "(\\b|_)", 'i');
        const matches2 = list.filter(x => x.search(re) != -1);
        if (matches2.length > 0) {
            matches = matches2
        }
    }
    if (matches.length > 1) {
        console.log("Selection is ambiguous, must be one of:\n\n   " + matches.join("\n   ") + "\n")
        process.exit()
    }
    if (matches.length == 0) {
        console.log("Invalid selection, must be one of:\n\n   " + list.join("\n   ") + "\n")
        process.exit()
    }
    return matches[0]
}

function usage() {
    console.log("usage: node build-config.js [-h] [-D DIRECTORY] [-i INPUT] [-s] [printer] [toolhead]\n");
    console.log("This script modifies Marlin's \"Configuration.h\" and \"Configuration_adv.h\" for LulzBot printers.");
    console.log("   \n\n    Printer  Choices:\n      " + PRINTER_CHOICES.join("\n      "));
    console.log("   \n\n    Toolhead Choices:\n      " + TOOLHEAD_CHOICES.join("\n      "));
}

// Parse the command line arguments

const argv = process.argv.slice();
const args = {input:[]};
const node = argv.shift();
const js   = argv.shift();

if(argv.length == 0) {
    usage();
    process.exit()
}

while(argv.length) {
    const arg = argv.shift();
    switch(arg) {
        case '-D':
        case '--directory':
            args.directory = argv.shift();
            break;
        case '-i':
        case '--input':
            args.input.push(argv.shift());
            break;
        case '-s':
        case '--summary':
            args.summary = true;
            break;
        case '-h':
            usage();
            process.exit()
            break;
        default:
            if(!args.printer) args.printer = arg;
            else if(!args.toolhead) args.toolhead = arg;
    }
}

// Do the main processing

if (!args.printer) {
    invalid_printer("Must specify a printer type.")
}

if (!args.toolhead) {
    invalid_toolhead("Must specify a toolhead type.")
}

args.printer  = match_selection(args.printer,  PRINTER_CHOICES)
args.toolhead = match_selection(args.toolhead, TOOLHEAD_CHOICES)

if (args.input.length == 0) {
    args.input = [
        "../default/Configuration.h",
        "../default/Configuration_adv.h"
    ]
}

if (!args.directory) {
    args.directory = "."
}

config = make_config(args.printer, args.toolhead)

if (args.directory) {
    process_dir(args.directory, args.input)
}

