/**
 * TMCStepper library by @teemuatlut
 *
 * TMC2160Stepper.h
 * Individual header for class TMC2160Stepper
 */
#pragma once

#define INIT2160_REGISTER(REG) TMC2160_n::REG##_t REG##_register{}

class TMC2160Stepper : public TMC2130Stepper {
	public:
		TMC2160Stepper(uint16_t pinCS, float RS = default_RS, int8_t link_index = -1);
		TMC2160Stepper(uint16_t pinCS, uint16_t pinMOSI, uint16_t pinMISO, uint16_t pinSCK, int8_t link_index = -1);
		TMC2160Stepper(uint16_t pinCS, float RS, uint16_t pinMOSI, uint16_t pinMISO, uint16_t pinSCK, int8_t link_index = -1);
		void begin();
		void defaults();
		void push();

		uint16_t cs2rms(uint8_t CS);
		void rms_current(uint16_t mA);
		void rms_current(uint16_t mA, float mult);
		uint16_t rms_current();

		// IOIN
		uint32_t 	IOIN();
		bool 			refl_step();
		bool 			refr_dir();
		bool 			encb_dcen_cfg4();
		bool 			enca_dcin_cfg5();
		bool 			drv_enn();
		bool 			dco_cfg6();
		uint8_t 	version();

		// W: OTP_PROG
		// R: OTP_READ
		// RW: FACTORY_CONF

		// W: SHORT_CONF
		void SHORT_CONF(uint32_t);
		void s2vs_level(uint8_t);
		void s2g_level(uint8_t);
		void shortfilter(uint8_t);
		void shortdelay(bool);
		uint32_t SHORT_CONF();
		uint8_t s2vs_level();
		uint8_t s2g_level();
		uint8_t shortfilter();
		bool shortdelay();

		// W: DRV_CONF
		void DRV_CONF(uint32_t);
		void bbmtime(uint8_t);
		void bbmclks(uint8_t);
		void otselect(uint8_t);
		void drvstrength(uint8_t);
		void filt_isense(uint8_t);
		uint32_t DRV_CONF();
		uint8_t bbmtime();
		uint8_t bbmclks();
		uint8_t otselect();
		uint8_t drvstrength();
		uint8_t filt_isense();

		// W: GLOBAL_SCALER
		void GLOBAL_SCALER(uint8_t);
		uint8_t GLOBAL_SCALER();

		// R: OFFSET_READ
		uint16_t OFFSET_READ();

		// W: PWMCONF
		void PWMCONF(uint32_t input);
		void pwm_ofs(uint8_t B);
		void pwm_grad(uint8_t B);
		void pwm_freq(uint8_t B);
		void pwm_autoscale(bool B);
		void pwm_autograd(bool B);
		void freewheel(uint8_t B);
		void pwm_reg(uint8_t B);
		void pwm_lim(uint8_t B);
		uint32_t PWMCONF();
		uint8_t pwm_ofs();
		uint8_t pwm_grad();
		uint8_t pwm_freq();
		bool pwm_autoscale();
		bool pwm_autograd();
		uint8_t freewheel();
		uint8_t pwm_reg();
		uint8_t pwm_lim();

		// R: PWM_SCALE
		uint32_t PWM_SCALE();
		uint8_t pwm_scale_sum();
		uint16_t pwm_scale_auto();

	protected:
		using TMC2130Stepper::ENCM_CTRL;
		using TMC2130Stepper::pwm_ampl;
		using TMC2130Stepper::pwm_symmetric;

		INIT_REGISTER(SHORT_CONF);
		INIT_REGISTER(DRV_CONF);
		INIT_REGISTER(GLOBAL_SCALER);
		INIT2160_REGISTER(PWMCONF);

		static constexpr float default_RS = 0.075;
};
