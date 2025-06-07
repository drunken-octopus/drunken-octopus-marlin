/**
 * TMCStepper library by @teemuatlut
 *
 * TMC2660Stepper.h
 * Individual header for class TMC2660Stepper
 */
#pragma once

#define INIT2660_REGISTER(REG) TMC2660_n::REG##_t REG##_register{}

class TMC2660Stepper {
	public:
		TMC2660Stepper(uint16_t pinCS, float RS = default_RS);
		TMC2660Stepper(uint16_t pinCS, uint16_t pinMOSI, uint16_t pinMISO, uint16_t pinSCK);
		TMC2660Stepper(uint16_t pinCS, float RS, uint16_t pinMOSI, uint16_t pinMISO, uint16_t pinSCK);
		void write(uint8_t addressByte, uint32_t config);
		uint32_t read();
		void switchCSpin(bool state);
		void begin();
		bool isEnabled();
		uint8_t test_connection();
		uint16_t cs2rms(uint8_t CS);
		uint16_t rms_current();
		void rms_current(uint16_t mA);
		//uint16_t getMilliamps() {return val_mA;}
		void push();
		uint8_t savedToff() { return _savedToff; }

		// Helper functions
		void microsteps(uint16_t ms);
		uint16_t microsteps();
		void blank_time(uint8_t value);
		uint8_t blank_time();
		void hysteresis_end(int8_t value);
		int8_t hysteresis_end();
		void hysteresis_start(uint8_t value);
		uint8_t hysteresis_start();

		// W: DRVCONF
		void DRVCONF(uint32_t);
		void tst(bool);
		void slph(uint8_t);
		void slpl(uint8_t);
		void diss2g(bool);
		void ts2g(uint8_t);
		void sdoff(bool);
		void vsense(bool);
		void rdsel(uint8_t);
		uint32_t DRVCONF();
		bool tst();
		uint8_t slph();
		uint8_t slpl();
		bool diss2g();
		uint8_t ts2g();
		bool sdoff();
		bool vsense();
		uint8_t rdsel();

		// W: DRVCTRL
		void DRVCTRL(uint32_t);
		void pha(bool B);
		void ca(uint8_t B);
		void phb(bool B);
		void cb(uint8_t B);
		bool pha();
		uint8_t ca();
		bool phb();
		uint8_t cb();
		void intpol(bool);
		void dedge(bool);
		void mres(uint8_t);
		uint32_t DRVCTRL();
		bool intpol();
		bool dedge();
		uint8_t mres();

		// W: CHOPCONF
		void CHOPCONF(uint32_t);
		void tbl(uint8_t);
		void chm(bool);
		void rndtf(bool);
		void hdec(uint8_t);
		void hend(uint8_t);
		void hstrt(uint8_t);
		void toff(uint8_t);
		uint32_t CHOPCONF();
		uint8_t tbl();
		bool chm();
		bool rndtf();
		uint8_t hdec();
		uint8_t hend();
		uint8_t hstrt();
		uint8_t toff();

		// R: DRVSTATUS
		uint32_t DRV_STATUS() { return DRVSTATUS(); }
		uint32_t DRVSTATUS();
		uint16_t mstep();
		uint8_t se();
		bool stst();
		bool olb();
		bool ola();
		bool s2gb();
		bool s2ga();
		bool otpw();
		bool ot();
		bool sg();
		uint16_t sg_result();

		// W: SGCSCONF
		uint32_t SGCSCONF();
		void sfilt(bool);
		void sgt(uint8_t);
		void cs(uint8_t);
		void SGCSCONF(uint32_t);
		bool sfilt();
		uint8_t sgt();
		uint8_t cs();

		// W: SMARTEN
		void SMARTEN(uint32_t);
		void seimin(bool B);
		void sedn(uint8_t B);
		void semax(uint8_t B);
		void seup(uint8_t B);
		void semin(uint8_t B);
		uint32_t SMARTEN();
		bool seimin();
		uint8_t sedn();
		uint8_t semax();
		uint8_t seup();
		uint8_t semin();
		/*
		// Alias
		SET_ALIAS(void, polarity_A, bool, pha);
		SET_ALIAS(void, current_A, uint8_t, ca);
		SET_ALIAS(void, polarity_B, bool, phb);
		SET_ALIAS(void, current_b, uint8_t, cb);
		SET_ALIAS(void, interpolate, bool, intpol);
		SET_ALIAS(void, double_edge_step, bool, dedge);
		SET_ALIAS(void, microsteps, uint8_t, mres);
		SET_ALIAS(void, blank_time, uint8_t, tbl);
		SET_ALIAS(void, chopper_mode, bool, chm);
		SET_ALIAS(void, random_off_time, bool, rndtf);
		SET_ALIAS(void, hysteresis_decrement, uint8_t, hdec);
		SET_ALIAS(void, hysteresis_low, uint8_t, hend);
		SET_ALIAS(void, hysteresis_start, uint8_t, hstrt);
		SET_ALIAS(void, off_time, uint8_t, toff);
		*/

		uint8_t status_response;

	private:
		INIT_REGISTER(DRVCTRL_1);
		INIT_REGISTER(DRVCTRL_0);
		INIT2660_REGISTER(CHOPCONF);
		INIT_REGISTER(SMARTEN);
		INIT_REGISTER(SGCSCONF);
		INIT_REGISTER(DRVCONF);
		INIT_REGISTER(READ_RDSEL00);
		INIT_REGISTER(READ_RDSEL01);
		INIT_REGISTER(READ_RDSEL10);

		const uint16_t _pinCS;
		const float Rsense;
		static constexpr float default_RS = 0.1;
		float holdMultiplier = 0.5;
		uint32_t spi_speed = 16000000/8; // Default 2MHz
		uint8_t _savedToff = 0;
		SW_SPIClass * TMC_SW_SPI = nullptr;
};
