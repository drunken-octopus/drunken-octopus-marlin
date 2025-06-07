/**
 * TMCStepper library by @teemuatlut
 *
 * TMC5130Stepper.h
 * Individual header for class TMC5130Stepper
 */
#pragma once

#define INIT5130_REGISTER(REG) TMC5130_n::REG##_t REG##_register{}

class TMC5130Stepper : public TMC2160Stepper {
	public:
		TMC5130Stepper(uint16_t pinCS, float RS = default_RS, int8_t link_index = -1);
		TMC5130Stepper(uint16_t pinCS, uint16_t pinMOSI, uint16_t pinMISO, uint16_t pinSCK, int8_t link_index = -1);
		TMC5130Stepper(uint16_t pinCS, float RS, uint16_t pinMOSI, uint16_t pinMISO, uint16_t pinSCK, int8_t link_index = -1);

		void begin();
		void defaults();
		void push();

		void rms_current(uint16_t mA) { TMC2130Stepper::rms_current(mA); }
		void rms_current(uint16_t mA, float mult) { TMC2130Stepper::rms_current(mA, mult); }
		uint16_t rms_current() { return TMC2130Stepper::rms_current(); }

		// R: IFCNT
		uint8_t IFCNT();
		// W: SLAVECONF
		uint16_t SLAVECONF();
		void SLAVECONF(uint16_t input);
		// R: IOIN
		uint32_t 	IOIN();
		bool 			refl_step();
		bool 			refr_dir();
		bool 			encb_dcen_cfg4();
		bool 			enca_dcin_cfg5();
		bool 			drv_enn_cfg6();
		bool 			enc_n_dco();
		bool 			sd_mode();
		bool 			swcomp_in();
		uint8_t 	version();

		// RW: GCONF
		void diag1_poscomp_pushpull(bool B) { diag1_pushpull(B); }
		bool diag1_poscomp_pushpull() { return diag1_pushpull(); }

		// RW: SW_MODE
		uint32_t SW_MODE();
		void SW_MODE(uint32_t input);

		void stop_l_enable(bool B);
		void stop_r_enable(bool B);
		void pol_stop_l(bool B);
		void pol_stop_r(bool B);
		void swap_lr(bool B);
		void latch_l_active(bool B);
		void latch_l_inactive(bool B);
		void latch_r_active(bool B);
		void latch_r_inactive(bool B);
		void en_latch_encoder(bool B);
		void sg_stop(bool B);
		void en_softstop(bool B);

		bool stop_r_enable();
		bool pol_stop_l();
		bool pol_stop_r();
		bool swap_lr();
		bool latch_l_active();
		bool latch_l_inactive();
		bool latch_r_active();
		bool latch_r_inactive();
		bool en_latch_encoder();
		bool sg_stop();
		bool en_softstop();

		// R+C: RAMP_STAT
		uint32_t RAMP_STAT();
		bool status_stop_l();
		bool status_stop_r();
		bool status_latch_l();
		bool status_latch_r();
		bool event_stop_l();
		bool event_stop_r();
		bool event_stop_sg();
		bool event_pos_reached();
		bool velocity_reached();
		bool position_reached();
		bool vzero();
		bool t_zerowait_active();
		bool second_move();
		bool status_sg();

		// RW: ENCMODE
		uint32_t ENCMODE();
		void ENCMODE(uint32_t input);
		void pol_a(bool B);
		void pol_b(bool B);
		void pol_n(bool B);
		void ignore_ab(bool B);
		void clr_cont(bool B);
		void clr_once(bool B);
		void pos_edge(bool B);
		void neg_edge(bool B);
		void clr_enc_x(bool B);
		void latch_x_act(bool B);
		void enc_sel_decimal(bool B);
		bool pol_a();
		bool pol_b();
		bool pol_n();
		bool ignore_ab();
		bool clr_cont();
		bool clr_once();
		bool pos_edge();
		bool neg_edge();
		bool clr_enc_x();
		bool latch_x_act();
		bool enc_sel_decimal();

		// W: OUTPUT
		bool TMC_OUTPUT();
		void TMC_OUTPUT(bool input);
		// W: X_COMPARE
		uint32_t X_COMPARE();
		void X_COMPARE(uint32_t input);
		// RW: RAMPMODE
		uint8_t RAMPMODE();
		void RAMPMODE(uint8_t input);
		// RW: XACTUAL
		int32_t XACTUAL();
		void XACTUAL(int32_t input);
		// R: VACTUAL
		int32_t VACTUAL();
		// W: VSTART
		uint32_t VSTART();
		void VSTART(uint32_t input);
		// W: A1
		uint16_t a1();
		void a1(uint16_t input);
		// W: V1
		uint32_t v1();
		void v1(uint32_t input);
		// W: AMAX
		uint16_t AMAX();
		void AMAX(uint16_t input);
		// W: VMAX
		uint32_t VMAX();
		void VMAX(uint32_t input);
		// W: DMAX
		uint16_t DMAX();
		void DMAX(uint16_t input);
		// W: D1
		uint16_t d1();
		void d1(uint16_t input);
		// W: VSTOP
		uint32_t VSTOP();
		void VSTOP(uint32_t input);
		// W: TZEROWAIT
		uint16_t TZEROWAIT();
		void TZEROWAIT(uint16_t input);
		// RW: XTARGET
		int32_t XTARGET();
		void XTARGET(int32_t input);
		// R: XLATCH
		uint32_t XLATCH();
		// RW: X_ENC
		int32_t X_ENC();
		void X_ENC(int32_t input);
		// W: ENC_CONST
		uint32_t ENC_CONST();
		void ENC_CONST(uint32_t input);
		// R: ENC_STATUS
		bool ENC_STATUS();
		// R: ENC_LATCH
		uint32_t ENC_LATCH();

		using TMC2130Stepper::ENCM_CTRL;

		using TMC2130Stepper::PWMCONF;
		using TMC2130Stepper::pwm_ampl;
		using TMC2130Stepper::pwm_grad;
		using TMC2130Stepper::pwm_freq;
		using TMC2130Stepper::pwm_autoscale;
		using TMC2130Stepper::pwm_symmetric;
		using TMC2130Stepper::freewheel;

		using TMC2130Stepper::PWM_SCALE;

	protected:
		INIT_REGISTER(SLAVECONF);
		INIT_REGISTER(OUTPUT);
		INIT_REGISTER(X_COMPARE);
		INIT_REGISTER(RAMPMODE);
		INIT_REGISTER(XACTUAL);
		INIT_REGISTER(VSTART);
		INIT_REGISTER(A1);
		INIT_REGISTER(V1);
		INIT_REGISTER(AMAX);
		INIT_REGISTER(VMAX);
		INIT_REGISTER(DMAX);
		INIT_REGISTER(D1);
		INIT_REGISTER(VSTOP);
		INIT_REGISTER(TZEROWAIT);
		INIT_REGISTER(SW_MODE);
		INIT_REGISTER(ENCMODE);
		INIT_REGISTER(ENC_CONST);

		struct IFCNT_t 			{ constexpr static uint8_t address = 0x02; }; // R
		struct VACTUAL_t 		{ constexpr static uint8_t address = 0x22; }; // R
		struct XTARGET_t 		{ constexpr static uint8_t address = 0x2D; }; // RW
		struct XLATCH_t 		{ constexpr static uint8_t address = 0x36; }; // R
		struct X_ENC_t 			{ constexpr static uint8_t address = 0x39; }; // RW
		struct ENC_STATUS_t { constexpr static uint8_t address = 0x3B; }; // R+C
		struct ENC_LATCH_t 	{ constexpr static uint8_t address = 0x3C; }; // R

		/*
		INIT_REGISTER(MSLUT0);
		INIT_REGISTER(MSLUT1);
		INIT_REGISTER(MSLUT2);
		INIT_REGISTER(MSLUT3);
		INIT_REGISTER(MSLUT4);
		INIT_REGISTER(MSLUT5);
		INIT_REGISTER(MSLUT6);
		INIT_REGISTER(MSLUT7);
		INIT_REGISTER(MSLUTSEL);
		INIT_REGISTER(MSLUTSTART);
		INIT_REGISTER(MSCNT);
		INIT_REGISTER(MSCURACT);
		*/

		static constexpr float default_RS = 0.15;

	protected:
		using TMC2160Stepper::SHORT_CONF;
		using TMC2160Stepper::s2vs_level;
		using TMC2160Stepper::s2g_level;
		using TMC2160Stepper::shortfilter;
		using TMC2160Stepper::shortdelay;
		using TMC2160Stepper::DRV_CONF;
		using TMC2160Stepper::bbmtime;
		using TMC2160Stepper::bbmclks;
		using TMC2160Stepper::otselect;
		using TMC2160Stepper::drvstrength;
		using TMC2160Stepper::filt_isense;
		using TMC2160Stepper::GLOBAL_SCALER;
		using TMC2160Stepper::OFFSET_READ;

		using TMC2160Stepper::pwm_ofs;
		using TMC2160Stepper::pwm_autograd;
		using TMC2160Stepper::pwm_reg;
		using TMC2160Stepper::pwm_lim;

		using TMC2160Stepper::pwm_scale_sum;
		using TMC2160Stepper::pwm_scale_auto;
};
