/**
 * TMCStepper library by @teemuatlut
 *
 * TMCStepper.h
 * Classes for all stepper types. Inheritance hierarchy:
 *
 * TMCStepper
 *   TMC2130Stepper
 *     TMC2160Stepper
 *       TMC5130Stepper
 *         TMC5160Stepper
 *           TMC5161Stepper
 *   TMC2208Stepper
 *     TMC2209Stepper
 *     TMC2224Stepper
 * TMC2660Stepper
 * TMC2240Stepper
 */
#pragma once

//#define TMCDEBUG

#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wunused-function"
#pragma GCC diagnostic ignored "-Wunused-variable"

#if defined(ARDUINO) && ARDUINO >= 100
	#include <Arduino.h>
	#include <SPI.h>
	#include <Stream.h>
#elif defined(bcm2835)
	#include <bcm2835.h>
	#include "source/bcm2835_spi.h"
	#include "source/bcm2835_stream.h"
#elif __cplusplus >= 201703L
	#if __has_include(<Arduino.h>)
		#include <Arduino.h>
	#endif
	#if __has_include(<SPI.h>)
		#include <SPI.h>
	#endif
	#if __has_include(<Stream.h>)
		#include <Stream.h>
	#endif
#endif

#if (__cplusplus == 201703L) && defined(__has_include)
	#define SW_CAPABLE_PLATFORM __has_include(<SoftwareSerial.h>)
#elif defined(__AVR__) || defined(TARGET_LPC1768) || defined(ARDUINO_ARCH_STM32)
	#define SW_CAPABLE_PLATFORM true
#else
	#define SW_CAPABLE_PLATFORM false
#endif

#if SW_CAPABLE_PLATFORM
	#include <SoftwareSerial.h>
#endif

#include "source/SERIAL_SWITCH.h"
#include "source/SW_SPI.h"

#pragma GCC diagnostic pop

// Usage: INIT_REGISTER(GCONF);  // Result: GCONF_t GCONF_register{};
#define INIT_REGISTER(REG) REG##_t REG##_register{}
#define SET_ALIAS(TYPE, DRIVER, NEW, ARG, OLD) TYPE (DRIVER::*NEW)(ARG) = &DRIVER::OLD

#define TMCSTEPPER_VERSION 0x000805 // v0.8.5 - Marlin bumps minor version

#include "source/TMC2130_bitfields.h"
#include "source/TMC2160_bitfields.h"
#include "source/TMC5130_bitfields.h"
#include "source/TMC5160_bitfields.h"
#include "source/TMC2208_bitfields.h"
#include "source/TMC2209_bitfields.h"
#include "source/TMC2240_bitfields.h"
#include "source/TMC2660_bitfields.h"

#include "source/TMCStepperBase.h"
#include "source/TMC2130Stepper.h"
#include "source/TMC2160Stepper.h"
#include "source/TMC5130Stepper.h"
#include "source/TMC5160Stepper.h"
#include "source/TMC2208Stepper.h"
#include "source/TMC2209Stepper.h"
#include "source/TMC2224Stepper.h"
#include "source/TMC2240Stepper.h"
#include "source/TMC2660Stepper.h"
