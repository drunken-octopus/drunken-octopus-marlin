/**
 * TMCStepper library by @teemuatlut
 *
 * TMC2240Stepper.h
 * Individual header for class TMC2240Stepper
 */
#pragma once

#define INIT2240_REGISTER(REG) TMC2240_n::REG##_t REG##_register{}

class TMC2240Stepper {
	public:
		TMC2240Stepper(uint16_t pinCS, int8_t link_index = -1);
		TMC2240Stepper(uint16_t pinCS, uint16_t pinMOSI, uint16_t pinMISO, uint16_t pinSCK, int8_t link_index = -1);

		/**
		 * ('rref', 12000, minval=12000, maxval=60000)
		 */
		uint32_t Rref = 12000;
		void begin();
		void defaults();
		void setSPISpeed(uint32_t speed);
		void switchCSpin(bool state);
		bool isEnabled();
		void push();

		// RW: GCONF
		void GCONF(uint32_t input);
		void fast_standstill(bool B);
		void en_pwm_mode(bool B);
		void multistep_filt(bool B);
		void shaft(bool B);
		void diag0_error(bool B);
		void diag0_otpw(bool B);
		void diag0_stall(bool B);
		void diag1_stall(bool B);
		void diag1_index(bool B);
		void diag1_onstate(bool B);
		void diag0_pushpull(bool B);
		void diag1_pushpull(bool B);
		void small_hysteresis(bool B);
		void stop_enable(bool B);
		void direct_mode(bool B);
		uint32_t GCONF();
		bool fast_standstill();
		bool en_pwm_mode();
		bool multistep_filt();
		bool shaft();
		bool diag0_error();
		bool diag0_otpw();
		bool diag0_stall();
		bool diag1_stall();
		bool diag1_index();
		bool diag1_onstate();
		bool diag0_pushpull();
		bool diag1_pushpull();
		bool small_hysteresis();
		bool stop_enable();
		bool direct_mode();

		// R+WC: GSTAT
		void 	GSTAT(uint8_t input);
		uint8_t GSTAT();
		bool 	reset();
		bool 	drv_err();
		bool 	uv_cp();
		bool	register_reset();
		bool    vm_uvlo();
		// R: IFCNT

		uint8_t IFCNT();

		// W: SLAVECONF
		void SLAVECONF(uint16_t input);
		uint16_t SLAVECONF();
		void senddelay(uint8_t B);
		uint8_t senddelay();
		void slaveaddr(uint8_t B);
		uint8_t slaveaddr();

		// R: IOIN
		uint32_t IOIN();
		bool step();
		bool dir();
		bool encb();
		bool enca();
		bool drv_enn();
		bool encn();
		bool uart_en();
		bool comp_a();
		bool comp_b();
		bool comp_a1_a2();
		bool comp_b1_b2();
		bool output();
		bool ext_res_det();
		bool ext_clk();
		bool adc_err();
		uint8_t silicon_rv();
		uint8_t version();

		// W: DRV_CONF
		void DRV_CONF(uint32_t input);
		void current_range(uint8_t);
		uint8_t current_range();
		void slope_control(uint8_t);
		uint8_t slope_control();
		uint32_t DRV_CONF();

		void GLOBAL_SCALER(uint8_t input);
		uint8_t GLOBAL_SCALER();

		// W: IHOLD_IRUN
		void IHOLD_IRUN(uint32_t input);
		uint32_t IHOLD_IRUN();
		void 	ihold(uint8_t B);
		void 	irun(uint8_t B);
		void 	iholddelay(uint8_t B);
		void 	irundelay(uint8_t B);
		uint8_t ihold();
		uint8_t irun();
		uint8_t iholddelay();
		uint8_t irundelay();

		// W: TCOOLTHRS
		uint32_t TCOOLTHRS();
		void TCOOLTHRS(	uint32_t input);

		// W: THIGH
		uint32_t THIGH();
		void THIGH(	uint32_t input);

		// RW: CHOPCONF
		void CHOPCONF(uint32_t input);
		void toff(uint8_t B);
		void hstrt(uint8_t B);
		void hend(uint8_t B);
		void fd3(bool B);
		void disfdcc(bool B);
		void chm(bool B);
		void TBL(uint8_t B);
		void vhighfs(bool B);
		void vhighchm(bool B);
		void tpfd(uint8_t B);
		void mres(uint8_t B);
		void intpol(bool B);
		void dedge(bool B);
		void diss2g(bool B);
		void diss2vs(bool B);
		uint32_t CHOPCONF();
		uint8_t toff();
		uint8_t hstrt();
		uint8_t hend();
		bool fd3();
		bool disfdcc();
		bool chm();
		uint8_t TBL();
		bool vhighfs();
		bool vhighchm();
		uint8_t tpfd();
		uint8_t mres();
		bool intpol();
		bool dedge();
		bool diss2g();
		bool diss2vs();

		// RW: COOLCONF
		void COOLCONF(uint32_t B);
		uint32_t COOLCONF();
		void semin(uint8_t B);
		void seup(uint8_t B);
		void semax(uint8_t B);
		void sedn(uint8_t B);
		void seimin(bool B);
		void sgt(int8_t  B);
		void sfilt(bool B);
		uint8_t semin();
		uint8_t seup();
		uint8_t semax();
		uint8_t sedn();
		bool seimin();
		int8_t sgt();
		bool sfilt();

		// RW: PWMCONF
		void PWMCONF(uint32_t input);
		void pwm_ofs(uint8_t B);
		void pwm_grad(uint8_t B);
		void pwm_freq(uint8_t B);
		void pwm_autoscale(bool B);
		void pwm_autograd(bool B);
		void freewheel(uint8_t B);
		void pwm_meas_sd_enable(bool B);
		void pwm_dis_reg_stst(bool B);
		void pwm_reg(uint8_t B);
		void pwm_lim(uint8_t B);
		uint32_t PWMCONF();
		uint8_t pwm_ofs();
		uint8_t pwm_grad();
		uint8_t pwm_freq();
		bool pwm_autoscale();
		bool pwm_autograd();
		uint8_t freewheel();
		bool pwm_meas_sd_enable();
		bool pwm_dis_reg_stst();
		uint8_t pwm_reg();
		uint8_t pwm_lim();

		// R: PWM_SCALE
		uint32_t PWM_SCALE();
		uint8_t pwm_scale_sum();
		int16_t pwm_scale_auto();

		// R: PWM_AUTO
		uint32_t PWM_AUTO();
		uint8_t pwm_ofs_auto();
		uint8_t pwm_grad_auto();

		uint32_t DRV_STATUS();
		uint32_t SG_RESULT();
		bool s2vsa();
		bool s2vsb();
		bool stealth();
		bool fsactive();
		uint16_t CS_ACTUAL();
		bool stallguard();
		bool ot();
		bool otpw();
		bool s2ga();
		bool s2gb();
		bool ola();
		bool olb();
		bool stst();

		uint16_t bytesWritten = 0;
		bool CRCerror = false;

		void microsteps(uint16_t ms);
		uint16_t microsteps();

		uint8_t test_connection();
		uint16_t MSCNT();

		uint16_t cs2rms(uint8_t CS);
		void rms_current(uint16_t mA);
		void rms_current(uint16_t mA, float mult);
		uint16_t rms_current();

		void hysteresis_end(int8_t value);
		int8_t hysteresis_end();
		void hysteresis_start(uint8_t value);
		uint8_t hysteresis_start();

		uint8_t TPOWERDOWN();
		void TPOWERDOWN(uint8_t input);

		// RW: TPWMTHRS
		uint32_t TPWMTHRS();
		void TPWMTHRS(						uint32_t input);

		// R: TSTEP
		uint32_t TSTEP();

		// RW: SG4_THRS
		uint32_t SG4_THRS();
		void SG4_THRS(uint32_t input);
		uint8_t sg4_thrs();
		void sg4_thrs(uint8_t B);
		bool sg4_filt_en();
		void sg4_filt_en(bool B);
		uint8_t sg4_angle_offset();
		void sg4_angle_offset(uint8_t B);

		// R: SG4_RESULT
		uint32_t SG4_RESULT();
		uint16_t sg4_result();

		uint8_t status_response;

	protected:
		INIT2240_REGISTER(GCONF);			// 16b
		INIT2240_REGISTER(GSTAT);			// 8b
		INIT2240_REGISTER(TPOWERDOWN);		// 8b
		INIT2240_REGISTER(SLAVECONF);		// 16b
		INIT2240_REGISTER(IOIN);			// 32b
		INIT2240_REGISTER(DRV_CONF);		// 32b
		INIT2240_REGISTER(DRV_STATUS);		// 32b
		INIT2240_REGISTER(GLOBAL_SCALER);	// 8b
		INIT2240_REGISTER(IHOLD_IRUN);		// 32b
		INIT2240_REGISTER(TSTEP);			// 32b
		INIT2240_REGISTER(TPWMTHRS);		// 32b
		INIT2240_REGISTER(TCOOLTHRS);		// 32b
		INIT2240_REGISTER(THIGH);			// 32b
		INIT2240_REGISTER(CHOPCONF);		// 32b
		INIT2240_REGISTER(COOLCONF);		// 32b
		INIT2240_REGISTER(PWMCONF);			// 32b
		INIT2240_REGISTER(PWM_SCALE);		// 32b
		INIT2240_REGISTER(PWM_AUTO);		// 32b
		INIT2240_REGISTER(SG4_THRS);		// 32b
		INIT2240_REGISTER(SG4_RESULT);		// 32b
		//INIT2240_REGISTER(SG4_IND);

		struct IFCNT_t 		{ constexpr static uint8_t address = 0x02; };
		struct TSTEP_t 		{ constexpr static uint8_t address = 0x12; };
		struct MSCNT_t 		{ constexpr static uint8_t address = 0x6A; };

		float 		calc_IFS_current_RMS();
		uint32_t	set_globalscaler(float current, float IFS_current_RMS);

		void beginTransaction();
		void endTransaction();
		uint8_t transfer(const uint8_t data);
		void transferEmptyBytes(const uint8_t n);
		void write(uint8_t addressByte, uint32_t config);
		uint32_t read(uint8_t addressByte);

		static constexpr uint8_t TMC_READ = 0x00, TMC_WRITE = 0x80;

		SSwitch *sswitch = nullptr;

		static constexpr uint8_t TMC2240_SYNC = 0x05;
		static constexpr uint8_t replyDelay = 2;
		static constexpr uint8_t abort_window = 5;
		static constexpr uint8_t max_retries = 2;

		uint64_t _sendDatagram(uint8_t [], const uint8_t, uint16_t);
		float holdMultiplier = 0.5;

		static uint32_t spi_speed; // Default 2MHz
		const uint16_t _pinCS;
		SW_SPIClass * TMC_SW_SPI = nullptr;
		static constexpr float default_RS = 0.11;

		int8_t link_index;
		static int8_t chain_length;
};
