/**
 * TMCStepper library by @teemuatlut
 *
 * TMC2224Stepper.h
 * Individual header for class TMC2224Stepper
 */
#pragma once

#define INIT2224_REGISTER(REG) TMC2224_n::REG##_t REG##_register{}

class TMC2224Stepper : public TMC2208Stepper {
	public:
		uint32_t IOIN();
		bool enn();
		bool ms1();
		bool ms2();
		bool pdn_uart();
		bool spread();
		bool step();
		bool sel_a();
		bool dir();
		uint8_t version();
};
