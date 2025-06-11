/* Portions (C) 2020, Marcio Teixeira
 * Portions (C) 2019, AlephObjects, Inc.
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
    // AlephObjects Printers
    "Gladiola_Mini",
    "Hibiscus_Mini2",
    "Guava_TAZ4",
    "Juniper_TAZ5",
    "Oliveoil_TAZ6",
    "Quiver_TAZPro",
    "Redgum_TAZWorkhorse",

    // SynDaver Printers
    "SynDaver_Axi",
    "SynDaver_Axi_2",
    "SynDaver_Level",
    "SynDaver_LevelUp",

    // Experimental Configurations
    "Experimental_TouchDemo",
    "Experimental_MiniEinsyLCD"
]

const TOOLHEAD_CHOICES = [
    "Buda_SingleExtruder",
    "Gladiola_SingleExtruder",
    "Albatross_Flexystruder",
    "Finch_Aerostruder",
    "CecropiaSilk_SingleExtruderAeroV2",
    "Goldenrod_HardenedExtruder",
    "AchemonSphinx_SmallLayer",
    "BandedTiger_HardenedSteel",
    "DingyCutworm_HardenedSteelPlus",
    "Tilapia_SingleExtruder",
    "Kanyu_Flexystruder",
    "Opah_Moarstruder",
    "Javelin_DualExtruderV2",
    "Longfin_FlexyDually",
    "Yellowfin_DualExtruderV3",
    "Angelfish_Aerostruder",
    "Quiver_DualExtruder",
    "KangarooPaw_SingleExtruder",
    "Lutefisk_M175",
    "H175_Hemera",
    "M175_Mosquito",
    "SynDaver_Level",
    "RTD_Pt1000Aero"
]

/************************** START OF CONFIGURATION **************************
 * Table of Contents:
 * ------------------
 *   1. PRINTER MODEL CHARACTERISTICS
 *   2. GENERAL CONFIGURATION
 *   3. EXPERIMENTAL FEATURES
 *   4. CUSTOMIZED VERSION STRING AND URL
 *   5. MOTHERBOARD AND PIN CONFIGURATION
 *   6. ENDSTOP CONFIGURATION
 *   7. HOMING & AXIS DIRECTIONS
 *   8. STEPPER INACTIVITY TIMEOUT
 *   9. COMMON TOOLHEADS PARAMETERS
 *  10. MINI TOOLHEADS
 *  11. TAZ 4/5/6 TOOLHEADS
 *  12. UNIVERSAL TOOLHEADS
 *  13. TAZ PRO TOOLHEADS
 *  14. OTHER TOOLHEADS
 *  15. TEMPERATURE SETTINGS
 *  16. HEATING ELEMENTS
 *  17. COOLING FAN CONFIGURATION
 *  18. AXIS TRAVEL LIMITS
 *  19. AUTOLEVELING / BED PROBE
 *  20. X AXIS LEVELING
 *  21. STARTUP COMMANDS
 *  22. AUTO-CALIBRATION (BACKLASH AND NOZZLE OFFSET)
 *  23. FILAMENT CONFIGURATION (LIN_ADVANCE/RUNOUT)
 *  24. MOTOR DRIVER TYPE
 *  25. TRINAMIC DRIVER CONFIGURATION
 *  26. TRINAMIC SENSORLESS HOMING
 *  27. ADVANCED PAUSE / FILAMENT CHANGE
 *  28. WIPER PAD
 *  29. CLEAN NOZZLE
 *  30. PROBE REWIPE
 *  30. BACKLASH COMPENSATION / INPUT SHAPING
 *  31. MOTOR CURRENTS
 *  32. ACCELERATION, FEEDRATES AND XYZ MOTOR STEPS
 *  33. LCD OPTIONS
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

    IS_TAZ                                               = false
    IS_MINI                                              = false
    TAZ_BED                                              = false
    MINI_BED                                             = false

    USE_EINSY_RAMBO                                      = false
    USE_EINSY_RETRO                                      =  PRINTER.includes("Einsy")
    USE_ARCHIM2                                          =  PRINTER.includes("Archim")
    USE_BTT_002                                          =  PRINTER.includes("BTT002")
    USE_TOUCH_UI                                         = (PRINTER.includes("TouchSD") ||
                                                            PRINTER.includes("TouchUSB"))
    MARLIN["USB_FLASH_DRIVE_SUPPORT"]                    =  PRINTER.includes("TouchUSB")
    USE_REPRAP_LCD_DISPLAY                               = (PRINTER.includes("LCD") ||
                                                            PRINTER.includes("Mini2") ||
                                                            PRINTER.includes("TAZ"))

    PROBE_STYLE                                          = "Conductive"

    USE_BED_LEVELING                                     = false
    USE_Z_BELT                                           = false
    USE_Z_SCREW                                          = false
    USE_NORMALLY_CLOSED_ENDSTOPS                         = false
    USE_NORMALLY_OPEN_ENDSTOPS                           = false
    USE_HOME_BUTTON                                      = false
    USE_CALIBRATION_CUBE                                 = false
    USE_DUAL_Z_ENDSTOPS                                  = false
    USE_DUAL_Z_STEPPERS                                  = false
    USE_TWO_PIECE_BED                                    = false
    USE_EXPERIMENTAL_FEATURES                            = false
    USE_MIN_ENDSTOPS                                     = false
    USE_MAX_ENDSTOPS                                     = false
    USE_PRE_GLADIOLA_G29_WORKAROUND                      = false
    USE_STATUS_LED                                       = false

    CALIBRATE_ON_WASHER                                  = false
    BED_WASHERS_PIN                                      = false

    MOTOR_CURRENT_XY                                     = 0

    ADAPTER_X_OFFSET                                     = 0
    ADAPTER_Y_OFFSET                                     = 0

    TOOLHEAD_X_MAX_ADJ                                   = 0
    TOOLHEAD_X_MIN_ADJ                                   = 0
    TOOLHEAD_Y_MAX_ADJ                                   = 0
    TOOLHEAD_Y_MIN_ADJ                                   = 0
    TOOLHEAD_Z_MAX_ADJ                                   = 0
    TOOLHEAD_Z_MIN_ADJ                                   = 0
    TOOLHEAD_LEFT_PROBE_ADJ                              = 0
    TOOLHEAD_RIGHT_PROBE_ADJ                             = 0
    TOOLHEAD_FRONT_PROBE_ADJ                             = 0
    TOOLHEAD_BACK_PROBE_ADJ                              = 0
    TOOLHEAD_WIPE_Y2_ADJ                                 = 0

    T1_OFFSET_X                                          = 0
    T1_OFFSET_Y                                          = 0
    T1_OFFSET_Z                                          = 0

    USE_LESS_MEMORY                                      = 0

    MARLIN["EXTRUDERS"]                                  = 1
    MARLIN["SDSUPPORT"]                                  = false
    MARLIN["SHOW_CUSTOM_BOOTSCREEN"]                     = true
    MARLIN["FILAMENT_RUNOUT_SENSOR"]                     = true
    MARLIN["G26_MESH_VALIDATION"]                        = true

    /* LulzBot uses a "G26" in start GCODE. As a workaround, do not allow
     * this GCODE to execute if the print timer is started.
     */
    if( PRINTER.includes("Mini") || PRINTER.includes("TAZ") ) {
        MARLIN["G26_IN_START_GCODE_WORKAROUND"]          = true
    }

    /* Use CLASSIC_JERK as the default since it seems JUNC_DEVIATION has issues
     *   https://github.com/MarlinFirmware/Marlin/issues/17342
     *   https://github.com/MarlinFirmware/Marlin/issues/17920
     */
    MARLIN["CLASSIC_JERK"]                               = true

    /* Disable THERMAL_PROTECTION_VARIANCE_MONITOR since it seems to be causing
     * frequent erros on the Archim
     */
    MARLIN["THERMAL_PROTECTION_VARIANCE_MONITOR"]        = false

/*********************** PRINTER MODEL CHARACTERISTICS ***********************/

    if (PRINTER.includes("Gladiola_Mini")) {
        IS_MINI                                          = true
        MINI_BED                                         = true
        USE_Z_SCREW                                      = true
        USE_BED_LEVELING                                 = true
        USE_NORMALLY_OPEN_ENDSTOPS                       = true
        USE_MIN_ENDSTOPS                                 = true
        USE_MAX_ENDSTOPS                                 = true
        USE_EXPERIMENTAL_FEATURES                        = true
        CALIBRATE_ON_WASHER                              = "Back Right"
        MARLIN["CUSTOM_MACHINE_NAME"]                    = C_STRING("Mini")
        MARLIN["BACKLASH_COMPENSATION"]                  = true
        MARLIN["BAUDRATE"]                               = 250000
        MARLIN["MACHINE_UUID"]                           = C_STRING("351487b6-ca9a-4c1a-8765-d668b1da6585")
        if (USE_EINSY_RETRO || USE_BTT_002) {
            MARLIN["STEALTHCHOP_XY"]                     = false
            MARLIN["STEALTHCHOP_Z"]                      = false
            MARLIN["STEALTHCHOP_E"]                      = true
            MARLIN["HYBRID_THRESHOLD"]                   = false
            if (!USE_BTT_002) {
                MARLIN["PRINTCOUNTER"]                   = true
            }
        } else {
            MARLIN["ENDSTOPS_ALWAYS_ON_DEFAULT"]         = true
        }
        if (!USE_TOUCH_UI) {
            if (USE_REPRAP_LCD_DISPLAY) {
                MARLIN["LIGHTWEIGHT_UI"]                 = USE_EINSY_RETRO || USE_BTT_002
                USE_LESS_MEMORY                          = 1
            } else {
                MARLIN["FILAMENT_RUNOUT_SENSOR"]         = false
            }
        } else {
            // Enable the touchscreen and USB on EXP2
            USE_LESS_MEMORY                              = 1
            USE_REPRAP_LCD_DISPLAY                       = false
            MARLIN["TOUCH_UI_PORTRAIT"]                  = true
            MARLIN["TOUCH_UI_480x272"]                   = true
            MARLIN["LCD_LULZBOT_CLCD_UI"]                = true
            MARLIN["AO_EXP2_PINMAP"]                     = true
            MARLIN["SDSUPPORT"]                          = true
            if (ENABLED("USB_FLASH_DRIVE_SUPPORT")) {
                MARLIN["USE_UHS3_USB"]                   = true
            }
        }
    }

    if (PRINTER.includes("Guava_TAZ4")) {
        IS_TAZ                                           = true
        TAZ_BED                                          = true
        USE_Z_SCREW                                      = true
        USE_NORMALLY_OPEN_ENDSTOPS                       = true
        USE_MIN_ENDSTOPS                                 = true
        USE_EXPERIMENTAL_FEATURES                        = true
        PROBE_STYLE                                      = "None"
        MARLIN["CUSTOM_MACHINE_NAME"]                    = C_STRING("TAZ 4")
        if (USE_ARCHIM2) {
            // Must use 12 character USB product name to prevent board lockups
            MARLIN["USB_DEVICE_PRODUCT_NAME"]            = C_STRING("TAZ 4       ")
        }
        MARLIN["BACKLASH_COMPENSATION"]                  = true
        MARLIN["BAUDRATE"]                               = 250000
        MARLIN["MACHINE_UUID"]                           = C_STRING("c3255c96-4097-4884-8ed0-ded2ff9bae61")
        MARLIN["SDSUPPORT"]                              = true
        if (USE_ARCHIM2) {
            MARLIN["STEALTHCHOP_XY"]                     = false
            MARLIN["STEALTHCHOP_Z"]                      = true
            MARLIN["STEALTHCHOP_E"]                      = true
        }
    }

    if (PRINTER.includes("Juniper_TAZ5")) {
        IS_TAZ                                           = true
        TAZ_BED                                          = true
        USE_Z_SCREW                                      = true
        USE_NORMALLY_OPEN_ENDSTOPS                       = true
        USE_MIN_ENDSTOPS                                 = true
        USE_EXPERIMENTAL_FEATURES                        = true
        PROBE_STYLE                                      = "None"
        MARLIN["CUSTOM_MACHINE_NAME"]                    = C_STRING("TAZ 5")
        if (USE_ARCHIM2) {
            // Must use 12 character USB product name to prevent board lockups
            MARLIN["USB_DEVICE_PRODUCT_NAME"]            = C_STRING("TAZ 5       ")
        }
        MARLIN["BACKLASH_COMPENSATION"]                  = true
        MARLIN["BAUDRATE"]                               = 250000
        MARLIN["MACHINE_UUID"]                           = C_STRING("c3255c96-4097-4884-8ed0-ded2ff9bae61")
        MARLIN["SDSUPPORT"]                              = true
        if (USE_ARCHIM2) {
            MARLIN["STEALTHCHOP_XY"]                     = false
            MARLIN["STEALTHCHOP_Z"]                      = false
            MARLIN["STEALTHCHOP_E"]                      = true
        }
    }

    if (PRINTER.includes("Oliveoil_TAZ6")) {
        IS_TAZ                                           = true
        TAZ_BED                                          = true
        USE_Z_SCREW                                      = true
        USE_BED_LEVELING                                 = true
        USE_NORMALLY_CLOSED_ENDSTOPS                     = true
        USE_MIN_ENDSTOPS                                 = true
        USE_MAX_ENDSTOPS                                 = true
        USE_HOME_BUTTON                                  = !PRINTER.includes("BLTouch")
        MARLIN["CUSTOM_MACHINE_NAME"]                    = C_STRING("TAZ 6")
        if (USE_ARCHIM2) {
            // Must use 12 character USB product name to prevent board lockups
            MARLIN["USB_DEVICE_PRODUCT_NAME"]            = C_STRING("TAZ 6       ")
        }
        MARLIN["BACKLASH_COMPENSATION"]                  = true
        MARLIN["ENDSTOPS_ALWAYS_ON_DEFAULT"]             = true
        MARLIN["BAUDRATE"]                               = 250000
        MARLIN["PRINTCOUNTER"]                           = true
        MARLIN["MACHINE_UUID"]                           = C_STRING("845f003c-aebd-4e53-a6b9-7d0984fde609")
        MARLIN["SDSUPPORT"]                              = true
        /* Specify pin for bed washers. If commented out,
         * bed washers will use Z_MIN pin (i.e. bed washers
         * and homing button wired together)
         */
        BED_WASHERS_PIN                                  = 'SERVO0_PIN'
        USE_EXPERIMENTAL_FEATURES                        = true
        if (USE_ARCHIM2) {
            MARLIN["STEALTHCHOP_XY"]                     = false
            MARLIN["STEALTHCHOP_Z"]                      = false
            MARLIN["STEALTHCHOP_E"]                      = true
            MARLIN["HYBRID_THRESHOLD"]                   = false
        }
    }

    if (PRINTER.includes("Hibiscus_Mini2")) {
        IS_MINI                                          = true
        MINI_BED                                         = true
        USE_TWO_PIECE_BED                                = true
        USE_Z_BELT                                       = true
        USE_BED_LEVELING                                 = true
        USE_NORMALLY_CLOSED_ENDSTOPS                     = true
        USE_EINSY_RETRO                                  = true
        USE_EXPERIMENTAL_FEATURES                        = true
        CALIBRATE_ON_WASHER                              = "Back Right"
        MARLIN["CUSTOM_MACHINE_NAME"]                    = C_STRING("Mini 2")
        MARLIN["BACKLASH_COMPENSATION"]                  = true
        MARLIN["SENSORLESS_HOMING"]                      = true
        MARLIN["STEALTHCHOP_XY"]                         = false
        MARLIN["STEALTHCHOP_Z"]                          = true
        MARLIN["STEALTHCHOP_E"]                          = true
        MARLIN["HYBRID_THRESHOLD"]                       = true
        MARLIN["BAUDRATE"]                               = 250000
        MARLIN["PRINTCOUNTER"]                           = true
        MARLIN["MACHINE_UUID"]                           = C_STRING("e5502411-d46d-421d-ba3a-a20126d7930f")
        if (!USE_TOUCH_UI) {
            MARLIN["LIGHTWEIGHT_UI"]                     = true
            USE_LESS_MEMORY                              = 2
        } else {
            USE_REPRAP_LCD_DISPLAY                       = false
            USE_LESS_MEMORY                              = 1
            MARLIN["TOUCH_UI_PORTRAIT"]                  = true
            MARLIN["TOUCH_UI_480x272"]                   = true
            MARLIN["LCD_LULZBOT_CLCD_UI"]                = true
            MARLIN["AO_EXP1_PINMAP"]                     = true
            MARLIN["SDSUPPORT"]                          = true
            if (ENABLED("USB_FLASH_DRIVE_SUPPORT")) {
                MARLIN["USE_UHS3_USB"]                   = true
            }
        }
    }

    if (PRINTER.includes("Quiver_TAZPro")) {
        IS_TAZ                                           = true
        TAZ_BED                                          = true
        USE_TWO_PIECE_BED                                = true
        USE_Z_BELT                                       = true
        USE_BED_LEVELING                                 = true
        USE_CALIBRATION_CUBE                             = true
        USE_NORMALLY_CLOSED_ENDSTOPS                     = true
        USE_DUAL_Z_ENDSTOPS                              = true
        USE_TOUCH_UI                                     = true
        USE_REPRAP_LCD_DISPLAY                           = false
        USE_ARCHIM2                                      = true
        USE_EXPERIMENTAL_FEATURES                        = true
        MARLIN["CUSTOM_MACHINE_NAME"]                    = C_STRING("TAZ Pro")
        MARLIN["USB_DEVICE_PRODUCT_NAME"]                = C_STRING("TAZ Pro     ")
        MARLIN["BACKLASH_COMPENSATION"]                  = true
        MARLIN["SENSORLESS_HOMING"]                      = true
        MARLIN["STEALTHCHOP_XY"]                         = false
        MARLIN["STEALTHCHOP_Z"]                          = true
        MARLIN["STEALTHCHOP_E"]                          = true
        MARLIN["HYBRID_THRESHOLD"]                       = true
        MARLIN["BAUDRATE"]                               = 250000
        MARLIN["PRINTCOUNTER"]                           = true
        MARLIN["MACHINE_UUID"]                           = C_STRING("a952577d-8722-483a-999d-acdc9e772b7b")
        MARLIN["USB_FLASH_DRIVE_SUPPORT"]                = true
        MARLIN["SDSUPPORT"]                              = true
        MARLIN["FILAMENT_MOTION_SENSOR"]                 = true
        MARLIN["USE_UHS3_USB"]                           = false
        MARLIN["ARCHIM2_SPI_FLASH_EEPROM_BACKUP_SIZE"]   = 1000
        // Touch LCD configuration
        MARLIN["TOUCH_UI_PORTRAIT"]                      = true
        MARLIN["TOUCH_UI_800x480"]                       = true
        MARLIN["LCD_LULZBOT_CLCD_UI"]                    = true
        MARLIN["AO_EXP2_PINMAP"]                         = true
    }

    if (PRINTER.includes("Redgum_TAZWorkhorse")) {
        IS_TAZ                                           = true
        TAZ_BED                                          = true
        USE_TWO_PIECE_BED                                = true
        USE_Z_BELT                                       = true
        USE_BED_LEVELING                                 = true
        USE_CALIBRATION_CUBE                             = true
        USE_NORMALLY_CLOSED_ENDSTOPS                     = true
        USE_MIN_ENDSTOPS                                 = true
        USE_DUAL_Z_ENDSTOPS                              = true
        USE_EXPERIMENTAL_FEATURES                        = true
        MARLIN["CUSTOM_MACHINE_NAME"]                    = C_STRING("TAZ Workhorse Edition")
        if (USE_ARCHIM2) {
            // Must use 12 character USB product name to prevent board lockups
            MARLIN["USB_DEVICE_PRODUCT_NAME"]            = C_STRING("TAZWorkhorse")
        }
        MARLIN["BACKLASH_COMPENSATION"]                  = true
        MARLIN["BAUDRATE"]                               = 250000
        MARLIN["PRINTCOUNTER"]                           = true
        MARLIN["MACHINE_UUID"]                           = C_STRING("5ee798fb-4062-4d35-8224-5e846ffb45a5")
        MARLIN["SDSUPPORT"]                              = true
        if (USE_TOUCH_UI) {
            USE_REPRAP_LCD_DISPLAY                       = false
            MARLIN["USB_FLASH_DRIVE_SUPPORT"]            = true
            MARLIN["USE_UHS3_USB"]                       = false
            MARLIN["ARCHIM2_SPI_FLASH_EEPROM_BACKUP_SIZE"] = 1000
            // Touch LCD configuration
            MARLIN["TOUCH_UI_PORTRAIT"]                  = true
            MARLIN["TOUCH_UI_800x480"]                   = true
            MARLIN["LCD_LULZBOT_CLCD_UI"]                = true
            MARLIN["AO_EXP2_PINMAP"]                     = true
        } else {
            // The LIGHTWEIGHT_UI is not currently compatible with 32-bit boards.
            if (USE_ARCHIM2) {
                MARLIN["LIGHTWEIGHT_UI"]                 = false
            } else {
                MARLIN["LIGHTWEIGHT_UI"]                 = true
            }
        }
    }

    if (PRINTER.includes("SynDaver_Axi")) {
        IS_TAZ                                           = true
        TAZ_BED                                          = true
        USE_TWO_PIECE_BED                                = true
        USE_Z_BELT                                       = true
        USE_BED_LEVELING                                 = true
        USE_CALIBRATION_CUBE                             = true
        USE_NORMALLY_CLOSED_ENDSTOPS                     = true
        USE_MIN_ENDSTOPS                                 = true
        USE_DUAL_Z_ENDSTOPS                              = true
        USE_TOUCH_UI                                     = true
        USE_REPRAP_LCD_DISPLAY                           = false
        USE_ARCHIM2                                      = true
        PROBE_STYLE                                      = "BLTouch"
        MARLIN["SHOW_CUSTOM_BOOTSCREEN"]                 = false
        MARLIN["BACKLASH_COMPENSATION"]                  = true
        MARLIN["ENDSTOP_INTERRUPTS_FEATURE"]             = true
        MARLIN["SENSORLESS_HOMING"]                      = false
        MARLIN["STEALTHCHOP_XY"]                         = false
        MARLIN["STEALTHCHOP_E"]                          = true
        MARLIN["BAUDRATE"]                               = 250000
        MARLIN["PRINTCOUNTER"]                           = true
        MARLIN["MACHINE_UUID"]                           = C_STRING("a952577d-8722-483a-999d-acdc9e772b7b")
        MARLIN["USB_FLASH_DRIVE_SUPPORT"]                = true
        MARLIN["SDSUPPORT"]                              = true
        USE_DUAL_Z_STEPPERS                              = true
        if (PRINTER.includes("SynDaver_Axi_2")) {
            MARLIN["CUSTOM_MACHINE_NAME"]                = C_STRING("SynDaver Axi 2")
            // Must use 12 character USB product name to prevent board lockups
            MARLIN["USB_DEVICE_PRODUCT_NAME"]            = C_STRING("SynDaverAxi2")
            MARLIN["SHORT_BUILD_VERSION"]                = '\"2.x.x (\" GIT_HASH \")\"'
            MARLIN["TOUCH_UI_VERSION"]                   = '\"Release: 3 (\" __DATE__  \")\\nMarlin \" SHORT_BUILD_VERSION'
            MARLIN["USE_ELECTROMAGNETIC_BRAKE"]          = true
            MARLIN["CASE_LIGHT_ENABLE"]                  = true
            MARLIN["STEALTHCHOP_Z"]                      = false
            MARLIN["HYBRID_THRESHOLD"]                   = false
        } else {
            MARLIN["CUSTOM_MACHINE_NAME"]                = C_STRING("SynDaver Axi")
            // Must use 12 character USB product name to prevent board lockups
            MARLIN["USB_DEVICE_PRODUCT_NAME"]            = C_STRING("SynDaver Axi")
            MARLIN["SHORT_BUILD_VERSION"]                = '\"2.x.x (\" GIT_HASH \")\"'
            MARLIN["TOUCH_UI_VERSION"]                   = '\"Release: 7 (\" __DATE__  \")\\nMarlin \" SHORT_BUILD_VERSION'
            MARLIN["Z2_PRESENCE_CHECK"]                  = true
            MARLIN["STEALTHCHOP_Z"]                      = true
            MARLIN["HYBRID_THRESHOLD"]                   = true
        }
        MARLIN["USE_UHS3_USB"]                           = false
        MARLIN["ARCHIM2_SPI_FLASH_EEPROM_BACKUP_SIZE"]   = 1000
        MARLIN["EMI_MITIGATION"]                         = true
        // Touch LCD configuration
        MARLIN["TOUCH_UI_PORTRAIT"]                      = true
        MARLIN["TOUCH_UI_NO_BOOTSCREEN"]                 = true
        MARLIN["TOUCH_UI_800x480"]                       = true
        MARLIN["LCD_LULZBOT_CLCD_UI"]                    = true
        MARLIN["TOUCH_UI_ROYAL_THEME"]                   = true
        MARLIN["AO_EXP2_PINMAP"]                         = true
        // Put filament sensor on X_MAX
        MARLIN["USE_YMAX_PLUG"]                          = false
        MARLIN["FIL_RUNOUT_PIN"]                         = 15 // Archim2 Y-Max
    }

    // Unsupported or unreleased experimental configurations. Use at your own risk.

    if (PRINTER.includes("SynDaver_Level")) {
        IS_MINI                                          = true
        MINI_BED                                         = true
        USE_TWO_PIECE_BED                                = true
        USE_Z_SCREW                                      = true
        USE_BED_LEVELING                                 = true
        USE_NORMALLY_CLOSED_ENDSTOPS                     = true
        USE_MIN_ENDSTOPS                                 = true
        USE_TOUCH_UI                                     = true
        USE_REPRAP_LCD_DISPLAY                           = false
        USE_ARCHIM2                                      = true
        MARLIN["TOUCH_UI_SYNDAVER_LEVEL"]                = true
        MARLIN["TOUCH_UI_SYNDAVER_LEVELUP"]              = PRINTER.includes("SynDaver_LevelUp")
        MARLIN["SHOW_CUSTOM_BOOTSCREEN"]                 = false
        MARLIN["BACKLASH_COMPENSATION"]                  = false
        MARLIN["ENDSTOP_INTERRUPTS_FEATURE"]             = true
        MARLIN["SENSORLESS_HOMING"]                      = false
        MARLIN["STEALTHCHOP_XY"]                         = false
        MARLIN["STEALTHCHOP_Z"]                          = false
        MARLIN["STEALTHCHOP_E"]                          = true
        MARLIN["BAUDRATE"]                               = 250000
        MARLIN["PRINTCOUNTER"]                           = true
        MARLIN["MACHINE_UUID"]                           = C_STRING("a952577d-8722-483a-999d-acdc9e772b7b")
        MARLIN["USB_FLASH_DRIVE_SUPPORT"]                = true
        MARLIN["CASE_LIGHT_ENABLE"]                      = true
        MARLIN["SDSUPPORT"]                              = true
        MARLIN["DEFAULT_LEVELING_FADE_HEIGHT"]           = 180
        if (PRINTER.includes("SynDaver_LevelUp")) {
            PROBE_STYLE                                  = "Inductive"
            MARLIN["CUSTOM_MACHINE_NAME"]                = C_STRING("SynDaver LeveL UP")
            // Must use 12 character USB product name to prevent board lockups
            MARLIN["USB_DEVICE_PRODUCT_NAME"]            = C_STRING("SynDaverLvlU")
            MARLIN["SHORT_BUILD_VERSION"]                = '\"2.x.x (\" GIT_HASH \")\"'
            MARLIN["TOUCH_UI_VERSION"]                   = '\"Release: 2 (\" __DATE__  \")\\nMarlin \" SHORT_BUILD_VERSION'
        } else {
            PROBE_STYLE                                  = "Manual"
            MARLIN["CUSTOM_MACHINE_NAME"]                = C_STRING("SynDaver LeveL")
            // Must use 12 character USB product name to prevent board lockups
            MARLIN["USB_DEVICE_PRODUCT_NAME"]            = C_STRING("SynDaver Lvl")
            MARLIN["SHORT_BUILD_VERSION"]                = '\"2.x.x (\" GIT_HASH \")\"'
            MARLIN["TOUCH_UI_VERSION"]                   = '\"Release: 6 (\" __DATE__  \")\\nMarlin \" SHORT_BUILD_VERSION'
        }
        MARLIN["USE_UHS3_USB"]                           = false
        MARLIN["ARCHIM2_SPI_FLASH_EEPROM_BACKUP_SIZE"]   = 1000
        MARLIN["EMI_MITIGATION"]                         = true
        // Touch LCD configuration
        MARLIN["TOUCH_UI_DEBUG"]                         = false
        MARLIN["TOUCH_UI_PORTRAIT"]                      = false
        MARLIN["TOUCH_UI_NO_BOOTSCREEN"]                 = true
        MARLIN["TOUCH_UI_480x272"]                       = true
        MARLIN["LCD_LULZBOT_CLCD_UI"]                    = true
        MARLIN["TOUCH_UI_ROYAL_THEME"]                   = true
        MARLIN["AO_EXP2_PINMAP"]                         = true
        // Put filament sensor on Y_MIN
        MARLIN["USE_YMIN_PLUG"]                          = false
        MARLIN["FIL_RUNOUT_PIN"]                         = 29 // Archim2 Y-Min
    }

    if (PRINTER.includes("Experimental_TouchDemo")) {
        // Test stand with Einsy Rambo and LulzBot Touch LCD
        IS_MINI                                          = true
        MINI_BED                                         = true
        USE_Z_SCREW                                      = true
        USE_BED_LEVELING                                 = true
        USE_NORMALLY_OPEN_ENDSTOPS                       = true
        USE_MIN_ENDSTOPS                                 = true
        USE_MAX_ENDSTOPS                                 = true
        USE_TOUCH_UI                                     = true
        USE_REPRAP_LCD_DISPLAY                           = false
        USE_EINSY_RAMBO                                  = true
        USE_EXPERIMENTAL_FEATURES                        = true
        CALIBRATE_ON_WASHER                              = "Back Right"
        MARLIN["BACKLASH_COMPENSATION"]                  = true
        MARLIN["FILAMENT_RUNOUT_SENSOR"]                 = false
        MARLIN["BAUDRATE"]                               = 250000
        MARLIN["PRINTCOUNTER"]                           = true
        MARLIN["MACHINE_UUID"]                           = C_STRING("23421dc0-df9f-430b-8f91-0e3bcb55b4e4")
        // Since we are using EinsyRetro 1.1a, use EXP1 for touch panel
        MARLIN["LCD_LULZBOT_CLCD_UI"]                    = true
        MARLIN["AO_EXP2_PINMAP"]                         = true
        MARLIN["TOUCH_UI_PORTRAIT"]                      = true
        MARLIN["TOUCH_UI_INVERTED"]                      = true
        MARLIN["TOUCH_UI_800x480"]                       = true
        MARLIN["TOUCH_UI_DEBUG"]                         = true
        MARLIN["TOUCH_UI_NO_BOOTSCREEN"]                 = true
        /* SD or USB will only work on EXP2, but a 5
         * pigtail to an endstop connector is needed
         * since EXP2 does not have 5V on pin 1
         */
        MARLIN["SDSUPPORT"]                              = false
        MARLIN["USB_FLASH_DRIVE_SUPPORT"]                = false
    }

    if (PRINTER.includes("Experimental_MiniEinsyLCD")) {
        // Marcio's Custom Gladiola
        IS_MINI                                          = true
        MINI_BED                                         = true
        USE_Z_SCREW                                      = true
        USE_BED_LEVELING                                 = true
        USE_NORMALLY_OPEN_ENDSTOPS                       = true
        USE_MIN_ENDSTOPS                                 = true
        USE_MAX_ENDSTOPS                                 = false
        USE_EINSY_RETRO                                  = true
        USE_EXPERIMENTAL_FEATURES                        = true
        CALIBRATE_ON_WASHER                              = "Back Right"
        MARLIN["CUSTOM_MACHINE_NAME"]                    = C_STRING("Mini")
        MARLIN["BACKLASH_COMPENSATION"]                  = true
        MARLIN["STEALTHCHOP_XY"]                         = false
        MARLIN["STEALTHCHOP_Z"]                          = false
        MARLIN["STEALTHCHOP_E"]                          = true
        MARLIN["HYBRID_THRESHOLD"]                       = false
        MARLIN["BAUDRATE"]                               = 250000
        MARLIN["PRINTCOUNTER"]                           = true
        MARLIN["MACHINE_UUID"]                           = C_STRING("b68ff322-3328-4543-bd93-bb8d8eb0c891")
        MARLIN["LIGHTWEIGHT_UI"]                         = true
        // Put filament sensor on Y_MIN
        MARLIN["USE_YMIN_PLUG"]                          = false
        MARLIN["FIL_RUNOUT_PIN"]                         = 11 // Einsy Rambo Y-Min
    }

/********************************* OVERRIDES *********************************/

    if (PRINTER.includes("BLTouch")) {
        PROBE_STYLE                                      = "BLTouch"
        USE_BED_LEVELING                                 = true
        USE_HOME_BUTTON                                  = false
    }

    if (PRINTER.includes("Inductive")) {
        PROBE_STYLE                                      = "Inductive"
        USE_BED_LEVELING                                 = true
        USE_HOME_BUTTON                                  = false
    }

    if (PRINTER.includes("HallEffect")) {
        MARLIN["FILAMENT_MOTION_SENSOR"]                 = true
    }

    if (IS_TAZ && !USE_ARCHIM2 && ["BLTouch", "Inductive"].includes(PROBE_STYLE)) {
        USE_LESS_MEMORY                                  = 2
    }

/*************************** GENERAL CONFIGURATION ***************************/

    MARLIN["STRING_CONFIG_H_AUTHOR"]                     = C_STRING("(Drunken Octopus Marlin)")
    MARLIN["SOURCE_CODE_URL"]                            = C_STRING("https://github.com/marciot/drunken-octopus-marlin")
    MARLIN["EEPROM_SETTINGS"]                            = true
    MARLIN["EEPROM_AUTO_INIT"]                           = true
    MARLIN["EMERGENCY_PARSER"]                           = USE_BTT_002 ? false : true
    MARLIN["PAUSE_PARK_NOZZLE_TIMEOUT"]                  = 300
    MARLIN["ADVANCED_OK"]                                = true
    MARLIN["TX_BUFFER_SIZE"]                             = 32
    MARLIN["BUFSIZE"]                                    = 5
    MARLIN["PRINTJOB_TIMER_AUTOSTART"]                   = false
    MARLIN["HOST_ACTION_COMMANDS"]                       = true

    /* Marlin 1.1.4 changed G92 to adjust software endstops, making
     * it less useful for adjusting the position after hitting an
     * endstop. It is useful for custom printers and is required for
     * Yellowfin. NO_WORKSPACE_OFFSETS restores the old behavior
     */
    MARLIN["NO_WORKSPACE_OFFSETS"]                       = true

/*************************** EXPERIMENTAL FEATURES ***************************/

    if (USE_EXPERIMENTAL_FEATURES) {
        MARLIN["GCODE_MACROS"]                           = true
        //MARLIN["S_CURVE_ACCELERATION"]                   = true
    }

    if (USE_STATUS_LED) {
        MARLIN["NEOPIXEL_LED"]                           = true
        MARLIN["NEOPIXEL_PIN"]                           = 32    // X_MAX_PIN
        MARLIN["NEOPIXEL_PIXELS"]                        = 8
        MARLIN["USE_XMAX_PLUG"]                          = false
    }

/********************* MOTHERBOARD AND PIN CONFIGURATION *********************/

    if (USE_ARCHIM2) {
        MARLIN["MOTHERBOARD"]                            = 'BOARD_ARCHIM2'
        MARLIN["SERIAL_PORT"]                            = -1
        if (USE_REPRAP_LCD_DISPLAY || PRINTER.includes("SynDaver_")) {
            MARLIN["SERIAL_PORT_2"]                      = 0
        }
        MARLIN["SD_SPI_SPEED"]                           = 'SPI_SIXTEENTH_SPEED'
        MARLIN["M997_ARCHIM_BOOTLOADER"]                 = true

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

    } else if (USE_EINSY_RETRO) {
        MARLIN["MOTHERBOARD"]                            = 'BOARD_EINSY_RETRO'
        MARLIN["CONTROLLER_FAN_PIN"]                     = 'FAN1_PIN' // Digital pin 6
        MARLIN["SERIAL_PORT"]                            = 0
        MARLIN["SERVO0_PIN"]                             = 76
        MARLIN["FIL_RUNOUT_PIN"]                         = 62
        if (USE_REPRAP_LCD_DISPLAY) {
            MARLIN["SERIAL_PORT_2"]                      = 2
        }
        if (USE_TOUCH_UI) {
            MARLIN["SD_SPI_SPEED"]                       = 'SPI_SIXTEENTH_SPEED'
        } else {
            MARLIN["SD_SPI_SPEED"]                       = 'SPI_FULL_SPEED'
        }

    } else if (USE_EINSY_RAMBO) {
        MARLIN["MOTHERBOARD"]                            = 'BOARD_EINSY_RAMBO'
        MARLIN["CONTROLLER_FAN_PIN"]                     = 'FAN1_PIN' // Digital pin 6
        MARLIN["SERIAL_PORT"]                            = 0
        if (USE_TOUCH_UI) {
            MARLIN["SD_SPI_SPEED"]                       = 'SPI_SIXTEENTH_SPEED'
        } else {
            MARLIN["SD_SPI_SPEED"]                       = 'SPI_FULL_SPEED'
        }

    } else if (USE_BTT_002) {
        MARLIN["MOTHERBOARD"]                            = 'BOARD_BTT_BTT002_V1_0'
        MARLIN["CONTROLLER_FAN_PIN"]                     = 'FAN1_PIN'
        MARLIN["SERIAL_PORT"]                            = -1
        MARLIN["SERIAL_PORT_2"]                          =  3
        MARLIN["SERVO0_PIN"]                             = 'PC12'
        MARLIN["ENDSTOP_INTERRUPTS_FEATURE"]             = true
        if (PROBE_STYLE == "BLTouch") {
            MARLIN["Z_MAX_PIN"]                          = 'PD4' // Use AC-FAULT connector
        } else {
            MARLIN["Z_STOP_PIN"]                         = 'PD4' // Use AC-FAULT connector
        }
        MARLIN["SD_SPI_SPEED"]                           = 'SPI_FULL_SPEED'

    } else if (IS_MINI) {
        MARLIN["MOTHERBOARD"]                            = 'BOARD_MINIRAMBO'
        MARLIN["CONTROLLER_FAN_PIN"]                     = 'FAN1_PIN' // Digital pin 6
        MARLIN["SERIAL_PORT"]                            = 0
        MARLIN["SERVO0_PIN"]                             = 20
        MARLIN["FIL_RUNOUT_PIN"]                         = 84
        if (USE_REPRAP_LCD_DISPLAY) {
            MARLIN["SERIAL_PORT_2"]                      = 2
        }
        MARLIN["SD_SPI_SPEED"]                           = 'SPI_FULL_SPEED'

    } else if (IS_TAZ) {
        MARLIN["MOTHERBOARD"]                            = 'BOARD_RAMBO'
        MARLIN["CONTROLLER_FAN_PIN"]                     = 'FAN2_PIN' // Digital pin 2
        MARLIN["SERIAL_PORT"]                            = 0
        if (USE_REPRAP_LCD_DISPLAY) {
            MARLIN["SERIAL_PORT_2"]                      = 1
            USE_LESS_MEMORY                              = Math.max(1,USE_LESS_MEMORY)
        }
        MARLIN["SD_SPI_SPEED"]                           = 'SPI_FULL_SPEED'
    }

    if (ENABLED("USB_FLASH_DRIVE_SUPPORT")) {
        MARLIN["USB_INTR_PIN"]                           = 'SD_DETECT_PIN'
    }

/*************************** ENDSTOP CONFIGURATION ***************************/

    // Whether endstops are inverting
    NORMALLY_CLOSED_ENDSTOP                              = "HIGH"
    NORMALLY_OPEN_ENDSTOP                                = "LOW"

    if (USE_EINSY_RAMBO || USE_BTT_002) {
        MARLIN["Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN"]     = false
    }
    else if (BED_WASHERS_PIN && !["BLTouch", "Inductive"].includes(PROBE_STYLE)) {
        MARLIN["Z_MIN_PROBE_PIN"]                        = BED_WASHERS_PIN
        MARLIN["Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN"]     = false
    }
    else {
        // The Mini and TAZ Pro lack a home button and probe using the Z_MIN pin.
        MARLIN["Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN"]     = true
    }

    if (PRINTER.includes("SynDaver_Level")) {
        MARLIN["USE_XMIN_PLUG"]                              = true
        MARLIN["USE_YMIN_PLUG"]                              = false
        MARLIN["USE_ZMIN_PLUG"]                              = true

        MARLIN["USE_XMAX_PLUG"]                              = false
        MARLIN["USE_YMAX_PLUG"]                              = true
        MARLIN["USE_ZMAX_PLUG"]                              = true
    }
    else if (USE_BTT_002 && IS_MINI) {
        MARLIN["USE_XMIN_PLUG"]                              = true
        MARLIN["USE_YMIN_PLUG"]                              = false
        MARLIN["USE_ZMIN_PLUG"]                              = false

        MARLIN["USE_YMAX_PLUG"]                              = false
        MARLIN["USE_YMAX_PLUG"]                              = true
        MARLIN["USE_ZMAX_PLUG"]                              = true
    } else {
        MARLIN["USE_XMIN_PLUG"]                              = USE_MIN_ENDSTOPS
        MARLIN["USE_YMIN_PLUG"]                              = USE_MIN_ENDSTOPS
        MARLIN["USE_ZMIN_PLUG"]                              = USE_MIN_ENDSTOPS || MARLIN["Z_MIN_PROBE_USES_Z_MIN_ENDSTOP_PIN"]

        MARLIN["USE_XMAX_PLUG"]                              = USE_MAX_ENDSTOPS
        MARLIN["USE_YMAX_PLUG"]                              = USE_MAX_ENDSTOPS || IS_MINI
        MARLIN["USE_ZMAX_PLUG"]                              = USE_MAX_ENDSTOPS || IS_MINI || (IS_TAZ && !USE_HOME_BUTTON)
    }

    if (ENABLED("SDSUPPORT")) {
        MARLIN["SD_ABORT_ON_ENDSTOP_HIT"]                = true
    }

    /* Endstop settings are determined by printer model, except for the
     * X_MAX which varies by toolhead.
     */

    if (USE_NORMALLY_CLOSED_ENDSTOPS) {
        /* TAZ 6+ and Hibiscus Mini onwards use normally closed endstops.
         * This is safer, as a loose connector or broken wire will halt
         * the axis
         */
        MARLIN["X_MIN_ENDSTOP_HIT_STATE"]                = NORMALLY_CLOSED_ENDSTOP
        MARLIN["Y_MIN_ENDSTOP_HIT_STATE"]                = NORMALLY_CLOSED_ENDSTOP

        // LULZBOT_X_MAX_ENDSTOP_HIT_STATE varies by toolhead
        MARLIN["Y_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_CLOSED_ENDSTOP
        MARLIN["Z_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_CLOSED_ENDSTOP
    }
    else if (USE_NORMALLY_OPEN_ENDSTOPS) {
        MARLIN["X_MIN_ENDSTOP_HIT_STATE"]                = NORMALLY_OPEN_ENDSTOP
        MARLIN["Y_MIN_ENDSTOP_HIT_STATE"]                = NORMALLY_OPEN_ENDSTOP

        // LULZBOT_X_MAX_ENDSTOP_HIT_STATE varies by toolhead
        MARLIN["Y_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_OPEN_ENDSTOP
        MARLIN["Z_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_OPEN_ENDSTOP
    }

    // Electrical probing pins are always open until contact is made
    if (PROBE_STYLE == "BLTouch") {
        MARLIN["Z_MIN_ENDSTOP_HIT_STATE"]                = "HIGH"
        MARLIN["Z_MIN_PROBE_ENDSTOP_HIT_STATE"]          = "HIGH"
    } else {
        MARLIN["Z_MIN_ENDSTOP_HIT_STATE"]                = NORMALLY_OPEN_ENDSTOP
        MARLIN["Z_MIN_PROBE_ENDSTOP_HIT_STATE"]          = NORMALLY_OPEN_ENDSTOP
    }

    if (USE_Z_SCREW) {
        /* The older Minis seem succeptible to noise in the probe lines.
         * This restores the sampling of endstops as it existed in previous
         * version of Marlin.
         */
        MARLIN["ENDSTOP_NOISE_THRESHOLD"]                =  2
    }

/************************* HOMING & AXIS DIRECTIONS **************************/

    if (PRINTER.includes("Redgum_TAZWorkhorse")) {
        MARLIN["INVERT_X_DIR"]                           = 'true'
    } else {
        MARLIN["INVERT_X_DIR"]                           = 'false'
    }

    MARLIN["INVERT_Y_DIR"]                               = 'true'
    MARLIN["INVERT_Z_DIR"]                               = 'false'
    MARLIN["INVERT_E0_DIR"]                              = 'true'
    MARLIN["INVERT_E1_DIR"]                              = 'true'

    if (IS_MINI) {
        MARLIN["X_HOME_DIR"]                             = -1 // Home left
        MARLIN["Y_HOME_DIR"]                             =  1 // Home bed forward
        MARLIN["QUICK_HOME"]                             =  true
        MARLIN["X_SAFETY_STOP"]                          =  !PRINTER.includes("Hibiscus_Mini2")
        MARLIN["Y_SAFETY_STOP"]                          =  !PRINTER.includes("Hibiscus_Mini2") && !USE_BTT_002
        MARLIN["Z_SAFETY_STOP"]                          =  !USE_BTT_002
    }
    else if (PRINTER.includes("Juniper_TAZ5") || PRINTER.includes("Guava_TAZ4")) {
        MARLIN["X_HOME_DIR"]                             = -1 // Home left
        MARLIN["Y_HOME_DIR"]                             = -1 // Home bed rear
        MARLIN["QUICK_HOME"]                             =  true
        MARLIN["Z_SAFETY_STOP"]                          =  true
    }

    else if (PRINTER.includes("Redgum_TAZWorkhorse") ||  PRINTER.includes("SynDaver_Axi")) {
        MARLIN["X_HOME_DIR"]                             = -1 // Home left
        MARLIN["Y_HOME_DIR"]                             = -1 // Home bed rear
        MARLIN["QUICK_HOME"]                             =  true
        MARLIN["Z_SAFETY_STOP"]                          =  true
    }

    else if (IS_TAZ) {
        MARLIN["X_HOME_DIR"]                             = -1 // Home left
        MARLIN["Y_HOME_DIR"]                             =  1 // Home bed forward
        MARLIN["QUICK_HOME"]                             =  true
        if(!PRINTER.includes("Quiver_TAZPro")) {
            MARLIN["X_SAFETY_STOP"]                      =  true
            MARLIN["Y_SAFETY_STOP"]                      =  true
        }
        MARLIN["Z_SAFETY_STOP"]                          =  true
    }

    if (USE_HOME_BUTTON || ["BLTouch", "Inductive"].includes(PROBE_STYLE) ||
        PRINTER.includes("Juniper_TAZ5") ||
        PRINTER.includes("Guava_TAZ4") ||
        PRINTER.includes("SynDaver_Level")) {
        MARLIN["Z_HOME_DIR"]                             = -1 // Home towards bed
    } else {
        MARLIN["Z_HOME_DIR"]                             = 1 // Home to top
    }

    if (MINI_BED && USE_Z_BELT) {
        MARLIN["HOMING_FEEDRATE_MM_M"]                   = [50*60,50*60,40*60] // mm/m
    }
    else if (MINI_BED && USE_Z_SCREW) {
        MARLIN["HOMING_FEEDRATE_MM_M"]                   = [30*60,30*60,8*60] // mm/m
    }
    else if (PRINTER.includes("Quiver_TAZPro")) {
        // According to Brian Kahl, LulzBot is now using newer motors
        // which cannot handle 30mm/sec feedrate
        MARLIN["HOMING_FEEDRATE_MM_M"]                   = [50*60,50*60,25*60] // mm/m
    }
    else if (TAZ_BED && USE_Z_BELT) {
        MARLIN["HOMING_FEEDRATE_MM_M"]                   = [50*60,50*60,30*60] // mm/m
    }
    else if (TAZ_BED && USE_Z_SCREW) {
        MARLIN["HOMING_FEEDRATE_MM_M"]                   = [50*60,50*60,3*60]  // mm/m
    }

    if (["BLTouch", "Inductive"].includes(PROBE_STYLE)) {
        MARLIN["Z_SAFE_HOMING"]                          = true
    }
    else if (PRINTER.includes("SynDaver_Level")) {
        MARLIN["Z_SAFE_HOMING"]                          = true
        MARLIN["Z_SAFE_HOMING_X_POINT"]                  = -23
        MARLIN["Z_SAFE_HOMING_Y_POINT"]                  = 193
    }
    else if (USE_HOME_BUTTON) {
        // Only the TAZ 6 has a Z-homing button
        MARLIN["Z_SAFE_HOMING"]                          = true
        MARLIN["Z_SAFE_HOMING_X_POINT"]                  = -19
        MARLIN["Z_SAFE_HOMING_Y_POINT"]                  = 258
    }
    else if (PRINTER.includes("Juniper_TAZ5") || PRINTER.includes("Guava_TAZ4")) {
        // TAZ 4/5 safe homing position so fan duct does not hit.
        MARLIN["Z_SAFE_HOMING"]                          = true
        MARLIN["Z_SAFE_HOMING_X_POINT"]                  = 10
        MARLIN["Z_SAFE_HOMING_Y_POINT"]                  = 10
    }

    // Raise prior to homing to clear bed harware
    if (["BLTouch", "Inductive"].includes(PROBE_STYLE)) {
        MARLIN["Z_CLEARANCE_FOR_HOMING"]                        = 10
    }
    else if (IS_MINI) {
        MARLIN["Z_CLEARANCE_FOR_HOMING"]                        = 4
    }
    else {
        MARLIN["Z_CLEARANCE_FOR_HOMING"]                        = 5
    }

    if (PRINTER.includes("SynDaver_Level")) {
       MARLIN["HOMING_BACKOFF_POST_MM"]                  = [0, 0, 10]
    }
    else if (USE_HOME_BUTTON || ENABLED("ENDSTOPS_ALWAYS_ON_DEFAULT")) {
       // On a TAZ, we need to raise the print head after homing to clear the button
       MARLIN["HOMING_BACKOFF_POST_MM"]                  = [5, 5, USE_HOME_BUTTON ? 16 : 2]
    }

    // Enable NO_MOTION_BEFORE_HOMING on newer printers that have no MAX endstops
    if (!USE_MAX_ENDSTOPS) {
        MARLIN["NO_MOTION_BEFORE_HOMING"]                = true
    }

    /* If the printer uses dual Z endstops for X axis leveling,
     * supress the homing endstop validation as it often leads
     * to false errors
     */
    if (!USE_DUAL_Z_ENDSTOPS) {
        MARLIN["VALIDATE_HOMING_ENDSTOPS"]               = true
    }

/************************* STEPPER INACTIVITY TIMEOUT ************************/

    MARLIN["DEFAULT_STEPPER_TIMEOUT_SEC"]              = 600

    if (!USE_MAX_ENDSTOPS) {
        MARLIN["HOME_AFTER_DEACTIVATE"]                  = true
    }

    if (MARLIN["SDSUPPORT"]) {
        if (USE_Z_BELT) {
            MARLIN["SD_FINISHED_STEPPERRELEASE"]         = 'false'
            MARLIN["SD_FINISHED_RELEASECOMMAND"]         = C_STRING("M84 X Y E")
        } else {
            MARLIN["SD_FINISHED_STEPPERRELEASE"]         = 'true'
        }
    }

    MARLIN["DISABLE_IDLE_Z"]                         = USE_Z_BELT ? 'false' : 'true'

/************************ COMMON TOOLHEADS PARAMETERS ************************/

    MANUAL_FEEDRATE_E                                    = 1.0 // mm/sec
    MARLIN["DEFAULT_EJERK"]                              = 10.0
    MARLIN["NUM_SERVOS"]                                 = PROBE_STYLE == "BLTouch" ? 1 :  0
    MARLIN["FILAMENT_CHANGE_FAST_LOAD_LENGTH"]           = 40
    MARLIN["FILAMENT_CHANGE_UNLOAD_LENGTH"]              = 80
    MARLIN["FILAMENT_CHANGE_UNLOAD_FEEDRATE"]            = 5 // mm/s

/******************************* MINI TOOLHEADS ******************************/

    if (["Gladiola_SingleExtruder","Albatross_Flexystruder","Finch_Aerostruder"].includes(TOOLHEAD)) {
        if (USE_BTT_002 || USE_EINSY_RETRO || USE_EINSY_RAMBO || USE_ARCHIM2 || ["Finch_Aerostruder"].includes(TOOLHEAD)) {
            MOTOR_CURRENT_E                              = 960 // mA
        } else {
            MOTOR_CURRENT_E                              = 1250 // mA
        }
    }

    if  (["Gladiola_SingleExtruder"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "SingleExtruder"
        TOOLHEAD_BLOCK                                   = "AO_Hexagon"
        E_STEPS                                          = 833
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("Single Extruder")
        //         16 chars max                                      ^^^^^^^^^^^^^^^
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_OPEN_ENDSTOP
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 3.0
    }

    if (["Albatross_Flexystruder"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "Flexystruder"
        TOOLHEAD_BLOCK                                   = "AO_Hexagon"
        E_STEPS                                          = 833
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("Flexystruder")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_OPEN_ENDSTOP
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 3.0
    }

    if (["Finch_Aerostruder"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "Aerostruder"
        TOOLHEAD_BLOCK                                   = "E3D_Titan_Aero_V6"
        E_STEPS                                          = 420
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("Aerostruder")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_OPEN_ENDSTOP
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 3.0
    }

/**************************** TAZ 4/5/6 TOOLHEADS ****************************/

    if (["Buda_SingleExtruder"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "SingleExtruder"
        TOOLHEAD_BLOCK                                   = "Budaschnozzle"
        MOTOR_CURRENT_E                                  = 750 // mA
        E_STEPS                                          = 830
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("Single Extruder")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_CLOSED_ENDSTOP
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 3.0
    }

    if (["Tilapia_SingleExtruder"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "SingleExtruder"
        TOOLHEAD_BLOCK                                   = "AO_Hexagon"
        MOTOR_CURRENT_E                                  = 750 // mA
        E_STEPS                                          = 830
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("Single Extruder")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_CLOSED_ENDSTOP
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 3.0
    }

    if (["Angelfish_Aerostruder"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "Aerostruder"
        TOOLHEAD_BLOCK                                   = "E3D_Titan_Aero_V6"
        MOTOR_CURRENT_E                                  = 875 // mA
        E_STEPS                                          = 420
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("Aerostruder")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_CLOSED_ENDSTOP
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 3.0
    }

    if (["Kanyu_Flexystruder"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "Flexystruder"
        TOOLHEAD_BLOCK                                   = "AO_Hexagon"
        MOTOR_CURRENT_E                                  = 410 // mA
        E_STEPS                                          = 830
        TOOLHEAD_X_MAX_ADJ                               = -12
        TOOLHEAD_X_MIN_ADJ                               = -7
        TOOLHEAD_Y_MAX_ADJ                               = -1
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("Flexystruder")
        //        16 chars max                                      ^^^^^^^^^^^^^^^
        MARLIN["EXTRUDERS"]                              = 1
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_OPEN_ENDSTOP
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 3.0
    }

    if (["Opah_Moarstruder"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "MOARstruder"
        TOOLHEAD_BLOCK                                   = "Moarstruder"
        MOTOR_CURRENT_E                                  = 750 // mA
        TOOLHEAD_X_MAX_ADJ                               = -10
        E_STEPS                                          = 830
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("MOARstruder")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["DEFAULT_ACCELERATION"]                   = 250
        MARLIN["DEFAULT_TRAVEL_ACCELERATION"]            = 250
        MARLIN["EXTRUDERS"]                              = 1
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_OPEN_ENDSTOP
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 3.0
    }

    if (["Javelin_DualExtruderV2", "Longfin_FlexyDually"].includes(TOOLHEAD)) {
        MOTOR_CURRENT_E0                                 = 875 // mA
        MOTOR_CURRENT_E1                                 = 875 // mA
        TOOLHEAD_X_MAX_ADJ                               = -12
        TOOLHEAD_X_MIN_ADJ                               = -2
        MARLIN["EXTRUDERS"]                              = 2
        MARLIN["TOOLCHANGE_ZRAISE"]                      = 2
        MARLIN["TEMP_SENSOR_1"]                          = 5
        MARLIN["DISTINCT_E_FACTORS"]                     = true
        MARLIN["SWAP_EXTRUDER_FANS"]                     = true // For backwards compatibility with TAZ 4
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 3.0
    }

    if (["Javelin_DualExtruderV2"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "DualExtruder v2"
        TOOLHEAD_BLOCK                                   = "AO_Hexagon"
        E_STEPS                                          = 830
        TOOLHEAD_WIPE_Y2_ADJ                             = 48
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("Dual Extruder 2")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_OPEN_ENDSTOP
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 3.0
    }

    if (["Longfin_FlexyDually"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "FlexyDually v2"
        TOOLHEAD_BLOCK                                   = "AO_Hexagon"
        E_STEPS                                          = 830
        TOOLHEAD_WIPE_Y2_ADJ                             = 48
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("FlexyDually v2")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_OPEN_ENDSTOP
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 3.0
    }

    if (["Yellowfin_DualExtruderV3"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "DualExtruder v3"
        TOOLHEAD_BLOCK                                   = "E3D_SOMEstruder_x2"
        MOTOR_CURRENT_E0                                 = 875 // mA
        MOTOR_CURRENT_E1                                 = 875 // mA
        E_STEPS                                          = 760
        TOOLHEAD_X_MIN_ADJ                               = -6
        TOOLHEAD_X_MAX_ADJ                               = -21
        TOOLHEAD_Y_MIN_ADJ                               = -7
        TOOLHEAD_Y_MAX_ADJ                               = -7
        T1_OFFSET_X                                      = 13
        /* Adjust so left nozzle probes on the left washers;
         * right nozzles on the right nozzle.
         */
        TOOLHEAD_RIGHT_PROBE_ADJ                         = -T1_OFFSET_X
        /* The nozzles on Yellowfin are too close together
         * to run the calibration routine on the cube
         */
        USE_CALIBRATION_CUBE                             = false
        CALIBRATE_ON_WASHER                              = false
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("Dual Extruder 3")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["EXTRUDERS"]                              = 2
        MARLIN["TEMP_SENSOR_1"]                          = 5
        MARLIN["DISTINCT_E_FACTORS"]                     = true
        MARLIN["PID_PARAMS_PER_HOTEND"]                  = true
        MARLIN["TOOLCHANGE_ZRAISE"]                      = 2
        MARLIN["INVERT_E1_DIR"]                          = 'false'
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 3.0
        if (USE_HOME_BUTTON) {
            // Legacy configuration for TAZ 6 with homing button riser
            MARLIN["MANUAL_Z_HOME_POS"]                  = 5.5
            MARLIN["Z_SAFE_HOMING_X_POINT"]              = -26
            MARLIN["Z_SAFE_HOMING_Y_POINT"]              = 258
            MARLIN["Z_CLEARANCE_FOR_HOMING"]             = 10
            MARLIN["Z_CLEARANCE_DEPLOY_PROBE"]           = 10
            MARLIN["Z_CLEARANCE_BETWEEN_PROBES"]         = 10
        }
        if (PRINTER.includes("Oliveoil_TAZ6") || PRINTER.includes("Juniper_TAZ5") || PRINTER.includes("Guava_TAZ4")) {
            MARLIN["SWAP_E0_AND_E1"]                     = true
            MARLIN["SWAP_EXTRUDER_FANS"]                 = true // For backwards compatibility with TAZ 4
            MARLIN["X_MAX_ENDSTOP_HIT_STATE"]            = NORMALLY_CLOSED_ENDSTOP
        }
    }

/**************************** UNIVERSAL TOOLHEADS ****************************/

    if (["CecropiaSilk_SingleExtruderAeroV2",
        "AchemonSphinx_SmallLayer",
        "BandedTiger_HardenedSteel",
        "DingyCutworm_HardenedSteelPlus",
        "Goldenrod_HardenedExtruder",
        "Lutefisk_M175",
        "M175_Mosquito",
        "RTD_Pt1000Aero"].includes(TOOLHEAD)) {
        MOTOR_CURRENT_E                                  = 960 // mA
    }

    if (["RTD_Pt1000Aero"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "SingleExtruderAeroV2"
        TOOLHEAD_BLOCK                                   = "RTD_Pt1000"
        E_STEPS                                          = 420
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("RTD Pt1000 Aero")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_CLOSED_ENDSTOP
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 3.0
    }
        
    if (["CecropiaSilk_SingleExtruderAeroV2"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "SingleExtruderAeroV2"
        TOOLHEAD_BLOCK                                   = "E3D_Titan_Aero_V6"
        E_STEPS                                          = 420
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("SE 0.5mm AeroV2")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_CLOSED_ENDSTOP
        if (IS_TAZ) {
            // Reduce X-Max to 295 as reported by https://github.com/drunken-octopus/drunken-octopus-marlin/issues/37
            TOOLHEAD_X_MAX_ADJ                           = -6.5
        }
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 3.0
    }

    if (["Goldenrod_HardenedExtruder"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "HardenedExtruder"
        TOOLHEAD_BLOCK                                   = "E3D_Titan_Aero_V6"
        E_STEPS                                          = 420
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("HE 0.5mm")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_CLOSED_ENDSTOP
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 3.0
    }

    if (["AchemonSphinx_SmallLayer"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "SmallLayer"
        TOOLHEAD_BLOCK                                   = "E3D_Titan_Aero_V6"
        E_STEPS                                          = 420
        MANUAL_FEEDRATE_E                                = 0.7 // mm/sec
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("SL 0.25mm Micro")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_CLOSED_ENDSTOP
        if (!["BLTouch", "Inductive"].includes(PROBE_STYLE)) {
          MARLIN["NOZZLE_TO_PROBE_OFFSET"]               = [0, 0, -1.24]
        }
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 3.0
    }

    if (["BandedTiger_HardenedSteel"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "HardenedSteel"
        TOOLHEAD_BLOCK                                   = "E3D_Titan_Aero_Volcano"
        E_STEPS                                          = 420
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("HS 0.8mm")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_CLOSED_ENDSTOP
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 3.0
    }

    if (["DingyCutworm_HardenedSteelPlus"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "HardenedSteelPlus"
        TOOLHEAD_BLOCK                                   = "E3D_Titan_Aero_Volcano"
        E_STEPS                                          = 420
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("HS+ 1.2mm")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_CLOSED_ENDSTOP
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 3.0
    }

    if (["Lutefisk_M175"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "HardenedSteelPlus"
        TOOLHEAD_BLOCK                                   = "SliceEngineering_Mosquito"
        E_STEPS                                          = 415
        TOOLHEAD_X_MIN_ADJ                               = -6.9
        TOOLHEAD_X_MAX_ADJ                               = -6.5
        TOOLHEAD_Y_MIN_ADJ                               =  0.1
        TOOLHEAD_Y_MAX_ADJ                               = -13.5
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("M175 v1")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_CLOSED_ENDSTOP
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 1.75
        MARLIN["FILAMENT_CHANGE_FAST_LOAD_LENGTH"]       = 65
        MARLIN["INVERT_E0_DIR"]                          = 'true'
    }

    if (["M175_Mosquito"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "HardenedSteelPlus"
        TOOLHEAD_BLOCK                                   = "SliceEngineering_Mosquito"
        E_STEPS                                          = 415
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("M175 v2")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_CLOSED_ENDSTOP
        // Reduce X-Max to 284 as reported https://forums.drunkenoctop.us/t/lulzbot-archim2-bl-touch-m175v2-do-jamming-on-right-side/440
        TOOLHEAD_X_MAX_ADJ                               = -17.5
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 1.75
        MARLIN["FILAMENT_CHANGE_FAST_LOAD_LENGTH"]       = 65
        MARLIN["INVERT_E0_DIR"]                          = 'true'
    }

    TOOLHEAD_IS_UNIVERSAL = [
        "CecropiaSilk_SingleExtruderAeroV2",
        "Goldenrod_HardenedExtruder",
        "AchemonSphinx_SmallLayer",
        "BandedTiger_HardenedSteel",
        "DingyCutworm_HardenedSteelPlus",
        "Quiver_DualExtruder",
        "KangarooPaw_SingleExtruder",
        "Lutefisk_M175",
        "H175_Hemera",
        "M175_Mosquito",
        "RTD_Pt1000Aero"
    ].includes(TOOLHEAD)

    if (TOOLHEAD_IS_UNIVERSAL && USE_Z_SCREW) {
        MARLIN["USE_XMAX_PLUG"]                          = false
        MARLIN["X_SAFETY_STOP"]                          = false
        MARLIN["NO_MOTION_BEFORE_HOMING"]                = true
        ADAPTER_X_OFFSET                                 = 0
        ADAPTER_Y_OFFSET                                 = IS_TAZ ? -2.0 : -7.2
    }

    if (!TOOLHEAD_IS_UNIVERSAL && (
        PRINTER.includes("Redgum_TAZWorkhorse") ||
        PRINTER.includes("SynDaver_Axi") ||
        PRINTER.includes("Quiver_TAZPro") ||
        PRINTER.includes("Hibiscus_Mini2")
    )) {
        MARLIN["USE_XMAX_PLUG"]                          = false
        MARLIN["NO_MOTION_BEFORE_HOMING"]                = true
        ADAPTER_X_OFFSET                                 = 29
        ADAPTER_Y_OFFSET                                 = -8
    }

/***************************** TAZ PRO TOOLHEADS *****************************/

    if (["Quiver_DualExtruder"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "DualExtruder"
        TOOLHEAD_BLOCK                                   = "E3D_Titan_Aero_V6"
        MOTOR_CURRENT_E0                                 = 960 // mA
        MOTOR_CURRENT_E1                                 = 960 // mA
        E_STEPS                                          = 420
        TOOLHEAD_X_MAX_ADJ                               = -21
        TOOLHEAD_X_MIN_ADJ                               = -21
        TOOLHEAD_Y_MAX_ADJ                               = -21
        TOOLHEAD_Y_MIN_ADJ                               = -21
        TOOLHEAD_Z_MAX_ADJ                               = -7
        TOOLHEAD_Z_MIN_ADJ                               = -7
        T1_OFFSET_X                                      = 44.576
        T1_OFFSET_Y                                      = 0.095
        T1_OFFSET_Z                                      = 0.005
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("Quivering Aeros")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["EXTRUDERS"]                              = 2
        MARLIN["TOOLCHANGE_ZRAISE"]                      = 0
        MARLIN["NUM_SERVOS"]                             = 2
        MARLIN["SERVO_DELAY"]                            = [1000, 1000]
        MARLIN["SWITCHING_NOZZLE"]                       = true
        MARLIN["SWITCHING_NOZZLE_E1_SERVO_NR"]           = 1
        MARLIN["SWITCHING_NOZZLE_SERVO_ANGLES"]          = [[55, 120],[55, 120]]
        MARLIN["USE_XMAX_PLUG"]                          = false
        MARLIN["TEMP_SENSOR_1"]                          = 5
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 3.0
    }

/****************************** OTHER TOOLHEADS ******************************/

    if (["KangarooPaw_SingleExtruder"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "SingleExtruder"
        TOOLHEAD_BLOCK                                   = "None"
        E_STEPS                                          = 9448.8
        MOTOR_CURRENT_E                                  = 350 // mA
        MANUAL_FEEDRATE_E                                = 1.7 // mm/sec
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("Goostruder")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["EXTRUDERS"]                              = 1
        MARLIN["Z_CLEARANCE_DEPLOY_PROBE"]               = 30
        MARLIN["Z_CLEARANCE_BETWEEN_PROBES"]             = 30
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_CLOSED_ENDSTOP
    }

    if (["H175_Hemera"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "Hermera"
        TOOLHEAD_BLOCK                                   = "E3D_Hermera_V6"
        E_STEPS                                          = 400
        MOTOR_CURRENT_E                                  = 960 // mA
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("H175")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_CLOSED_ENDSTOP
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 1.75
    }

    if (["SynDaver_Level"].includes(TOOLHEAD)) {
        TOOLHEAD_TYPE                                    = "SingleExtruder"
        TOOLHEAD_BLOCK                                   = "E3D_V6_30W_Cylinder"
        E_STEPS                                          = 136
        MOTOR_CURRENT_E                                  = 600 // mA
        MARLIN["TOOLHEAD_NAME"]                          = C_STRING("Single Extruder")
        //        16 chars max                                       ^^^^^^^^^^^^^^^
        MARLIN["X_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_CLOSED_ENDSTOP
        MARLIN["DEFAULT_NOMINAL_FILAMENT_DIA"]           = 1.75
    }

/**************************** TEMPERATURE SETTINGS ***************************/

    if (ENABLED("LULZBOT_DISABLE_TOOLHEAD_HEATER")) {
        MARLIN["EXTRUDE_MINTEMP"]                        =  0
        MARLIN["FAN_PIN"]                                = -1
    } else {
        MARLIN["PREVENT_COLD_EXTRUSION"]                 = true
        MARLIN["EXTRUDE_MINTEMP"]                        = 120
    }

    if (TOOLHEAD_BLOCK.includes("RTD_Pt1000")) {
        MARLIN["TEMP_SENSOR_0"]                          = 1047
        MARLIN["TEMP_RESIDENCY_TIME"]                    = 1
        MARLIN["TEMP_WINDOW"]                            = 10
        MARLIN["TEMP_HYSTERESIS"]                        = 10
        MARLIN["HEATER_0_MAXTEMP"]                       = 505
        MARLIN["THERMAL_PROTECTION_PERIOD"]              = 15  // Seconds
        MARLIN["THERMAL_PROTECTION_HYSTERESIS"]          = 30  // Degrees Celsius    
    } else if (TOOLHEAD.includes("Buda_SingleExtruder")) {
        MARLIN["TEMP_SENSOR_0"]                          = 7
        MARLIN["TEMP_RESIDENCY_TIME"]                    = 10
        MARLIN["TEMP_WINDOW"]                            = 1
        MARLIN["TEMP_HYSTERESIS"]                        = 3
        MARLIN["HEATER_0_MAXTEMP"]                       = 250
        MARLIN["PREHEAT_2_LABEL"]                        = false
        MARLIN["PREHEAT_2_TEMP_HOTEND"]                  = false
        MARLIN["PREHEAT_2_TEMP_BED"]                     = false
        MARLIN["PREHEAT_2_TEMP_CHAMBER"]                 = false
        MARLIN["PREHEAT_2_FAN_SPEED"]                    = false
        MARLIN["BANG_MAX"]                               = 70
        MARLIN["PID_MAX"]                                = 74
        MARLIN["THERMAL_PROTECTION_PERIOD"]              = 40  // Seconds
        MARLIN["THERMAL_PROTECTION_HYSTERESIS"]          =  8  // Degrees Celsius
    } else {
        MARLIN["TEMP_SENSOR_0"]                          = 5
        MARLIN["TEMP_RESIDENCY_TIME"]                    = 1
        MARLIN["TEMP_WINDOW"]                            = 10
        MARLIN["TEMP_HYSTERESIS"]                        = 10
        MARLIN["HEATER_0_MAXTEMP"]                       = 305
        MARLIN["THERMAL_PROTECTION_PERIOD"]              = 15  // Seconds
        MARLIN["THERMAL_PROTECTION_HYSTERESIS"]          = 30  // Degrees Celsius
    }

    MARLIN["TEMP_SENSOR_BED"]                            = 7
    MARLIN["TEMP_BED_RESIDENCY_TIME"]                    = 1
    MARLIN["TEMP_BED_WINDOW"]                            = 5
    MARLIN["TEMP_BED_HYSTERESIS"]                        = 5

    if (MARLIN["EXTRUDERS"] > 1) {
        MARLIN["HEATER_1_MAXTEMP"]                       = 305
    }

    MARLIN["THERMAL_PROTECTION_BED_PERIOD"]              = 15  // Seconds
    MARLIN["THERMAL_PROTECTION_BED_HYSTERESIS"]          = 10  // Degrees Celsius

    MARLIN["PREHEAT_1_TEMP_HOTEND"]                      = 200 // PLA

    if (IS_MINI) {
        MARLIN["WATCH_TEMP_PERIOD"]                      = 20  // Seconds
        MARLIN["WATCH_TEMP_INCREASE"]                    = 2   // Degrees Celsius
    }
    else if (TOOLHEAD.includes("Buda_SingleExtruder")) {
        MARLIN["WATCH_TEMP_PERIOD"]                      = 60  // Seconds
        MARLIN["WATCH_TEMP_INCREASE"]                    = 8   // Degrees Celsius
    }
    else if (IS_TAZ) {
        MARLIN["WATCH_TEMP_PERIOD"]                      = 40  // Seconds
        MARLIN["WATCH_TEMP_INCREASE"]                    = 10  // Degrees Celsius
    }

    // limits duty cycle to bed; 255=full current
    if (IS_MINI) {
        // Heater current: 24V/5.5 Ohms = 4.4A
        MARLIN["MAX_BED_POWER"]                          = 255
    }
    else if (PRINTER.includes("SynDaver_Axi")) {
        /* Heater current: 24V/1.6 Ohms = 15A
         * Verified that the AXI can support 100% power to the bed
         */
        MARLIN["MAX_BED_POWER"]                          = 255
    } else if (IS_TAZ) {
        /* Heater current: 24V/1.6 Ohms = 15A
         * Set Max Bed Power to 80% for a safety margin on the 15A fuse.
         */
        MARLIN["MAX_BED_POWER"]                          = 206
    }

    if (PRINTER.includes("SynDaver_Level")) {
        MARLIN["BED_MAXTEMP"]                            = 135
    }

/****************************** HEATING ELEMENTS *****************************/

    MARLIN["PIDTEMP"]                                    = true
    MARLIN["PIDTEMPBED"]                                 = true

    // Hotend variants

    if (TOOLHEAD_BLOCK == "Budaschnozzle") {
        // Buda 2.0 on 24V
        MARLIN["DEFAULT_Kp"]                             =  6
        MARLIN["DEFAULT_Ki"]                             =  .3
        MARLIN["DEFAULT_Kd"]                             = 125
    }
    else if (TOOLHEAD_BLOCK == "Moarstruder") {
        // LulzBot MOARstruder (40w)
        MARLIN["DEFAULT_Kp"]                             =  55.64
        MARLIN["DEFAULT_Ki"]                             =   6.79
        MARLIN["DEFAULT_Kd"]                             = 113.94
    }
    else if (TOOLHEAD_BLOCK == "E3D_SOMEstruder_x2") {
        // Side-by-side LulzBot E3D SOMEstruder on Yellowfin Dual
        MARLIN["DEFAULT_Kp"]                             =  47.45
        MARLIN["DEFAULT_Ki"]                             =  4.83
        MARLIN["DEFAULT_Kd"]                             = 116.63
    }
    else if (TOOLHEAD_BLOCK == "AO_Hexagon") {
        // LulzBot AO-Hexagon (30w)
        MARLIN["DEFAULT_Kp"]                             =  28.79
        MARLIN["DEFAULT_Ki"]                             =   1.91
        MARLIN["DEFAULT_Kd"]                             = 108.51
    }
    else if (TOOLHEAD_BLOCK == "E3D_Titan_Aero_V6") {
        // E3D Titan Aero with LulzBot V6 block
        MARLIN["DEFAULT_Kp"]                             = 21.00
        MARLIN["DEFAULT_Ki"]                             =  1.78
        MARLIN["DEFAULT_Kd"]                             = 61.93
    }
    else if (TOOLHEAD_BLOCK == "E3D_Hermera_V6") {
        // E3D Hermera with LulzBot V6 block
        MARLIN["DEFAULT_Kp"]                             = 22.89
        MARLIN["DEFAULT_Ki"]                             =  2.55
        MARLIN["DEFAULT_Kd"]                             = 51.27
    }
    else if (TOOLHEAD_BLOCK == "E3D_Titan_Aero_Volcano") {
        // E3D Titan Aero with Volcano block
        MARLIN["DEFAULT_Kp"]                             = 37.55
        MARLIN["DEFAULT_Ki"]                             = 5.39
        MARLIN["DEFAULT_Kd"]                             = 65.36
    }
    else if (TOOLHEAD_BLOCK == "SliceEngineering_Mosquito") {
        // Slice Engineering Mosquito
        MARLIN["DEFAULT_Kp"]                             = 37.76
        MARLIN["DEFAULT_Ki"]                             = 3.49
        MARLIN["DEFAULT_Kd"]                             = 102.08
    }
    else if (TOOLHEAD_BLOCK == "E3D_V6_30W_Cylinder") {
        // E3D V6 hotend on 1.75 Bowden Cylindrical heatsink w/ 30W heater
        MARLIN["DEFAULT_Kp"]                             = 18.64
        MARLIN["DEFAULT_Ki"]                             = 1.22
        MARLIN["DEFAULT_Kd"]                             = 71.21
    }

    // Heated bed variants

    if (PRINTER.includes("SynDaver_Level")) {
      // SynDaver Level aluminium bed with 150W tempco heater
      MARLIN["DEFAULT_bedKp"]                            = 30.05
      MARLIN["DEFAULT_bedKi"]                            = 2.04
      MARLIN["DEFAULT_bedKd"]                            = 294.88
    }

    // 24V 360W silicone heater from NPH on 3mm borosilicate (TAZ 2.2+)
    else if (PRINTER.includes("Guava_TAZ4")) {
      MARLIN["DEFAULT_bedKp"]                            = 20
      MARLIN["DEFAULT_bedKi"]                            = 5
      MARLIN["DEFAULT_bedKd"]                            = 275
    }

    //24V 360W silicone heater from NPH on 3mm borosilicate (TAZ 2.2+)
    else if (TAZ_BED && !USE_TWO_PIECE_BED) {
      MARLIN["DEFAULT_bedKp"]                            = 162
      MARLIN["DEFAULT_bedKi"]                            = 17
      MARLIN["DEFAULT_bedKd"]                            = 378
    }

    // Modular two piece bed (Mini 2/TAZ Pro)
    else if (TAZ_BED && USE_TWO_PIECE_BED) {
      MARLIN["DEFAULT_bedKp"]                            = 286.02
      MARLIN["DEFAULT_bedKi"]                            = 54.55
      MARLIN["DEFAULT_bedKd"]                            = 374.90
    }

    // 24V 360W silicone heater from NPH on 3mm borosilicate (TAZ 2.2+)
    else if (MINI_BED && !USE_TWO_PIECE_BED) {
      MARLIN["DEFAULT_bedKp"]                            = 294
      MARLIN["DEFAULT_bedKi"]                            = 65
      MARLIN["DEFAULT_bedKd"]                            = 382
    }

    // Modular two piece bed (Mini 2+)
    else if (MINI_BED && USE_TWO_PIECE_BED) {
      MARLIN["DEFAULT_bedKp"]                            = 384.33
      MARLIN["DEFAULT_bedKi"]                            = 72.17
      MARLIN["DEFAULT_bedKd"]                            = 511.64
    }

/************************* COOLING FAN CONFIGURATION *************************/

    /* For the Pelonis C4010L24BPLB1b-7 fan, we need a relative low
     * PWM frequency of about 122Hz in order for the fan to turn.
     */

    if (USE_BTT_002 || USE_ARCHIM2) {
        /* On the Archim, it is necessary to use soft PWM to get the
         * frequency down in the kilohertz
         */
        MARLIN["FAN_SOFT_PWM"]                           = true
    } else {
        /* By default, FAST_PWM_FAN_FREQUENCY sets PWM to ~31kHz,
         * but we want to lower this to 122 Hz.
         */
        MARLIN["FAST_PWM_FAN"]                           = true
        MARLIN["FAST_PWM_FAN_FREQUENCY"]                 = 122
    }

    MARLIN["FAN_KICKSTART_TIME"]                         = 100
    MARLIN["FAN_MIN_PWM"]                                = 70
    MARLIN["SOFT_PWM_SCALE"]                             = 4

    MARLIN["ADAPTIVE_FAN_SLOWING"]                       = true
    MARLIN["TEMP_TUNING_MAINTAIN_FAN"]                   = true

    MARLIN["USE_CONTROLLER_FAN"]                         = true
    if (USE_EINSY_RETRO || USE_EINSY_RAMBO || USE_BTT_002) {
        // The TMC drivers need a bit more cooling
        MARLIN["CONTROLLERFAN_SPEED_ACTIVE"]             = 255
        MARLIN["CONTROLLERFAN_SPEED_IDLE"]               = 120
        MARLIN["CONTROLLER_FAN_IGNORE_Z"]                = true
    }
    else if (IS_MINI) {
        // The Mini fan runs rather loud at full speed
        MARLIN["CONTROLLERFAN_SPEED_ACTIVE"]             = 120
        MARLIN["CONTROLLERFAN_SPEED_IDLE"]               = 120
    }
    else if (PRINTER.includes("Guava_TAZ4") && USE_ARCHIM2) {
        MARLIN["CONTROLLERFAN_SPEED_ACTIVE"]             = 130
        MARLIN["CONTROLLERFAN_SPEED_IDLE"]               = 0
    }
    else if (IS_TAZ) {
        MARLIN["CONTROLLERFAN_SPEED_ACTIVE"]             = 255
        MARLIN["CONTROLLERFAN_SPEED_IDLE"]               = 120
    }

    if (PRINTER.includes("SynDaver_Level")) {
        // Vented Chamber Settings
        MARLIN["TEMP_SENSOR_CHAMBER"]                    = 7
        MARLIN["CHAMBER_LIMIT_SWITCHING"]                = true
        MARLIN["HEATER_CHAMBER_PIN"]                     = 8 // D8 PC22 FET_PWM5 ("HTR3" header)
        MARLIN["FAN1_PIN"]                               = -1
        MARLIN["HEATER_CHAMBER_INVERTING"]               = 'true' // Activate cooler when temperature is above threshold
        MARLIN["THERMAL_PROTECTION_CHAMBER"]             = false
        MARLIN["CHAMBER_MAXTEMP"]                        = 135;
    }

/****************************** AXIS TRAVEL LIMITS ******************************/

    /* Define min and max travel limits based on the printer model using a standard
     * toolhead, then define adjustments from the standard for alternative toolheads.
     * This allows us to accomodate toolheads that might be wider or taller than the
     * standard.
     */

    if (PRINTER.includes("Experimental_MiniEinsyLCD")) {
        STANDARD_X_MAX_POS                               = 165.8
        STANDARD_X_MIN_POS                               =   0.0
        STANDARD_Y_MAX_POS                               = 190.0
        STANDARD_Y_MIN_POS                               = -14.0

        STANDARD_X_BED_SIZE                              = 155.8
        STANDARD_Y_BED_SIZE                              = 155.8
    }
    else if (PRINTER.includes("SynDaver_Level")) {
        STANDARD_X_MAX_POS                               = 180.5
        STANDARD_X_MIN_POS                               = -23.5
        STANDARD_Y_MAX_POS                               = 193
        STANDARD_Y_MIN_POS                               = -19

        STANDARD_X_BED_SIZE                              = 180
        STANDARD_Y_BED_SIZE                              = 180
    }
    else if (IS_MINI && USE_Z_SCREW) {
        STANDARD_X_MAX_POS                               = 165.8
        STANDARD_X_MIN_POS                               =   0.0
        STANDARD_Y_MAX_POS                               = 196.0
        STANDARD_Y_MIN_POS                               =  -8.0

        STANDARD_X_BED_SIZE                              = 155.8
        STANDARD_Y_BED_SIZE                              = 155.8
    }
    else if (IS_MINI && USE_Z_BELT) {
        STANDARD_X_MAX_POS                               = 173
        STANDARD_X_MIN_POS                               = -3
        STANDARD_Y_MAX_POS                               = 192
        STANDARD_Y_MIN_POS                               = -5

        STANDARD_X_BED_SIZE                              = 157
        STANDARD_Y_BED_SIZE                              = 157
    }

    else if (PRINTER.includes("Juniper_TAZ5") || PRINTER.includes("Guava_TAZ4")) {
        STANDARD_X_MAX_POS                               = 299.5
        STANDARD_X_MIN_POS                               =   0.0
        STANDARD_Y_MAX_POS                               = 277.4
        STANDARD_Y_MIN_POS                               =   0.0

        STANDARD_X_BED_SIZE                              = 289.4
        STANDARD_Y_BED_SIZE                              = 276.4
    }
    else if (PRINTER.includes("Redgum_TAZWorkhorse")) {
        STANDARD_X_MAX_POS                               = 295
        STANDARD_X_MIN_POS                               = -50
        STANDARD_Y_MAX_POS                               = 308
        STANDARD_Y_MIN_POS                               = -17

        STANDARD_X_BED_SIZE                              = 280
        STANDARD_Y_BED_SIZE                              = 280
    }
    else if (PRINTER.includes("SynDaver_Axi_2")) {
        STANDARD_X_MAX_POS                               = 288
        STANDARD_X_MIN_POS                               = -49
        STANDARD_Y_MAX_POS                               = 284
        STANDARD_Y_MIN_POS                               = -55

        STANDARD_X_BED_SIZE                              = 280
        STANDARD_Y_BED_SIZE                              = 280
    }
    else if (PRINTER.includes("SynDaver_Axi")) {
        STANDARD_X_MAX_POS                               = 288
        STANDARD_X_MIN_POS                               = -49
        STANDARD_Y_MAX_POS                               = 300
        STANDARD_Y_MIN_POS                               = -35

        STANDARD_X_BED_SIZE                              = 280
        STANDARD_Y_BED_SIZE                              = 280
    }
    else if (IS_TAZ && USE_Z_BELT) {
        STANDARD_X_MAX_POS                               = 320
        STANDARD_X_MIN_POS                               = -6
        STANDARD_Y_MAX_POS                               = 313
        STANDARD_Y_MIN_POS                               = -15

        STANDARD_X_BED_SIZE                              = 280
        STANDARD_Y_BED_SIZE                              = 280
    }
    else if (IS_TAZ && USE_Z_SCREW) {
        STANDARD_X_MAX_POS                               = 301.5
        STANDARD_X_MIN_POS                               = -20.1
        STANDARD_Y_MAX_POS                               = 304.5
        STANDARD_Y_MIN_POS                               = -20.1

        STANDARD_X_BED_SIZE                              = 281.4
        STANDARD_Y_BED_SIZE                              = 281.4
    }

    if (PRINTER.includes("SynDaver_Level")) {
        STANDARD_Z_MIN_POS                               = 0
        STANDARD_Z_MAX_POS                               = 183
    }
    else if (IS_MINI && USE_Z_SCREW) {
        STANDARD_Z_MIN_POS                               = -5
        STANDARD_Z_MAX_POS                               = 159
    }
    else if (IS_MINI && USE_Z_BELT) {
        STANDARD_Z_MIN_POS                               = 0
        STANDARD_Z_MAX_POS                               = 183
    }
    else if (PRINTER.includes("Juniper_TAZ5") || PRINTER.includes("Guava_TAZ4")) {
        STANDARD_Z_MIN_POS                               = 0
        STANDARD_Z_MAX_POS                               = 250
    }
    else if (IS_TAZ && USE_Z_SCREW) {
        STANDARD_Z_MIN_POS                               = 0
        STANDARD_Z_MAX_POS                               = 270
    }
    else if (PRINTER.includes("SynDaver_Axi_2")) {
        STANDARD_Z_MIN_POS                               = 0
        STANDARD_Z_MAX_POS                               = 283
    }
    else if (PRINTER.includes("SynDaver_Axi")) {
        STANDARD_Z_MIN_POS                               = 0
        STANDARD_Z_MAX_POS                               = 294
    }

    else if (IS_TAZ && USE_Z_BELT) {
        STANDARD_Z_MIN_POS                               = -2
        STANDARD_Z_MAX_POS                               = 299
    }

    if (["BLTouch", "Inductive"].includes(PROBE_STYLE)) {
        // If using BLTouch, then set the Z_MIN_POS to zero
        STANDARD_Z_MIN_POS = 0
    }

    MARLIN["X_MAX_POS"] = STANDARD_X_MAX_POS + TOOLHEAD_X_MAX_ADJ + ADAPTER_X_OFFSET
    MARLIN["X_MIN_POS"] = STANDARD_X_MIN_POS + TOOLHEAD_X_MIN_ADJ + ADAPTER_X_OFFSET
    MARLIN["Y_MAX_POS"] = STANDARD_Y_MAX_POS + TOOLHEAD_Y_MAX_ADJ + ADAPTER_Y_OFFSET
    MARLIN["Y_MIN_POS"] = STANDARD_Y_MIN_POS + TOOLHEAD_Y_MIN_ADJ + ADAPTER_Y_OFFSET
    MARLIN["Z_MAX_POS"] = STANDARD_Z_MAX_POS + TOOLHEAD_Z_MAX_ADJ
    MARLIN["Z_MIN_POS"] = STANDARD_Z_MIN_POS + TOOLHEAD_Z_MIN_ADJ

    MARLIN["X_BED_SIZE"] = Math.min(MARLIN["X_MAX_POS"], STANDARD_X_BED_SIZE)
    MARLIN["Y_BED_SIZE"] = Math.min(MARLIN["Y_MAX_POS"], STANDARD_Y_BED_SIZE)

/************************** AUTOLEVELING / BED PROBE *************************/

    if (PROBE_STYLE == "Inductive") {
       MARLIN["FIX_MOUNTED_PROBE"]                       = true
    }
    else if (PROBE_STYLE == "BLTouch") {
       MARLIN["BLTOUCH"]                                 = true
    }
    else if (PROBE_STYLE == "Conductive") {
       MARLIN["NOZZLE_AS_PROBE"]                         = true
       if (ENABLED("SWITCHING_NOZZLE")) {
          MARLIN["SWITCHING_NOZZLE_LIFT_TO_PROBE"]       = false
       }
    }
    else if (PROBE_STYLE == "Manual") {
       // Use FIX_MOUNTED_PROBE to allow Z offset to work
       MARLIN["FIX_MOUNTED_PROBE"]                       = true
       MARLIN["NOZZLE_TO_PROBE_OFFSET"]                  = [0, 0, 0]
    }

    if (USE_BED_LEVELING) {
        MARLIN["RESTORE_LEVELING_AFTER_G28"]             = true
        MARLIN["Z_MIN_PROBE_REPEATABILITY_TEST"]         = ["Inductive", "BLTouch", "Conductive"].includes(PROBE_STYLE)

        if (PROBE_STYLE == "Conductive") {
            // Conductive Probing

            /* Auto-leveling was introduced on the Mini and TAZ 6.
             * Define probe parameters related to bed leveling,
             * e.g. the washers on the bed. These are confusingly
             * named Z_MIN_PROBE in Marlin. The Z-Home switch
             * is called Z_MIN_ENDSTOP
             */

            if (MINI_BED) {
                STANDARD_LEFT_PROBE_BED_POSITION         =  -3.0
                STANDARD_RIGHT_PROBE_BED_POSITION        = 163.8
                STANDARD_BACK_PROBE_BED_POSITION         = 168.8
                STANDARD_FRONT_PROBE_BED_POSITION        =  -4.0

                if (USE_Z_SCREW) {
                    /* The Gladiola has the probe points spaced further apart than
                     * earlier models. Since Gladiola FW has to work on earlier
                     * printers, we need to add a workaround because G29 hits the
                     * endstops and shifts the coordinate system around.
                     */
                    USE_PRE_GLADIOLA_G29_WORKAROUND      = true
                }
            }
            else if (TAZ_BED) {
                STANDARD_LEFT_PROBE_BED_POSITION         = -10.0
                STANDARD_RIGHT_PROBE_BED_POSITION        = 289.4
                STANDARD_BACK_PROBE_BED_POSITION         = 292.5
                STANDARD_FRONT_PROBE_BED_POSITION        =  -9.0
            }

            MARLIN["AUTO_BED_LEVELING_BILINEAR"]         = true

            MARLIN["MULTIPLE_PROBING"]                   = 2
            MARLIN["Z_PROBE_FEEDRATE_SLOW"]              = 1*60
            MARLIN["Z_PROBE_FEEDRATE_FAST"]              = USE_Z_BELT ? 20*60 : 8*60
            MARLIN["PROBE_OFFSET_ZMIN"]                  = -2
            MARLIN["PROBE_OFFSET_ZMAX"]                  = 5
            MARLIN["Z_CLEARANCE_DEPLOY_PROBE"]           = 5
            MARLIN["Z_PROBE_ERROR_TOLERANCE"]            = 5
            MARLIN["PROBING_MARGIN"]                     = false
            MARLIN["XY_PROBE_FEEDRATE"]                  = 6000
            MARLIN["Z_CLEARANCE_BETWEEN_PROBES"]         = 5

            // Avoid electrical interference when probing (this is a problem on some Minis)
            MARLIN["PROBING_FANS_OFF"]                   = true
            MARLIN["PROBING_STEPPERS_OFF"]               = true

            LEFT_PROBE_BED_POSITION  = Math.max(STANDARD_LEFT_PROBE_BED_POSITION  + TOOLHEAD_LEFT_PROBE_ADJ,  MARLIN["X_MIN_POS"])
            RIGHT_PROBE_BED_POSITION = Math.min(STANDARD_RIGHT_PROBE_BED_POSITION + TOOLHEAD_RIGHT_PROBE_ADJ, MARLIN["X_MAX_POS"])
            BACK_PROBE_BED_POSITION  = Math.min(STANDARD_BACK_PROBE_BED_POSITION  + TOOLHEAD_BACK_PROBE_ADJ,  MARLIN["Y_MAX_POS"])
            FRONT_PROBE_BED_POSITION = Math.max(STANDARD_FRONT_PROBE_BED_POSITION + TOOLHEAD_FRONT_PROBE_ADJ, MARLIN["Y_MIN_POS"])

            // Make sure Marlin allows probe points outside of the bed area

            MARLIN["PROBING_MARGIN_LEFT"]                = LEFT_PROBE_BED_POSITION
            MARLIN["PROBING_MARGIN_RIGHT"]               = STANDARD_X_BED_SIZE - RIGHT_PROBE_BED_POSITION
            MARLIN["PROBING_MARGIN_BACK"]                = STANDARD_Y_BED_SIZE - BACK_PROBE_BED_POSITION
            MARLIN["PROBING_MARGIN_FRONT"]               = FRONT_PROBE_BED_POSITION

            /* Traditionally LulzBot printers have employed a four-point
             * leveling using a 2x2 grid.
             */
            MARLIN["GRID_MAX_POINTS_X"]                  = 2
            MARLIN["GRID_MAX_POINTS_Y"]                  = 2
            if (IS_MINI) {
                /* We can't control the order of probe points exactly, but
                 * this makes the probe start closer to the wiper pad.
                 */
                MARLIN["PROBE_Y_FIRST"]                  = true
                GOTO_1ST_PROBE_POINT = format("G0 X{} Y{}\n", LEFT_PROBE_BED_POSITION, BACK_PROBE_BED_POSITION)
            } else {
                /* Restore the old probe sequence on the TAZ that starts
                 * probing on the washer underneath the wiper pad.
                 */
                MARLIN["END_G29_ON_BACK_LEFT_CORNER"]    = true
                GOTO_1ST_PROBE_POINT = format("G0 X{} Y{}\n", LEFT_PROBE_BED_POSITION, FRONT_PROBE_BED_POSITION)
            }
        } else {
            // General probing grid parameters
            MARLIN["GRID_MAX_POINTS_X"]                  = 5
            MARLIN["GRID_MAX_POINTS_Y"]                  = 5
            MARLIN["UBL_HILBERT_CURVE"]                  = true
            if (USE_REPRAP_LCD_DISPLAY || USE_TOUCH_UI) {
                MARLIN["AUTO_BED_LEVELING_UBL"]          = true
            } else {
                MARLIN["AUTO_BED_LEVELING_BILINEAR"]     = true
            }
            if (PRINTER.includes("SynDaver_")) {
                MARLIN["PROBING_MARGIN"]                 = 0
                MARLIN["MESH_INSET"]                     = 0
            } else {
                MARLIN["PROBING_MARGIN"]                 = 15
                MARLIN["MESH_INSET"]                     = 15
            }
            // BLTouch automatic probing
            GOTO_1ST_PROBE_POINT                         = ""
            if (["Inductive", "BLTouch"].includes(PROBE_STYLE)) {
                // BLTouch Auto-Leveling
                MARLIN["Z_PROBE_FEEDRATE_SLOW"]              = 5*60
                if (PRINTER.includes("Guava_TAZ4")) {
                    MARLIN["XY_PROBE_FEEDRATE"]              = 66*60
                } else {
                    MARLIN["XY_PROBE_FEEDRATE"]              = 300*60
                }
                MARLIN["Z_CLEARANCE_DEPLOY_PROBE"]           = PRINTER.includes("Guava_TAZ4") ? 10 : 15
                MARLIN["Z_CLEARANCE_BETWEEN_PROBES"]         = 5
                MARLIN["Z_SERVO_ANGLES"]                     = [10,90]
                MARLIN["PROBING_FANS_OFF"]                   = true
                MARLIN["BED_LEVELING_COMMANDS"]              = C_STRING("G28\nG29 P1 X0 Y0\nG29 S1")
            }
        }
    }

/************************** MANUAL BED LEVELING **************************/

    if (ENABLED("TOUCH_UI_SYNDAVER_LEVEL")) {
        MANUAL_BED_LEVELING_COMMANDS = (
                "G29 P0\n" +                                  //  Invalidate bed mesh
                "G29 S1\n" +
                "M420 S0\n" +                                 //  Disable mesh compensation
                "G28\n" +                                     //  Home
                "G0 Z5\n" +                                   //  Raise nozzle
                "M0 Ensure the removable build plate is on the machine, and place a sheet of paper on top of it\n" +
                 //  First pass
                "G0 X0 Y180\n" +                              //  Move to back left corner
                "G0 Z0\n" +                                   //  Touch nozzle on bed
                "M0 Adjust back left leveling hand screw\n" +
                "G0 Z5\n" +                                   //  Raise nozzle
                "G0 X180 Y180\n" +                            //  Move to back right corner
                "G0 Z0\n" +                                   //  Touch nozzle on bed
                "M0 Adjust back right leveling hand screw\n" +
                "G0 Z5\n" +                                   //  Raise nozzle
                "G0 X180 Y0\n" +                              //  Move to front right corner
                "G0 Z0\n" +                                   //  Touch nozzle on bed
                "M0 Adjust front right leveling hand screw\n" +
                "G0 Z5\n" +                                   //  Raise nozzle
                "G0 X0 Y0\n" +                                //  Move to front left corner
                "G0 Z0\n" +                                   //  Touch nozzle on bed
                "M0 Adjust front left leveling hand screw\n" +
                "G0 Z5\n" +                                   //  Raise nozzle
                 //  Second pass
                "G0 X0 Y180\n" +                              //  Move to back left corner
                "G0 Z0\n" +                                   //  Touch nozzle on bed
                "M0 Adjust back left leveling hand screw\n" +
                "G0 Z5\n" +                                   //  Raise nozzle
                "G0 X180 Y180\n" +                            //  Move to back right corner
                "G0 Z0\n" +                                   //  Touch nozzle on bed
                "M0 Adjust back right leveling hand screw\n" +
                "G0 Z5\n" +                                   //  Raise nozzle
                "G0 X180 Y0\n" +                              //  Move to front right corner
                "G0 Z0\n" +                                   //  Touch nozzle on bed
                "M0 Adjust front right leveling hand screw\n" +
                "G0 Z5\n" +                                   //  Raise nozzle
                "G0 X0 Y0\n" +                                //  Move to front left corner
                "G0 Z0\n" +                                   //  Touch nozzle on bed
                "M0 Adjust front left leveling hand screw\n" +
                "G0 Z5\n" +                                   //  Raise nozzle
                "G0 X90 Y90\n" +                            //  Move to home position
                "M0 Process complete. You will need a new bed mesh map now."
        )
        MARLIN["MANUAL_BED_LEVELING_COMMANDS"]                 = C_STRING(MANUAL_BED_LEVELING_COMMANDS)
    }

/**************************** X AXIS LEVELING ****************************/

    AXIS_LEVELING_COMMANDS                                   = ""

    if (USE_Z_BELT) {
        XLEVEL_POS                                           = "G0 X150 F9999\n"

        if (USE_DUAL_Z_STEPPERS) {
            MARLIN["Z_STEPPER_AUTO_ALIGN"]                   = true
            //MARLIN["NUM_Z_STEPPER_DRIVERS"]                  = 2
        }
        if (IS_MINI) {
            AXIS_LEVELING_COMMANDS = (
                "G28\n"                                       //  Home Axis
                + XLEVEL_POS +                                //  Move toolhead to the right
                "G0 Z5 F6000\n" +                             //  Move to bottom of printer
                "G91\n" +                                     //  Set relative motion mode
                "M211 S0\n" +                                 //  Turn off soft endstops
                "M400\n" +                                    //  Finish moves
                "M906 Z600\n" +                               //  Lower current to 600mA
                "G0 Z-15 F500\n" +                            //  Skip steppers against lower Z mounts
                "G0 Z5 F500\n" +                              //  Move Z-Axis up a bit
                "M400\n" +                                    //  Finish moves
                "G90\n" +                                     //  Return to absolute mode
                "M906 Z960\n" +                               //  Restore default current
                "M211 S1\n" +                                 //  Turn soft endstops back on
                "G28 Z0\n"                                    //  Rehome to correct coorinate system
            )
        }

        else if (IS_TAZ && MARLIN["Z_HOME_DIR"] == 1) {
             //  On printers that home to the top, it is okay to simply home the Z to level the axis
            AXIS_LEVELING_COMMANDS = (
                XLEVEL_POS +                                  //  Center axis
                "G28 Z0\n"                                    //  Home Axis
            )
        }

        else if (IS_TAZ && MARLIN["Z_HOME_DIR"] == -1 && USE_ARCHIM2) {
             //  Since the printer homes to the bottom, we cannot use a home Z to auto-level
            AXIS_LEVELING_COMMANDS = (
                "G91\n" +                                     //  Set relative motion mode
                "M211 S0\n" +                                 //  Turn off soft endstops
                "M120\n" +                                    //  Turn on hardware endstops
                "M400\n" +                                    //  Finish moves
                "G0 Z400 F6000 U\n" +                         //  Skip steppers against uppers
                "G92 Z" + STANDARD_Z_MAX_POS + "\n" +         //  Set position to Z_MAX
                "G0 Z-5 F500 U\n" +                           //  Move Z-Axis down a bit
                "M400\n" +                                    //  Finish moves
                "G90\n" +                                     //  Return to absolute mode
                "M121\n" +                                    //  Turn off hardware endstops
                "M211 S1\n" +                                 //  Turn soft endstops back on
                "M18 Z\n" +                                   //  Power off stepper to...
                "M17 Z\n"                                     //  ...forget current position
            )
            MARLIN["NO_MOTION_BEFORE_HOMING_WORKAROUND"]    = true
            MARLIN["ENDSTOP_INTERRUPTS_FEATURE"]            = true
        }

        if (AXIS_LEVELING_COMMANDS) {
            MARLIN["AXIS_LEVELING_COMMANDS"]                 = C_STRING(
              "M117 Leveling X Axis\n"                        //  Set LCD status
              + AXIS_LEVELING_COMMANDS +
              "M117 Leveling done.\n"                         //  Set LCD status
            )
        }
    }

/****************************** STARTUP COMMANDS ****************************/

    if (USE_Z_BELT) {
        if (IS_MINI) {
          MARLIN["STARTUP_COMMANDS"]                       = C_STRING("M17 Z")
        }
        else if (PRINTER.includes("SynDaver_Axi_2")) {
          MARLIN["STARTUP_COMMANDS"]                       = C_STRING("M17 Z\nG29 L1\nM280 P0 S60")
        }
        else if (PRINTER.includes("SynDaver_Axi")) {
          MARLIN["STARTUP_COMMANDS"]                       = C_STRING("G29 L1\n" + AXIS_LEVELING_COMMANDS + "M280 P0 S60\nM117 SynDaver Axi Ready")
        }
        else {
          MARLIN["STARTUP_COMMANDS"]                       = C_STRING(AXIS_LEVELING_COMMANDS)
        }
    }

    if (PRINTER.includes("SynDaver_Level")) {
        MARLIN["STARTUP_COMMANDS"]                         = C_STRING("M141 S100\nG29 L1")
    }

/******************************* EXTRA SCRIPTS *******************************/

    if (PRINTER.includes("SynDaver_Level")) {
        FeedrateStr = " F" + MARLIN["HOMING_FEEDRATE_MM_M"][2]
        MARLIN["MOVE_TO_MAINT_COMMANDS"]   = C_STRING("G28 O\nG0 X90 Y90 Z180")
        MARLIN["MOVE_TO_FIL_CHG_COMMANDS"] = C_STRING("G28 O\nG0 X90 Y90 Z50")
        MARLIN["MOVE_TO_Z_MIN_COMMANDS"]   = C_STRING("G28 O\nG0 Z" + (MARLIN["Z_MIN_POS"] + 5) + FeedrateStr)
        MARLIN["MOVE_TO_Z_MAX_COMMANDS"]   = C_STRING("G28 O\nG0 Z" + (MARLIN["Z_MAX_POS"] - 5) + FeedrateStr)
    }

/*************** AUTO-CALIBRATION (BACKLASH AND NOZZLE OFFSET) ***************/

    if ((USE_CALIBRATION_CUBE || CALIBRATE_ON_WASHER) && PROBE_STYLE == "Conductive") {
        MARLIN["CALIBRATION_GCODE"]                      = true
        MARLIN["CALIBRATION_REPORTING"]                  = true

        if (MARLIN["EXTRUDERS"] > 1) {
            RESTORE_NOZZLE_OFFSET = format("M218 T1 X{} Y{} Z{}\n", T1_OFFSET_X, T1_OFFSET_Y, T1_OFFSET_Z)
        } else {
            RESTORE_NOZZLE_OFFSET = ""
        }

        CALIBRATION_SCRIPT_PRE = (
            "M117 Starting Auto-Calibration\n" +          //  Status message
            "T0\n" +                                      //  Switch to first nozzle
            RESTORE_NOZZLE_OFFSET +                       //  Restore default nozzle offset
            AXIS_LEVELING_COMMANDS +                      //  Level X-Axis
            "G28\n" +                                     //  Auto-Home
            "G12\n" +                                     //  Wipe the nozzles
            "M117 Calibrating...\n"                       //  Status message
        )

        CALIBRATION_SCRIPT_POST = (
            "M500\n" +                                    //  Save settings
            "M117 Calibration data saved"                 //  Status message
        )

        MARLIN["CALIBRATION_SCRIPT_PRE"]                 = C_STRING(CALIBRATION_SCRIPT_PRE)
        MARLIN["CALIBRATION_SCRIPT_POST"]                = C_STRING(CALIBRATION_SCRIPT_POST)

        if (IS_MINI) {
            if (CALIBRATE_ON_WASHER == "Front Left") {
                MARLIN["CALIBRATION_OBJECT_DIMENSIONS"]  = [22.0,   22.0,  1.5] // mm
                MARLIN["CALIBRATION_OBJECT_CENTER"]      = [-8.9,   -7.6,  0  ] // mm
                MARLIN["CALIBRATION_MEASURE_LEFT"]       = false
                MARLIN["CALIBRATION_MEASURE_RIGHT"]      = true
                MARLIN["CALIBRATION_MEASURE_FRONT"]      = false
                MARLIN["CALIBRATION_MEASURE_BACK"]       = true
            }
            else if (CALIBRATE_ON_WASHER == "Front Right") {
                MARLIN["CALIBRATION_OBJECT_DIMENSIONS"]  = [ 22.0,   22.0, 1.5] // mm
                MARLIN["CALIBRATION_OBJECT_CENTER"]      = [169.5,   -7.6, 0  ] // mm
                MARLIN["CALIBRATION_MEASURE_LEFT"]       = true
                MARLIN["CALIBRATION_MEASURE_RIGHT"]      = false
                MARLIN["CALIBRATION_MEASURE_FRONT"]      = false
                MARLIN["CALIBRATION_MEASURE_BACK"]       = true
            }
            else if (CALIBRATE_ON_WASHER == "Back Left") {
                MARLIN["CALIBRATION_OBJECT_DIMENSIONS"]  = [ 22.0,   22.0, 1.5] // mm
                MARLIN["CALIBRATION_OBJECT_CENTER"]      = [ -8.9,  171.3, 0  ] // mm
                MARLIN["CALIBRATION_MEASURE_LEFT"]       = false
                MARLIN["CALIBRATION_MEASURE_RIGHT"]      = true
                MARLIN["CALIBRATION_MEASURE_FRONT"]      = true
                MARLIN["CALIBRATION_MEASURE_BACK"]       = false
            }
            else if (CALIBRATE_ON_WASHER == "Back Right") {
                MARLIN["CALIBRATION_OBJECT_DIMENSIONS"]  = [ 22.0,   22.0, 1.5] // mm
                MARLIN["CALIBRATION_OBJECT_CENTER"]      = [169.5,  171.3, 0  ] // mm
                MARLIN["CALIBRATION_MEASURE_LEFT"]       = true
                MARLIN["CALIBRATION_MEASURE_RIGHT"]      = false
                MARLIN["CALIBRATION_MEASURE_FRONT"]      = true
                MARLIN["CALIBRATION_MEASURE_BACK"]       = false
            }
        }
        else if (IS_TAZ && USE_Z_BELT && USE_CALIBRATION_CUBE) {
            MARLIN["CALIBRATION_OBJECT_DIMENSIONS"]      = [ 10.0,  10.0,  10.0] // mm
            MARLIN["CALIBRATION_OBJECT_CENTER"]          = [ 261.0, -22.0, -2.0] // mm

            MARLIN["CALIBRATION_MEASURE_RIGHT"]          = true
            // Only the TAZ Pro can reach the front of the calibration cube
            MARLIN["CALIBRATION_MEASURE_FRONT"]          = TOOLHEAD.includes("Quiver_DualExtruder")
            MARLIN["CALIBRATION_MEASURE_LEFT"]           = true
            MARLIN["CALIBRATION_MEASURE_BACK"]           = true
        }
    }

    MARLIN["HOTEND_OFFSET_X"]                            = [0.0, T1_OFFSET_X]
    MARLIN["HOTEND_OFFSET_Y"]                            = [0.0, T1_OFFSET_Y]
    MARLIN["HOTEND_OFFSET_Z"]                            = [0.0, T1_OFFSET_Z]

/*************************** FILAMENT CONFIGURATION **************************/

    MARLIN["NO_VOLUMETRICS"]                             = true

    /* Enable linear advance, but leave K at zero so
     * it is not used unless the user requests it.
     */
    MARLIN["LIN_ADVANCE"]                                = true
    if (MARLIN["EXTRUDERS"] > 1 && ENABLED("DISTINCT_E_FACTORS")) {
        MARLIN["ADVANCE_K"]                              = [0.0,0.0]
    } else {
        MARLIN["ADVANCE_K"]                              = 0.0
    }

    if (ENABLED("FILAMENT_RUNOUT_SENSOR")) {
        MARLIN["NUM_RUNOUT_SENSORS"]                     = MARLIN["EXTRUDERS"]
        if (USE_TOUCH_UI) {
            MARLIN["FILAMENT_RUNOUT_SCRIPT"]             = C_STRING("M25\n")
        }
        MARLIN["FILAMENT_RUNOUT_DISTANCE_MM"]            = PRINTER.includes("SynDaver") ? 0 : 14
        if (!["Quiver_TAZPro", "SynDaver_Axi", "SynDaver_Axi_2", "SynDaver_Level", "SynDaver_LevelUp"].includes(PRINTER)) {
            MARLIN["FIL_RUNOUT_ENABLED_DEFAULT"]         = "false"
        }
        MARLIN["ACTION_ON_FILAMENT_RUNOUT"]              = C_STRING("pause: filament_runout")
        MARLIN["TOUCH_UI_FILAMENT_RUNOUT_WORKAROUNDS"]   = USE_TOUCH_UI
        MARLIN["PAUSE_REHEAT_FAST_RESUME"]               = true
        MARLIN["CURA_LE_RUNOUT_HANDLING_WORKAROUND"]     = true
    }

/***************************** MOTOR DRIVER TYPE *****************************/

    if (USE_BTT_002) {
        DRIVER_TYPE                                      = 'TMC2209'
    }
    else if (USE_EINSY_RETRO || USE_EINSY_RAMBO || USE_ARCHIM2) {
        DRIVER_TYPE                                      = 'TMC2130'
    }
    else {
        DRIVER_TYPE                                      = 'A4988'
    }

    MARLIN["MINIMUM_STEPPER_PULSE_NS"]                   =  1000

    MARLIN["X_DRIVER_TYPE"]                              =  DRIVER_TYPE
    MARLIN["Y_DRIVER_TYPE"]                              =  DRIVER_TYPE
    MARLIN["Z_DRIVER_TYPE"]                              =  DRIVER_TYPE
    if (USE_DUAL_Z_STEPPERS) {
        MARLIN["Z2_DRIVER_TYPE"]                         =  DRIVER_TYPE
    }
    MARLIN["E0_DRIVER_TYPE"]                             =  DRIVER_TYPE
    if (MARLIN["EXTRUDERS"] > 1) {
        MARLIN["E1_DRIVER_TYPE"]                         =  DRIVER_TYPE
    }

/*********************** TRINAMIC DRIVER CONFIGURATION ***********************/

    if (USE_BTT_002 || USE_EINSY_RETRO || USE_EINSY_RAMBO || USE_ARCHIM2) {
        MARLIN["TMC_DEBUG"]                              = true
        MARLIN["MONITOR_DRIVER_STATUS"]                  = true
        MARLIN["STOP_ON_ERROR"]                          = false

        if (USE_BTT_002) {
            RSENSE                                       = 0.11
        } else {
            RSENSE                                       = 0.12
        }

        MARLIN["X_RSENSE"]                               = RSENSE
        MARLIN["Y_RSENSE"]                               = RSENSE
        MARLIN["Z_RSENSE"]                               = RSENSE
        if (USE_DUAL_Z_STEPPERS) {
          MARLIN["Z2_RSENSE"]                            = RSENSE
        }
        MARLIN["E0_RSENSE"]                              = RSENSE
        if (MARLIN["EXTRUDERS"] > 1) {
            MARLIN["E1_RSENSE"]                          = RSENSE
        }

        MARLIN["HOLD_MULTIPLIER"]                        = 0.5

        if (USE_ARCHIM2) {
            MARLIN["TMC_USE_SW_SPI"]                     = true
            SHAFT_DIR                                    = 0
        }
        else if (USE_EINSY_RETRO || USE_EINSY_RAMBO || USE_BTT_002) {
            SHAFT_DIR                                    = 1 // Match direction to the Mini-Rambo
        }

        if (ENABLED("HYBRID_THRESHOLD")) {
            MARLIN["Y_HYBRID_THRESHOLD"]                 = 72
            MARLIN["X_HYBRID_THRESHOLD"]                 = 72
        }

        // { <off_time[1..15]>, <hysteresis_end[-3..12]>, hysteresis_start[1..8] }
        if (USE_BTT_002 || PRINTER.includes("Guava_TAZ4")) {
            MARLIN["CHOPPER_TIMING"]                     = "CHOPPER_DEFAULT_24V"
        }
        else {
            MARLIN["CHOPPER_TIMING"]                     = [ 3, -2, 6 ]
        }

        function TMC_INIT(st) {
            return (
                format("st.shaft({});", SHAFT_DIR) +
                // Enable coolstep
                "st.semin(1);" +
                "st.semax(3);"
            ).replace(/st\./g, st + ".")
        }

        // Low-noise stepper settings for Mini 2

        function TMC_LOW_NOISE(st) {
            if (IS_MINI && !USE_BTT_002) {
                return (
                    "st.toff(1);" +  // TOFF   = [1..15]
                    "st.hstrt(0);" + // HSTART = [0..7]
                    "st.hend(0);" +  // HEND   = [0..15]
                    "st.tbl(1);"     // TBL    = [0..3]
                ).replace(/st\./g, st + ".")
            } else {
                return ""
            }
        }

        //  X axis driver temperature tuning notes over a 10 minute print:
        //   - TOFF caused the greatest effect on driver temperature (~40C) and needs
        //     to be at 1 to keep the drivers from overheating (was tested at 1-3)
        //   - TBL can be either 0, 1 or 2, but 3 will cause overheating and 1 appears
        //     to run the coolest.
        //   - Setting HSTRT higher than 5 cause the drivers to warm up.
        //   - Setting HSTRT lower than 3 causes the motor to stall.
        //   - Setting HEND higher than 1 causes drivers to overheat.

        function TMC_LOW_HEAT(st) {
            if (IS_MINI && !USE_BTT_002) {
                return (
                    "st.toff(1);"  + //  TOFF   = [1..15]
                    "st.hstrt(4);" + //  HSTART = [0..7]
                    "st.hend(0);"  + //  HEND   = [0..15]
                    "st.tbl(1);"     //  TBL    = [0..3]
                ).replace(/st\./g, st + ".")
            }
            else {
                return ""
            }
        }

        MARLIN["TMC_ADV"] = ('{' +
                TMC_LOW_HEAT ("stepperX") +
                TMC_LOW_HEAT ("stepperY") +
                TMC_LOW_NOISE("stepperZ") +
                TMC_LOW_NOISE("stepperE0") +
                TMC_INIT("stepperX") +
                TMC_INIT("stepperY") +
                TMC_INIT("stepperZ") +
                (USE_DUAL_Z_STEPPERS ? TMC_INIT("stepperZ2") : "") +
                TMC_INIT("stepperE0") +
                (MARLIN["EXTRUDERS"] > 1 ? TMC_INIT("stepperE1") : "") +
            '}')

        /* If LIN_ADVANCE enabled, then disable STEALTHCHOP_E, because of the
         * following bug:
         *
         * https://github.com/MarlinFirmware/Marlin/issues/17944
         */
        if (ENABLED("LIN_ADVANCE")) {
            MARLIN["STEALTHCHOP_E"]                      = false
        }
    }

/************************* TRINAMIC SENSORLESS HOMING *************************/

    if (ENABLED("SENSORLESS_HOMING")) {
        if (IS_TAZ) {
            MARLIN["X_STALL_SENSITIVITY"]                = 6
            MARLIN["Y_STALL_SENSITIVITY"]                = 5
        }
        else if (IS_MINI) {
            MARLIN["X_STALL_SENSITIVITY"]                = 4
            MARLIN["Y_STALL_SENSITIVITY"]                = 4
        }

        MARLIN["SENSORLESS_BACKOFF_MM"]                  = [5, 5, 0]

        MARLIN["USE_XMIN_PLUG"]                          = true // Uses Stallguard
        MARLIN["USE_YMAX_PLUG"]                          = true // Uses Stallguard
        MARLIN["USE_ZMIN_PLUG"]                          = true
        MARLIN["USE_ZMAX_PLUG"]                          = true

        MARLIN["X_MIN_ENDSTOP_HIT_STATE"]                = NORMALLY_OPEN_ENDSTOP
        MARLIN["Y_MAX_ENDSTOP_HIT_STATE"]                = NORMALLY_OPEN_ENDSTOP

        // Quickhome does not work with sensorless homing
        MARLIN["QUICK_HOME"]                             = false
    }

/********************* ADVANCED PAUSE / FILAMENT CHANGE **********************/

    if (USE_REPRAP_LCD_DISPLAY || USE_TOUCH_UI) {
        MARLIN["FILAMENT_CHANGE_FAST_LOAD_FEEDRATE"]     = MANUAL_FEEDRATE_E
        //MARLIN["ADVANCED_PAUSE_PURGE_LENGTH"]            = 0  //  Manual purge
        MARLIN["ADVANCED_PAUSE_PURGE_FEEDRATE"]          = MANUAL_FEEDRATE_E
        MARLIN["PAUSE_PARK_RETRACT_FEEDRATE"]            = 10  //  mm/s
        MARLIN["PARK_HEAD_ON_PAUSE"]                     = true
        MARLIN["FILAMENT_LOAD_UNLOAD_GCODES"]            = USE_REPRAP_LCD_DISPLAY
        MARLIN["START_PRINT_TIMER_ON_G26"]               = USE_TOUCH_UI

        /* In order to prevent jams on the Aero toolheads,
         * do a purge prior to unload
         */
        if (TOOLHEAD_BLOCK.includes("Aero") || TOOLHEAD_BLOCK.includes("RTD_Pt1000")) {
            MARLIN["FILAMENT_UNLOAD_PURGE_RETRACT"]      = 0
            MARLIN["FILAMENT_UNLOAD_PURGE_DELAY"]        = 0
            MARLIN["FILAMENT_UNLOAD_PURGE_LENGTH"]       = 6
        }
        else {
            MARLIN["FILAMENT_UNLOAD_PURGE_RETRACT"]      = 0
            MARLIN["FILAMENT_UNLOAD_PURGE_DELAY"]        = 0
            MARLIN["FILAMENT_UNLOAD_PURGE_LENGTH"]       = 0
        }
    }

    MARLIN["NOZZLE_PARK_FEATURE"]                        = true
    MARLIN["ADVANCED_PAUSE_FEATURE"]                     = true
    // For TAZ, match the purge location of the v3 dual so a single tray can be used.
    MARLIN["NOZZLE_PARK_POINT"]                          = [ IS_MINI ? 10 : 100, MARLIN["Y_MAX_POS"] - 10, 20 ]

    if (MARLIN["SDSUPPORT"]) {
        if (PRINTER.includes("SynDaver_Level")) {
            EVENT_GCODE_SD_ABORT = "G91\nG0 Z5 F3000\nG90\nG0 X90 Y185\nM141 S30"
        }
        else if (IS_MINI) {
            EVENT_GCODE_SD_ABORT = "G28 Z\nG0 X80 Y190 F3000"
        }

        else if (PRINTER.includes("Juniper_TAZ5") || PRINTER.includes("Guava_TAZ4")) {
            EVENT_GCODE_SD_ABORT = "G0 X170 Y290 F3000"
        }

        else if (IS_TAZ) {
            EVENT_GCODE_SD_ABORT = "G91\nG0 Z15 F600\nG90\nG0 X170 Y290 F3000"
        }

        MARLIN["EVENT_GCODE_SD_ABORT"]                   = C_STRING(EVENT_GCODE_SD_ABORT)
    }

    if (PRINTER.includes("SynDaver_Level")) {
        MARLIN["EXTRUDE_MAXLENGTH"]                      = 900
    }

/********************************* WIPER PAD *********************************/

    // Nozzle wiping points (varies by toolhead, as the nozzle position varies)
    if (USE_BED_LEVELING) {
        if (MINI_BED) {
            // Mini has a horizontal wiping pad on the back of the bed
            LEFT_WIPE_X1                                 =  45
            LEFT_WIPE_X2                                 = 115
            LEFT_WIPE_Y1                                 = 175
            LEFT_WIPE_Y2                                 = 175
            if (USE_Z_BELT) {
                LEFT_WIPE_Z                              =   1
            } else {
                /* Wipe very deep because Minis older than
                 * Gladiolas are a few milimeters taller
                 */
                LEFT_WIPE_Z                              = -0.5
            }
        }
        else if (TAZ_BED && TOOLHEAD.includes("Yellowfin_DualExtruderV3")) {
            // When using a Yellowfin toolhead, a wider wiping pad will be installed
            LEFT_WIPE_X1                                 = -26
            LEFT_WIPE_X2                                 = -26
            LEFT_WIPE_Y1                                 =  95
            LEFT_WIPE_Y2                                 =  25
            LEFT_WIPE_Z                                  =  1
            RIGHT_WIPE_X1                                = LEFT_WIPE_X1
            RIGHT_WIPE_X2                                = LEFT_WIPE_X2
            RIGHT_WIPE_Y1                                = LEFT_WIPE_Y1
            RIGHT_WIPE_Y2                                = LEFT_WIPE_Y2
            RIGHT_WIPE_Z                                 = LEFT_WIPE_Z
        }
        else if (TAZ_BED) {
            // TAZ has a vertical wiping pad on the left side of the bed
            LEFT_WIPE_X1                                 = -17
            LEFT_WIPE_X2                                 = -17
            LEFT_WIPE_Y1                                 =  95
            if (["Javelin_DualExtruderV2", "Longfin_FlexyDually"].includes(TOOLHEAD)) {
                // These dual toolheads have nozzles front and back, so the wiping location is shortened in Y
                LEFT_WIPE_Y2                             =  73
            }
            else {
                LEFT_WIPE_Y2                             =  25
            }
            if (PRINTER.includes("SynDaver_Axi")) {
                LEFT_WIPE_Z                              =   0
            }
            else {
                LEFT_WIPE_Z                              =   1
            }

            if (PRINTER.includes("Quiver_TAZPro")) {
                // The Quiver has an wipe pad on the right side of the bed.
                RIGHT_WIPE_X1                            = 297
                RIGHT_WIPE_X2                            = 297
                RIGHT_WIPE_Y1                            =  95
                RIGHT_WIPE_Y2                            =  25
                RIGHT_WIPE_Z                             =   1
            } else {
                RIGHT_WIPE_X1                            = LEFT_WIPE_X1
                RIGHT_WIPE_X2                            = LEFT_WIPE_X2
                RIGHT_WIPE_Y1                            = LEFT_WIPE_Y1
                RIGHT_WIPE_Y2                            = LEFT_WIPE_Y2
                RIGHT_WIPE_Z                             = LEFT_WIPE_Z
            }
            LEFT_WIPE_Y2 -= TOOLHEAD_WIPE_Y2_ADJ // Adjustments for legacy dual
        }

        function WIPE_GCODE(x1,y1,x2,y2,z,temp_command) {
            return (
                format("G1 X{} Y{} Z10 F4000\n",x2,y2)    //  Move to pad while heating
                + temp_command +
                format("G1 Z{}\n",z) +                    //  Push nozzle into wiper
                "M114\n" +                                //  This seems to be required for the last command to run. Bug in Marlin?
                format("G1 X{} Y{}\n",x2,y2) +            //  Slow wipe
                format("G1 X{} Y{}\n",x1,y1) +            //  Slow wipe
                format("G1 X{} Y{}\n",x2,y2) +            //  Slow wipe
                format("G1 X{} Y{}\n",x1,y1) +            //  Slow wipe
                format("G1 X{} Y{}\n",x2,y2) +            //  Slow wipe
                format("G1 X{} Y{}\n",x1,y1) +            //  Slow wipe
                format("G1 X{} Y{}\n",x2,y2) +            //  Slow wipe
                format("G1 X{} Y{}\n",x1,y1) +            //  Slow wipe
                format("G1 X{} Y{}\n",x2,y2) +            //  Slow wipe
                format("G1 X{} Y{}\n",x1,y1) +            //  Slow wipe
                format("G1 X{} Y{}\n",x2,y2) +            //  Slow wipe
                format("G1 X{} Y{}\n",x1,y1) +            //  Slow wipe
                "G1 Z15\n" +                              //  Raise nozzle
                "M400\n"                                  //  Wait for motion to finish
            )
        }

        function LEFT_WIPE_GCODE(temp_command) {
            return WIPE_GCODE(LEFT_WIPE_X1, LEFT_WIPE_Y1, LEFT_WIPE_X2, LEFT_WIPE_Y2, LEFT_WIPE_Z, temp_command)
        }

        function RIGHT_WIPE_GCODE(temp_command) {
            return WIPE_GCODE(RIGHT_WIPE_X1, RIGHT_WIPE_Y1, RIGHT_WIPE_X2, RIGHT_WIPE_Y2, RIGHT_WIPE_Z, temp_command)
        }

        if (PRINTER.includes("Quiver_TAZPro") && MARLIN["EXTRUDERS"] == 1) {
            MARLIN["NOZZLE_CLEAN_START_POINT"]           = [[RIGHT_WIPE_X1, RIGHT_WIPE_Y1, RIGHT_WIPE_Z]]
            MARLIN["NOZZLE_CLEAN_END_POINT"]             = [[RIGHT_WIPE_X2, RIGHT_WIPE_Y2, RIGHT_WIPE_Z]]
        }
        if (MARLIN["EXTRUDERS"] == 2) {
            MARLIN["NOZZLE_CLEAN_START_POINT"]           = [[LEFT_WIPE_X1, LEFT_WIPE_Y1, LEFT_WIPE_Z],[RIGHT_WIPE_X1, RIGHT_WIPE_Y1, RIGHT_WIPE_Z]]
            MARLIN["NOZZLE_CLEAN_END_POINT"]             = [[LEFT_WIPE_X2, LEFT_WIPE_Y2, LEFT_WIPE_Z],[RIGHT_WIPE_X2, RIGHT_WIPE_Y2, RIGHT_WIPE_Z]]
        }
        else {
            MARLIN["NOZZLE_CLEAN_START_POINT"]           = [[LEFT_WIPE_X1, LEFT_WIPE_Y1, LEFT_WIPE_Z]]
            MARLIN["NOZZLE_CLEAN_END_POINT"]             = [[LEFT_WIPE_X2, LEFT_WIPE_Y2, LEFT_WIPE_Z]]
        }
    }

/******************************** CLEAN NOZZLE *******************************/

    if (USE_BED_LEVELING) {
        MARLIN["NOZZLE_CLEAN_FEATURE"]                   = true

        if (MARLIN["EXTRUDERS"] == 1) {
            WIPE_HEAT_TEMP                               = "M104 S170\n"  //  Preheat to wipe temp
            WIPE_WAIT_TEMP                               = "M109 R170\n"  //  Wait for wipe temp
            WIPE_DONE_TEMP                               = "M109 R160\n"  //  Drop to probe temp
        }
        else {
            WIPE_HEAT_TEMP                               = "M104 S170 T0\nM104 S170 T1\n"  //  Preheat to wipe temp
            WIPE_WAIT_TEMP                               = "M109 R170 T0\nM109 R170 T1\n"  //  Wait for wipe temp
            WIPE_DONE_TEMP                               = "M109 R160 T0\nM109 R160 T1\n"  //  Wait for probe temp
        }

        if (PRINTER.includes("Quiver_TAZPro") && MARLIN["EXTRUDERS"] == 1) {
            // When using a single toolhead on Quiver, wipe on the right pad.
            REWIPE_E0                                    = RIGHT_WIPE_GCODE(WIPE_WAIT_TEMP)
        } else {
            REWIPE_E0                                    = "T0\n" + LEFT_WIPE_GCODE(WIPE_WAIT_TEMP)
        }

        if (PRINTER.includes("Quiver_TAZPro") && TOOLHEAD == "Quiver_DualExtruder") {
            REWIPE_E1 = (
                "G0 X150 F5000\n" +                       //  Move over to switch extruders
                "T1\n" +                                  //  Switch to second extruder
                  RIGHT_WIPE_GCODE(WIPE_WAIT_TEMP) +      //  Wipe on the rightmost pad
                "M106 S255 \n" +                          //  Turn on fan to blow away fuzzies
                "G0 X150 F5000\n" +                       //  Move over to switch extruders
                "T0\n"                                    //  Switch to first extruder
            )
        }
        else {
            REWIPE_E1 = ""
        }

        WIPE_SEQUENCE_COMMANDS = (
            "M117 Hot end heating...\n"                   //  Status message
            + WIPE_HEAT_TEMP +
            "G28 O1\n" +                                  //  Home if needed
            "M117 Wiping nozzle\n" +                      //  Status message
              REWIPE_E0 +                                 //  Wipe first extruder
              REWIPE_E1 +                                 //  Wipe second extruder
            "M106 S255\n" +                               //  Turn on fan to blow away fuzzies
              GOTO_1ST_PROBE_POINT +                      //  Move to probe corner while blowing
              WIPE_DONE_TEMP +                            //  Drop to probe temp
            "M107\n"                                      //  Turn off fan
        )
        MARLIN["WIPE_SEQUENCE_COMMANDS"]                 = C_STRING(WIPE_SEQUENCE_COMMANDS)
    }

/******************************** PROBE REWIPE *******************************/

    if (USE_BED_LEVELING && PROBE_STYLE == "Conductive") {
        MARLIN["G29_RETRY_AND_RECOVER"]                  = true
        MARLIN["G29_MAX_RETRIES"]                        = 2
        MARLIN["G29_HALT_ON_FAILURE"]                    = true

        MARLIN["NOZZLE_CLEAN_GOBACK"]                    = false

        // Limit on pushing into the bed
        if (IS_TAZ) {
            MARLIN["Z_PROBE_LOW_POINT"]                  = -2
        }
        else if (IS_MINI) {
            MARLIN["Z_PROBE_LOW_POINT"]                  = -5
        }

        if (USE_Z_BELT) {
            G29_RECOVER_COMMANDS = (
                WIPE_HEAT_TEMP +                          //  Preheat extruders
                AXIS_LEVELING_COMMANDS +                  //  Level X axis
                "G28\n" +                                 //  Rehome
                "G12\n" +                                 //  Perform wipe sequence
                "M109 R160\n" +                           //  Setting probing temperature
                "M400\n" +                                //  Wait for motion to finish
                "M117 Probing bed"                        //  Status message
            )
        }

        else if (USE_PRE_GLADIOLA_G29_WORKAROUND) {
            G29_RECOVER_COMMANDS = (
                "M121\n" +                                //  Turn off endstops so we can move
                "G0 Z10\n" +                              //  Raise nozzle
                "G28 X0 Y0\n" +                           //  G29 on older minis shifts the coordinate system
                "G12\n" +                                 //  Perform wipe sequence
                "M109 R160\n" +                           //  Setting probing temperature
                "M400\n" +                                //  Wait for motion to finish
                "M117 Probing bed"                        //  Status message
            )
        }
        else {
            G29_RECOVER_COMMANDS = (
                "G0 Z10\n" +                              //  Raise nozzle
                "G12\n" +                                 //  Perform wipe sequence
                "M109 R160\n" +                           //  Set probing temperature
                "M400\n" +                                //  Wait for motion to finish
                "M117 Probing bed"                        //  Status message
            )
        }

        G29_FAILURE_COMMANDS = (
                "M117 Bed leveling failed.\n" +           //  Status message
                "G0 Z10\n" +                              //  Raise head
                "G0 E0\n" +                               //  Prime filament
                "M300 P25 S880\n" +                       //  Play tone
                "M300 P50 S0\n" +                         //  Silence
                "M300 P25 S880\n" +                       //  Play tone
                "M300 P50 S0\n" +                         //  Silence
                "M300 P25 S880\n" +                      //  Play tone
                "G4 S1"                                   //  Dwell to allow sound to end
            )

        G29_SUCCESS_COMMANDS = (
                "M117 Probe successful\n"                 //  Status message
            )

        MARLIN["G29_FAILURE_COMMANDS"]                   = C_STRING(G29_FAILURE_COMMANDS)
        MARLIN["G29_RECOVER_COMMANDS"]                   = C_STRING(G29_RECOVER_COMMANDS)
        MARLIN["G29_SUCCESS_COMMANDS"]                   = C_STRING(G29_SUCCESS_COMMANDS)
    }

/*************************** BACKLASH COMPENSATION ***************************/

    if (MARLIN["BACKLASH_COMPENSATION"]) {
        MARLIN["BACKLASH_SMOOTHING_MM"]                  = 3
        MARLIN["BACKLASH_GCODE"]                         = true

        if (IS_MINI) {
            MARLIN["MEASURE_BACKLASH_WHEN_PROBING"]      = true
        } else {
            MARLIN["MEASURE_BACKLASH_WHEN_PROBING"]      = false
        }

        if (PRINTER.includes("Quiver_TAZPro")) {
            MARLIN["BACKLASH_CORRECTION"]                = 1.0
            MARLIN["BACKLASH_DISTANCE_MM"]               = [ 0.252, 0.183, 0.075 ]
        } else {
            MARLIN["BACKLASH_CORRECTION"]                = 0.0
            MARLIN["BACKLASH_DISTANCE_MM"]               = [ 0, 0, 0 ]
        }
    }
    
    if (USE_ARCHIM2) {
        MARLIN["INPUT_SHAPING_X"]                        = true
        MARLIN["INPUT_SHAPING_Y"]                        = true
    }

/******************************* MOTOR CURRENTS ******************************/

    // Values for XYZ vary by printer model, values for E vary by toolhead.

    if (IS_MINI) {
        if (PRINTER.includes("SynDaver_Level")) {
            // Make the Sanyo motors run quieter
            MOTOR_CURRENT_X                              = 600  //  mA
            MOTOR_CURRENT_Y                              = 600  //  mA
            MOTOR_CURRENT_Z                              = 600  //  mA
        }
        else if (USE_Z_BELT || USE_EINSY_RETRO || USE_EINSY_RAMBO) {
            /* These values specify the maximum current, but actual
             * currents may be lower when used with COOLCONF
             */
            MOTOR_CURRENT_X                              = 920  //  mA
            MOTOR_CURRENT_Y                              = 920  //  mA
            MOTOR_CURRENT_Z                              = 960  //  mA
        }
        else if (USE_Z_SCREW) {
            MOTOR_CURRENT_XY                             = 1300  //  mA
            MOTOR_CURRENT_Z                              = 1630  //  mA
        }
    }
    else if (IS_TAZ) {
        if (PRINTER.includes("SynDaver_Axi_2")) {
             //  Make the Sanyo motors run quieter
            MOTOR_CURRENT_X                              = 600  //  mA
            MOTOR_CURRENT_Y                              = 600  //  mA
            MOTOR_CURRENT_Z                              = 1175  //  mA
        }
        else if (USE_ARCHIM2) {
             //  These values specify the maximum current, but actual
             //  currents may be lower when used with COOLCONF
            MOTOR_CURRENT_X                              = 975  //  mA
            MOTOR_CURRENT_Y                              = 975  //  mA
            MOTOR_CURRENT_Z                              = 975  //  mA
        }
        else {
             //  The RAMBO boards run a bit hot and should have their
             //  currents no higher than 950mA on X and Y.
            MOTOR_CURRENT_X                              = 950  //  mA
            MOTOR_CURRENT_Y                              = 950  //  mA
            if (USE_Z_BELT) {
                MOTOR_CURRENT_Z                          = 975  //  mA
            }
            else if (PRINTER.includes("Juniper_TAZ5") || PRINTER.includes("Guava_TAZ4")) {
                MOTOR_CURRENT_Z                          = 1275  //  mA
            }
            else if (USE_Z_SCREW) {
                MOTOR_CURRENT_Z                          = 1075  //  mA
            }
        }
    }

    if (USE_EINSY_RETRO || USE_EINSY_RAMBO || USE_ARCHIM2) {
        /* Neither define LULZBOT_PWM_MOTOR_CURRENT nor LULZBOT_DIGIPOT_MOTOR_CURRENT,
         * as the current is set in Configuration_adv.h under the HAVE_TMC2130 block
         */

        if (MOTOR_CURRENT_XY) {
            MARLIN["X_CURRENT"]                          = MOTOR_CURRENT_XY
            MARLIN["Y_CURRENT"]                          = MOTOR_CURRENT_XY
        }
        else {
            MARLIN["X_CURRENT"]                          = MOTOR_CURRENT_X
            MARLIN["Y_CURRENT"]                          = MOTOR_CURRENT_Y
        }

        MARLIN["Z_CURRENT"]                              = MOTOR_CURRENT_Z
        if (USE_DUAL_Z_STEPPERS) {
            MARLIN["Z2_CURRENT"]                         = MOTOR_CURRENT_Z
        }
        if (MARLIN["EXTRUDERS"] == 1) {
            MARLIN["E0_CURRENT"]                         = MOTOR_CURRENT_E
        }
        else {
            MARLIN["E0_CURRENT"]                         = MOTOR_CURRENT_E0
            MARLIN["E1_CURRENT"]                         = MOTOR_CURRENT_E1
        }
    }
    else if (IS_MINI) {
            MARLIN["PWM_MOTOR_CURRENT"] = [
                MOTOR_CURRENT_XY,
                MOTOR_CURRENT_Z,
                MOTOR_CURRENT_E
            ]
    }
    else if (IS_TAZ) {
        // Values 0-255 (RAMBO 135 = ~0.75A, 185 = ~1A)
        function DIGIPOT_CURRENT(mA) {
            return ((mA-750)/5+135)
        }

        if (MARLIN["EXTRUDERS"] == 1) {
            MOTOR_CURRENT_E0                             = MOTOR_CURRENT_E
            MOTOR_CURRENT_E1                             = MOTOR_CURRENT_E
        }

        MARLIN["DIGIPOT_MOTOR_CURRENT"] = [
            DIGIPOT_CURRENT(MOTOR_CURRENT_X),
            DIGIPOT_CURRENT(MOTOR_CURRENT_Y),
            DIGIPOT_CURRENT(MOTOR_CURRENT_Z),
            DIGIPOT_CURRENT(MOTOR_CURRENT_E0),
            DIGIPOT_CURRENT(MOTOR_CURRENT_E1)
        ]
    }
    else {
        throw "Motor currents not defined"
    }

/**************** ACCELERATION, FEEDRATES AND XYZ MOTOR STEPS ****************/

    // Values for XYZ vary by printer model, values for E vary by toolhead.

    XY_STEPS                                             = 100

    if (IS_MINI) {
        if (ENABLED("JUNCTION_DEVIATION")) {
            // Use tuned acceleration factors
            MARLIN["DEFAULT_ACCELERATION"]               = 1000
            MARLIN["DEFAULT_TRAVEL_ACCELERATION"]        = 1000
        }
        else {
            MARLIN["DEFAULT_ACCELERATION"]               = 2000
            MARLIN["DEFAULT_TRAVEL_ACCELERATION"]        = 2000
        }

        MARLIN["DEFAULT_XJERK"]                          = 12.0
        MARLIN["DEFAULT_YJERK"]                          = 12.0
        MARLIN["DEFAULT_ZJERK"]                          = 0.4

        if (!MARLIN.hasOwnProperty("NOZZLE_TO_PROBE_OFFSET")) {
            if (PRINTER.includes("SynDaver_LevelUp")) {
                MARLIN["NOZZLE_TO_PROBE_OFFSET"]         = [0, 18.69, -1.5]
            }
            else if (PROBE_STYLE == "BLTouch") {
                MARLIN["NOZZLE_TO_PROBE_OFFSET"]         = [0, -22, -2.35]
            }
            else if (USE_Z_BELT) {
                MARLIN["NOZZLE_TO_PROBE_OFFSET"]         = [0, 0, -1.1]
            }
            else {
                MARLIN["NOZZLE_TO_PROBE_OFFSET"]         = [0, 0, -1.375]
            }
        }
    }
    else if (IS_TAZ) {
        MARLIN["DEFAULT_XJERK"]                          = 8.0
        MARLIN["DEFAULT_YJERK"]                          = 8.0
        MARLIN["DEFAULT_ZJERK"]                          = 0.4
        if (!MARLIN.hasOwnProperty("DEFAULT_ACCELERATION")) {
            MARLIN["DEFAULT_ACCELERATION"]               = 500
        }
        if (!MARLIN.hasOwnProperty("DEFAULT_TRAVEL_ACCELERATION")) {
            MARLIN["DEFAULT_TRAVEL_ACCELERATION"]        = 500
        }

        if (!MARLIN.hasOwnProperty("NOZZLE_TO_PROBE_OFFSET")) {
            if (PRINTER.includes("SynDaver_Axi_2")) {
                MARLIN["NOZZLE_TO_PROBE_OFFSET"]         = [37.89, 38.25, -4.6]
            }
            else if (PRINTER.includes("SynDaver_Axi")) {
                MARLIN["NOZZLE_TO_PROBE_OFFSET"]         = [43.5, 23.75, -2.35]
            }
            else if (PROBE_STYLE == "BLTouch" && PRINTER.includes("Guava_TAZ4")) {
                MARLIN["NOZZLE_TO_PROBE_OFFSET"]         = [-54, 0, -4.0]
                MARLIN["PROBE_OFFSET_XMIN"]              = -60
            }
            else if (PROBE_STYLE == "BLTouch") {
                MARLIN["NOZZLE_TO_PROBE_OFFSET"]         = [0, -22, -2.35]
            }
            else if (PRINTER.includes("Quiver_TAZPro")) {
                MARLIN["NOZZLE_TO_PROBE_OFFSET"]         = [0, 0, -1.102]
            }
            else {
                MARLIN["NOZZLE_TO_PROBE_OFFSET"]         = [0, 0, -1.200]
            }
        }
    }

    if (PRINTER.includes("SynDaver_Level")) {
        Z_STEPS                                          = 3000
        Z_MICROSTEPS                                     = 16

        MARLIN["DEFAULT_MAX_FEEDRATE"]                   = [300, 300, 8, 40] // (mm/sec)
        MARLIN["DEFAULT_MAX_ACCELERATION"]               = [9000,9000,100,1000]
    }

    else if (IS_MINI && USE_Z_SCREW) {
        Z_STEPS                                          = 1600
        Z_MICROSTEPS                                     = 16

        MARLIN["DEFAULT_MAX_FEEDRATE"]                   = [300, 300, 8, 40] // (mm/sec)
        MARLIN["DEFAULT_MAX_ACCELERATION"]               = [9000,9000,100,1000]
    }
    else if (IS_MINI && USE_Z_BELT) {
        Z_STEPS                                          = 200
        Z_MICROSTEPS                                     = 32
        MARLIN["DEFAULT_MAX_FEEDRATE"]                   = [300, 300, 300, 40] // (mm/sec)
        if (ENABLED("JUNCTION_DEVIATION")) {
            // Use tuned acceleration factors
            MARLIN["DEFAULT_MAX_ACCELERATION"]           = [1000,1000,200,1000]
        }
        else {
            MARLIN["DEFAULT_MAX_ACCELERATION"]           = [9000,9000,200,1000]
        }
    }
    else if (IS_TAZ && USE_Z_SCREW) {
        Z_STEPS                                          = 1600
        Z_MICROSTEPS                                     = 16
        if (MARLIN["EXTRUDERS"] > 1 && ENABLED("DISTINCT_E_FACTORS")) {
            MARLIN["DEFAULT_MAX_FEEDRATE"]               = [300, 300, 3, 25, 25] // (mm/sec)
            MARLIN["DEFAULT_MAX_ACCELERATION"]           = [9000,9000,100,9000, 9000]
        }
        else {
            MARLIN["DEFAULT_MAX_FEEDRATE"]               = [300, 300, 3, 25] // (mm/sec)
            MARLIN["DEFAULT_MAX_ACCELERATION"]           = [9000,9000,100,9000]
        }
    }

    else if (PRINTER.includes("SynDaver_Axi_2")) {
        Z_STEPS                                          = 100
        Z_MICROSTEPS                                     = 16
        MARLIN["DEFAULT_MAX_FEEDRATE"]                   = [300, 300, 30, 25] // (mm/sec)
        MARLIN["DEFAULT_MAX_ACCELERATION"]               = [9000,9000,200,9000]
    }

    else if (IS_TAZ && USE_Z_BELT) {
        Z_STEPS                                          = 500
        Z_MICROSTEPS                                     = 16
        MARLIN["DEFAULT_MAX_FEEDRATE"]                   = [300, 300, 30, 25] // (mm/sec)
        MARLIN["DEFAULT_MAX_ACCELERATION"]               = [9000,9000,200,9000]
    }

    if (USE_REPRAP_LCD_DISPLAY) {
        MANUAL_FEEDRATE_Z                                = USE_Z_BELT ? 40 : 4
        MARLIN["MANUAL_FEEDRATE"]                        = [50*60, 50*60, MANUAL_FEEDRATE_Z*60, MANUAL_FEEDRATE_E*60] // (mm/min)
    }

    if (USE_TOUCH_UI) {
        MANUAL_FEEDRATE_Z                                = 300
        MARLIN["MANUAL_FEEDRATE"]                        = [39*60, 39*60, 39*60, MANUAL_FEEDRATE_E*60] // (mm/min)
    }

    if (MARLIN["EXTRUDERS"] == 2 && ENABLED("DISTINCT_E_FACTORS") && !ENABLED("SWITCHING_EXTRUDER")) {
        MARLIN["DEFAULT_AXIS_STEPS_PER_UNIT"]            = [XY_STEPS, XY_STEPS, Z_STEPS, E_STEPS, E_STEPS]
    }
    else {
        MARLIN["DEFAULT_AXIS_STEPS_PER_UNIT"]            = [XY_STEPS, XY_STEPS, Z_STEPS, E_STEPS]
    }

    // A 32-bit board can handle more segments
    MARLIN["MIN_STEPS_PER_SEGMENT"]                      = USE_ARCHIM2 ? 1 : 6

    if (["TMC2130"].includes(DRIVER_TYPE)) {
        MARLIN["Z_MICROSTEPS"] = Z_MICROSTEPS
        if (USE_DUAL_Z_STEPPERS) {
            MARLIN["Z2_MICROSTEPS"] = Z_MICROSTEPS
        }
    }
    else {
        if (Z_MICROSTEPS != 16) {
            throw "Unsupported microstepping for driver"
        }
    }

/********************************* LCD OPTIONS *********************************/

    if (USE_REPRAP_LCD_DISPLAY) {
        MARLIN["REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER"] = true
        MARLIN["TURBO_BACK_MENU_ITEM"]                   = true
        MARLIN["XYZ_HOLLOW_FRAME"]                       = false
        MARLIN["MENU_HOLLOW_FRAME"]                      = false
        MARLIN["USE_SMALL_INFOFONT"]                     = true
        MARLIN["BOOT_MARLIN_LOGO_SMALL"]                 = true
        MARLIN["LCD_INFO_MENU"]                          = true
        MARLIN["ENCODER_PULSES_PER_STEP"]                = 2
        MARLIN["ENCODER_STEPS_PER_MENU_ITEM"]            = 1
        MARLIN["SET_PROGRESS_MANUALLY"]                  = true
        MARLIN["SET_PROGRESS_PERCENT"]                   = true
        MARLIN["SCROLL_LONG_FILENAMES"]                  = true
        MARLIN["STATUS_MESSAGE_SCROLLING"]               = true
        MARLIN["BABYSTEP_GFX_OVERLAY"]                   = true
        MARLIN["DOUBLECLICK_FOR_Z_BABYSTEPPING"]         = true
        MARLIN["SDSUPPORT"]                              = true
        MARLIN["INDIVIDUAL_AXIS_HOMING_MENU"]            = true
        MARLIN["PID_EDIT_MENU"]                          = true
        MARLIN["PID_AUTOTUNE_MENU"]                      = true
        MARLIN["HOST_PROMPT_SUPPORT"]                    = true
        // Enable the games as easter eggs :)
        MARLIN["GAMES_EASTER_EGG"]                       = true
        MARLIN["MARLIN_BRICKOUT"]                        = true
        MARLIN["MARLIN_INVADERS"]                        = true
        MARLIN["MARLIN_SNAKE"]                           = true
        if (IS_MINI || USE_ARCHIM2) {
            MARLIN["REVERSE_ENCODER_DIRECTION"]          = true
        }
    }

    if (ENABLED("LIGHTWEIGHT_UI")) {
        MARLIN["STATUS_EXPIRE_SECONDS"]                  = 0
    }

    if (USE_TOUCH_UI) {
        MARLIN["TOUCH_UI_FTDI_EVE"]                      = true
        MARLIN["TOUCH_UI_USE_UTF8"]                      = true
        MARLIN["TOUCH_UI_UTF8_COPYRIGHT"]                = true
        MARLIN["TOUCH_UI_UTF8_SUPERSCRIPTS"]             = true
        MARLIN["TOUCH_UI_DEVELOPER_MENU"]                = !PRINTER.includes("SynDaver")
        MARLIN["SET_PROGRESS_MANUALLY"]                  = true
        MARLIN["SCROLL_LONG_FILENAMES"]                  = true
        MARLIN["NO_TIME_AFTER_SD_PRINT"]                 = true
        MARLIN["LCD_TIMEOUT_TO_STATUS"]                  = 0

        // Virtual joystick functionality
        MARLIN["JOYSTICK"]                               = true
        MARLIN["JOY_X_PIN"]                              = -1
        MARLIN["JOY_Y_PIN"]                              = -1
        MARLIN["JOY_Z_PIN"]                              = -1
        MARLIN["JOY_EN_PIN"]                             = -1
        MARLIN["JOY_X_LIMITS"]                           = false
        MARLIN["JOY_Y_LIMITS"]                           = false
        MARLIN["JOY_Z_LIMITS"]                           = false
    }

    if (ENABLED("USB_FLASH_DRIVE_SUPPORT")) {
        MARLIN["SDSUPPORT"]                              = true
    }

    if (USE_REPRAP_LCD_DISPLAY || USE_TOUCH_UI) {
        MARLIN["BABYSTEPPING"]                           = true
        MARLIN["BABYSTEP_XY"]                            = true
        MARLIN["BABYSTEP_ALWAYS_AVAILABLE"]              = true
        MARLIN["BABYSTEP_MULTIPLICATOR_Z"]               = 10

        if (["Conductive", "BLTouch", "Inductive"].includes(PROBE_STYLE)) {
            MARLIN["BABYSTEP_ZPROBE_OFFSET"]             = true
            if (MARLIN["EXTRUDERS"] > 1) {
                MARLIN["BABYSTEP_HOTEND_Z_OFFSET"]       = true
            }
        }
    }
    else {
        MARLIN["SHOW_CUSTOM_BOOTSCREEN"]                 = false
    }

/************************** MEMORY FOOTPRINT REDUCTION *************************/

    if (USE_LESS_MEMORY >= 1) {
        MARLIN["GAMES_EASTER_EGG"]                       = false
    }
    if (USE_LESS_MEMORY >= 2) {
        MARLIN["G26_MESH_VALIDATION"]                    = false
        MARLIN["PID_EDIT_MENU"]                          = false
        /* 12/2/2024 Disable UBL due to failure to flash */
        MARLIN["UBL_HILBERT_CURVE"]                      = false
        MARLIN["AUTO_BED_LEVELING_UBL"]                  = false
        MARLIN["AUTO_BED_LEVELING_BILINEAR"]             = true
    }
    if (USE_LESS_MEMORY >= 3) {
        MARLIN["INDIVIDUAL_AXIS_HOMING_MENU"]            = false
        MARLIN["BABYSTEP_GFX_OVERLAY"]                   = false
        MARLIN["GCODE_MACROS"]                           = false
    }
    if (USE_LESS_MEMORY >= 4) {
        MARLIN["PID_AUTOTUNE_MENU"]                      = false
        MARLIN["SERIAL_PORT_2"]                          = false
    }
    if (USE_LESS_MEMORY >= 5) {
        MARLIN["SCROLL_LONG_FILENAMES"]                  = false
        MARLIN["STATUS_MESSAGE_SCROLLING"]               = false
        MARLIN["BABYSTEPPING"]                           = false
    }
    if (USE_LESS_MEMORY >= 6) {
        MARLIN["S_CURVE_ACCELERATION"]                   = false
        MARLIN["LIN_ADVANCE"]                            = false
    }
    if (USE_LESS_MEMORY >= 7) {
        MARLIN["BUFSIZE"]                                = 3
    }

/*********************************** CLEAN UP **********************************/

    MARLIN["TOOLHEAD_TYPE"]                              = C_STRING(TOOLHEAD_TYPE)
    
    function checkEndstop(axis) {
        function a(s) {
            return s.replace("X",axis);
        }
        if(MARLIN[a("X_HOME_DIR")] ==  -1) {
            if(!ENABLED(a("USE_XMIN_PLUG"))) console.log("WARNING:", a("USE_XMIN_PLUG"), "needs to be enabled");
            if( ENABLED(a("USE_XMAX_PLUG")) && !ENABLED(a("X_SAFETY_STOP"))) console.log("WARNING:", a("X_SAFETY_STOP"), "needs to be enabled");
            if(!ENABLED(a("USE_XMAX_PLUG")) &&  ENABLED(a("X_SAFETY_STOP"))) console.log("WARNING:", a("X_SAFETY_STOP"), "needs to be disabled");
        } else {
            if(!ENABLED(a("USE_XMAX_PLUG"))) console.log("WARNING:", a("USE_XMAX_PLUG"), "needs to be enabled");
            if( ENABLED(a("USE_XMIN_PLUG")) && !ENABLED(a("X_SAFETY_STOP"))) console.log("WARNING:", a("X_SAFETY_STOP"), "needs to be enabled");
            if(!ENABLED(a("USE_XMIN_PLUG")) &&  ENABLED(a("X_SAFETY_STOP"))) console.log("WARNING:", a("X_SAFETY_STOP"), "needs to be disabled");
        }
        delete MARLIN[a("USE_XMIN_PLUG")];
        delete MARLIN[a("USE_XMAX_PLUG")];
    }
    
    // As of https://github.com/MarlinFirmware/Marlin/pull/25748, USE_*_PLUG is no longer used,
    // but keep it around for now.
    checkEndstop("X");
    checkEndstop("Y");
    checkEndstop("Z");
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

