/**
 * TMCStepper library by @teemuatlut
 *
 * TMC2130Stepper.h
 * Individual header for class TMC2130Stepper
 */
#pragma once

#define INIT2130_REGISTER(REG) TMC2130_n::REG##_t REG##_register{}

class TMC2130Stepper : public TMCStepper {
	public:
		TMC2130Stepper(uint16_t pinCS, float RS = default_RS, int8_t link_index = -1);
		TMC2130Stepper(uint16_t pinCS, uint16_t pinMOSI, uint16_t pinMISO, uint16_t pinSCK, int8_t link_index = -1);
		TMC2130Stepper(uint16_t pinCS, float RS, uint16_t pinMOSI, uint16_t pinMISO, uint16_t pinSCK, int8_t link_index = -1);
		void begin();
		void defaults();
		void setSPISpeed(uint32_t speed);
		void switchCSpin(bool state);
		bool isEnabled();
		void push();

		// Helper functions
		void sg_current_decrease(uint8_t value);
		uint8_t sg_current_decrease();

		// RW: GCONF
		uint32_t GCONF();
		void GCONF(								uint32_t value);
		void I_scale_analog(			bool B);
		void internal_Rsense(			bool B);
		void en_pwm_mode(					bool B);
		void enc_commutation(			bool B);
		void shaft(								bool B);
		void diag0_error(					bool B);
		void diag0_otpw(					bool B);
		void diag0_stall(					bool B);
		void diag1_stall(					bool B);
		void diag1_index(					bool B);
		void diag1_onstate(				bool B);
		void diag1_steps_skipped(	bool B);
		void diag0_int_pushpull(	bool B);
		void diag1_pushpull(			bool B);
		void small_hysteresis(		bool B);
		void stop_enable(					bool B);
		void direct_mode(					bool B);
		bool I_scale_analog();
		bool internal_Rsense();
		bool en_pwm_mode();
		bool enc_commutation();
		bool shaft();
		bool diag0_error();
		bool diag0_otpw();
		bool diag0_stall();
		bool diag1_stall();
		bool diag1_index();
		bool diag1_onstate();
		bool diag1_steps_skipped();
		bool diag0_int_pushpull();
		bool diag1_pushpull();
		bool small_hysteresis();
		bool stop_enable();
		bool direct_mode();

		// R: IOIN
		uint32_t IOIN();
		bool step();
		bool dir();
		bool dcen_cfg4();
		bool dcin_cfg5();
		bool drv_enn_cfg6();
		bool dco();
		uint8_t version();

		// W: TCOOLTHRS
		uint32_t TCOOLTHRS();
		void TCOOLTHRS(						uint32_t input);

		// W: THIGH
		uint32_t THIGH();
		void THIGH(								uint32_t input);

		// RW: XDRIRECT
		uint32_t XDIRECT();
		void XDIRECT(							uint32_t input);
		void coil_A(							int16_t 	B);
		void coil_B(							int16_t 	B);
		int16_t coil_A();
		int16_t coil_B();

		// W: VDCMIN
		uint32_t VDCMIN();
		void VDCMIN(							uint32_t input);

		// RW: CHOPCONF
		uint32_t CHOPCONF();
		void CHOPCONF(						uint32_t value);
		void toff(								uint8_t B);
		void hstrt(								uint8_t B);
		void hend(								uint8_t B);
		//void fd(									uint8_t B);
		void disfdcc(							bool 		B);
		void rndtf(								bool 		B);
		void chm(									bool 		B);
		void tbl(									uint8_t B);
		void vsense(							bool 		B);
		void vhighfs(							bool 		B);
		void vhighchm(						bool 		B);
		void sync(								uint8_t B);
		void mres(								uint8_t B);
		void intpol(							bool 		B);
		void dedge(								bool 		B);
		void diss2g(							bool 		B);
		uint8_t toff();
		uint8_t hstrt();
		uint8_t hend();
		//uint8_t fd();
		bool 	disfdcc();
		bool 	rndtf();
		bool 	chm();
		uint8_t tbl();
		bool 	vsense();
		bool 	vhighfs();
		bool 	vhighchm();
		uint8_t sync();
		uint8_t mres();
		bool 	intpol();
		bool 	dedge();
		bool 	diss2g();

		// W: COOLCONF
		void COOLCONF(uint32_t value);
		uint32_t COOLCONF();
		void semin(								uint8_t B);
		void seup(								uint8_t B);
		void semax(								uint8_t B);
		void sedn(								uint8_t B);
		void seimin(							bool 		B);
		void sgt(									int8_t  B);
		void sfilt(								bool 		B);
		uint8_t semin();
		uint8_t seup();
		uint8_t semax();
		uint8_t sedn();
		bool seimin();
		int8_t sgt();
		bool sfilt();

		// W: DCCTRL
		void DCCTRL(uint32_t input);
		void dc_time(uint16_t input);
		void dc_sg(uint8_t input);
		uint32_t DCCTRL();
		uint16_t dc_time();
		uint8_t dc_sg();

		// R: DRV_STATUS
		uint32_t DRV_STATUS();
		uint16_t sg_result();
		bool fsactive();
		uint8_t cs_actual();
		bool stallguard();
		bool ot();
		bool otpw();
		bool s2ga();
		bool s2gb();
		bool ola();
		bool olb();
		bool stst();

		// W: PWMCONF
		void PWMCONF(							uint32_t value);
		uint32_t PWMCONF();
		void pwm_ampl(						uint8_t B);
		void pwm_grad(						uint8_t B);
		void pwm_freq(						uint8_t B);
		void pwm_autoscale(				bool		B);
		void pwm_symmetric(				bool		B);
		void freewheel(						uint8_t B);
		uint8_t pwm_ampl();
		uint8_t pwm_grad();
		uint8_t pwm_freq();
		bool 	pwm_autoscale();
		bool 	pwm_symmetric();
		uint8_t freewheel();

		// R: PWM_SCALE
		uint8_t PWM_SCALE();

		// W: ENCM_CTRL
		uint8_t ENCM_CTRL();
		void ENCM_CTRL(						uint8_t input);
		void inv(									bool B);
		void maxspeed(						bool B);
		bool inv();
		bool maxspeed();

		// R: LOST_STEPS
		uint32_t LOST_STEPS();

		// Function aliases

		uint8_t status_response;

	protected:
		void beginTransaction();
		void endTransaction();
		uint8_t transfer(const uint8_t data);
		void transferEmptyBytes(const uint8_t n);
		void write(uint8_t addressByte, uint32_t config);
		uint32_t read(uint8_t addressByte);

		INIT_REGISTER(GCONF);			// 32b
		INIT_REGISTER(TCOOLTHRS);	// 32b
		INIT_REGISTER(THIGH);			// 32b
		INIT_REGISTER(XDIRECT);		// 32b
		INIT_REGISTER(VDCMIN);		// 32b
		INIT_REGISTER(CHOPCONF);	// 32b
		INIT_REGISTER(COOLCONF);	// 32b
		INIT_REGISTER(DCCTRL);		// 32b
		INIT_REGISTER(PWMCONF);		// 32b
		INIT_REGISTER(ENCM_CTRL);	//  8b

		struct IOINT_t 			{ constexpr static uint8_t address = 0x04; };
		struct PWM_SCALE_t 	{ constexpr static uint8_t address = 0x71; };
		struct LOST_STEPS_t { constexpr static uint8_t address = 0x73; };
		struct DRV_STATUS_t { constexpr static uint8_t address = 0X6F; };

		static uint32_t spi_speed; // Default 2MHz
		const uint16_t _pinCS;
		SW_SPIClass * TMC_SW_SPI = nullptr;
		static constexpr float default_RS = 0.11;

		int8_t link_index;
		static int8_t chain_length;
};
