/**
 * TMCStepper library by @teemuatlut
 *
 * TMC5161Stepper.h
 * Individual header for class TMC5161Stepper
 */
#pragma once

class TMC5161Stepper : public TMC5160Stepper {
	public:
		TMC5161Stepper(uint16_t pinCS, float RS = default_RS, int8_t link_index = -1) : TMC5160Stepper(pinCS, RS, link_index) {}
		TMC5161Stepper(uint16_t pinCS, uint16_t pinMOSI, uint16_t pinMISO, uint16_t pinSCK, int8_t link_index = -1) :
			TMC5160Stepper(pinCS, pinMOSI, pinMISO, pinSCK, link_index) {}
		TMC5161Stepper(uint16_t pinCS, float RS, uint16_t pinMOSI, uint16_t pinMISO, uint16_t pinSCK, int8_t link_index = -1) :
			TMC5160Stepper(pinCS, RS, pinMOSI, pinMISO, pinSCK, link_index) {}
};
