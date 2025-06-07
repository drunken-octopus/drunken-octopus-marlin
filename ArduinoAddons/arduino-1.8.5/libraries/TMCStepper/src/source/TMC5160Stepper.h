/**
 * TMCStepper library by @teemuatlut
 *
 * TMC5160Stepper.h
 * Individual header for class TMC5160Stepper
 */
#pragma once

#define INIT5160_REGISTER(REG) TMC5160_n::REG##_t REG##_register{}

class TMC5160Stepper : public TMC5130Stepper {
	public:
		TMC5160Stepper(uint16_t pinCS, float RS = default_RS, int8_t link_index = -1);
		TMC5160Stepper(uint16_t pinCS, uint16_t pinMOSI, uint16_t pinMISO, uint16_t pinSCK, int8_t link_index = -1);
		TMC5160Stepper(uint16_t pinCS, float RS, uint16_t pinMOSI, uint16_t pinMISO, uint16_t pinSCK, int8_t link_index = -1);

		void rms_current(uint16_t mA) { TMC2160Stepper::rms_current(mA); }
		void rms_current(uint16_t mA, float mult) { TMC2160Stepper::rms_current(mA, mult); }
		uint16_t rms_current() { return TMC2160Stepper::rms_current(); }
		void defaults();
		void push();

		// RW: GCONF
		void recalibrate(bool);
		void faststandstill(bool);
		void multistep_filt(bool);
		bool recalibrate();
		bool faststandstill();
		bool multistep_filt();

		// R: IOIN
		bool drv_enn() { return drv_enn_cfg6(); }
		bool enc_n_dco_cfg6() { return enc_n_dco(); }

		// W: SHORT_CONF
		using TMC2160Stepper::SHORT_CONF;
		using TMC2160Stepper::s2vs_level;
		using TMC2160Stepper::s2g_level;
		using TMC2160Stepper::shortfilter;
		using TMC2160Stepper::shortdelay;

		// W: DRV_CONF
		using TMC2160Stepper::DRV_CONF;
		using TMC2160Stepper::bbmtime;
		using TMC2160Stepper::bbmclks;
		using TMC2160Stepper::otselect;
		using TMC2160Stepper::drvstrength;
		using TMC2160Stepper::filt_isense;

		// W: GLOBAL_SCALER
		using TMC2160Stepper::GLOBAL_SCALER;

		// R: OFFSET_READ
		using TMC2160Stepper::OFFSET_READ;

		// R+WC: ENC_STATUS
		void ENC_STATUS(uint8_t);
		uint8_t ENC_STATUS();

		// W: ENC_DEVIATION
		void ENC_DEVIATION(uint32_t);
		uint32_t ENC_DEVIATION();

		// R: PWM_AUTO
		uint32_t PWM_AUTO();
		uint8_t pwm_ofs_auto();
		uint8_t pwm_grad_auto();

		// RW: CHOPCONF
		void diss2vs(bool);
		void tpfd(uint8_t);
		bool diss2vs();
		uint8_t tpfd();

		// W: PWM_CONF
		using TMC2160Stepper::PWMCONF;
		using TMC2160Stepper::pwm_ofs;
		using TMC2160Stepper::pwm_grad;
		using TMC2160Stepper::pwm_freq;
		using TMC2160Stepper::pwm_autoscale;
		using TMC2160Stepper::pwm_autograd;
		using TMC2160Stepper::freewheel;
		using TMC2160Stepper::pwm_reg;
		using TMC2160Stepper::pwm_lim;

		using TMC2160Stepper::PWM_SCALE;
		using TMC2160Stepper::pwm_scale_sum;
		using TMC2160Stepper::pwm_scale_auto;

	protected:
		using TMC5130Stepper::I_scale_analog;
		using TMC5130Stepper::internal_Rsense;
		using TMC5130Stepper::enc_commutation;
		using TMC5130Stepper::drv_enn_cfg6;
		using TMC5130Stepper::enc_n_dco;
		using TMC5130Stepper::ENCM_CTRL;
		using TMC5130Stepper::vsense;
		using TMC5130Stepper::rndtf;

		INIT_REGISTER(ENC_DEVIATION);

		static constexpr float default_RS = 0.075;
};
