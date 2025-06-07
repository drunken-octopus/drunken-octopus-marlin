/**
 * TMCStepper library by @teemuatlut
 *
 * TMC2208Stepper.h
 * Individual header for class TMC2208Stepper
 */
#pragma once

#define INIT2208_REGISTER(REG) TMC2208_n::REG##_t REG##_register{}

class TMC2208Stepper : public TMCStepper {
	public:
		TMC2208Stepper(Stream * SerialPort, float RS, uint8_t addr, uint16_t mul_pin1, uint16_t mul_pin2);
		TMC2208Stepper(Stream * SerialPort, float RS) :
			TMC2208Stepper(SerialPort, RS, TMC2208_SLAVE_ADDR)
			{}
		#if SW_CAPABLE_PLATFORM
			TMC2208Stepper(uint16_t SW_RX_pin, uint16_t SW_TX_pin, float RS) :
				TMC2208Stepper(SW_RX_pin, SW_TX_pin, RS, TMC2208_SLAVE_ADDR)
				{}

			__attribute__((deprecated("Boolean argument has been deprecated and does nothing")))
			TMC2208Stepper(uint16_t SW_RX_pin, uint16_t SW_TX_pin, float RS, bool) :
				TMC2208Stepper(SW_RX_pin, SW_TX_pin, RS, TMC2208_SLAVE_ADDR)
				{};
		#else
			TMC2208Stepper(uint16_t, uint16_t, float) = delete; // Your platform does not currently support Software Serial
		#endif
		void defaults();
		void push();
		void begin();
		#if SW_CAPABLE_PLATFORM
			void beginSerial(uint32_t baudrate) __attribute__((weak));
		#else
			void beginSerial(uint32_t) = delete; // Your platform does not currently support Software Serial
		#endif
		bool isEnabled();

		// RW: GCONF
		void GCONF(uint32_t input);
		void I_scale_analog(bool B);
		void internal_Rsense(bool B);
		void en_spreadCycle(bool B);
		void shaft(bool B);
		void index_otpw(bool B);
		void index_step(bool B);
		void pdn_disable(bool B);
		void mstep_reg_select(bool B);
		void multistep_filt(bool B);
		uint32_t GCONF();
		bool I_scale_analog();
		bool internal_Rsense();
		bool en_spreadCycle();
		bool shaft();
		bool index_otpw();
		bool index_step();
		bool pdn_disable();
		bool mstep_reg_select();
		bool multistep_filt();

		// R: IFCNT
		uint8_t IFCNT();

		// W: SLAVECONF
		void SLAVECONF(uint16_t input);
		uint16_t SLAVECONF();
		void senddelay(uint8_t B);
		uint8_t senddelay();

		// W: OTP_PROG
		void OTP_PROG(uint16_t input);

		// R: OTP_READ
		uint32_t OTP_READ();

		// R: IOIN
		uint32_t IOIN();
		bool enn();
		bool ms1();
		bool ms2();
		bool diag();
		bool pdn_uart();
		bool step();
		bool sel_a();
		bool dir();
		uint8_t version();

		// RW: FACTORY_CONF
		void FACTORY_CONF(uint16_t input);
		uint16_t FACTORY_CONF();
		void fclktrim(uint8_t B);
		void ottrim(uint8_t B);
		uint8_t fclktrim();
		uint8_t ottrim();

		// W: VACTUAL
		void VACTUAL(uint32_t input);
		uint32_t VACTUAL();

		// RW: CHOPCONF
		void CHOPCONF(uint32_t input);
		void toff(uint8_t B);
		void hstrt(uint8_t B);
		void hend(uint8_t B);
		void tbl(uint8_t B);
		void vsense(bool B);
		void mres(uint8_t B);
		void intpol(bool B);
		void dedge(bool B);
		void diss2g(bool B);
		void diss2vs(bool B);
		uint32_t CHOPCONF();
		uint8_t toff();
		uint8_t hstrt();
		uint8_t hend();
		uint8_t tbl();
		bool vsense();
		uint8_t mres();
		bool intpol();
		bool dedge();
		bool diss2g();
		bool diss2vs();

		// R: DRV_STATUS
		uint32_t DRV_STATUS();
		bool otpw();
		bool ot();
		bool s2ga();
		bool s2gb();
		bool s2vsa();
		bool s2vsb();
		bool ola();
		bool olb();
		bool t120();
		bool t143();
		bool t150();
		bool t157();
		uint16_t cs_actual();
		bool stealth();
		bool stst();

		// RW: PWMCONF
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
		int16_t pwm_scale_auto();

		// R: PWM_AUTO (0x72)
		uint32_t PWM_AUTO();
		uint8_t pwm_ofs_auto();
		uint8_t pwm_grad_auto();

		uint16_t bytesWritten = 0;
		float Rsense = 0.11;
		bool CRCerror = false;
	protected:
		INIT2208_REGISTER(GCONF);
		INIT_REGISTER(SLAVECONF);
		INIT_REGISTER(FACTORY_CONF);
		INIT2208_REGISTER(VACTUAL);
		INIT2208_REGISTER(CHOPCONF);
		INIT2208_REGISTER(PWMCONF);

		struct IFCNT_t			{ constexpr static uint8_t address = 0x02; };
		struct OTP_PROG_t		{ constexpr static uint8_t address = 0x04; };
		struct OTP_READ_t		{ constexpr static uint8_t address = 0x05; };

		TMC2208Stepper(Stream * SerialPort, float RS, uint8_t addr);
		#if SW_CAPABLE_PLATFORM
			TMC2208Stepper(uint16_t SW_RX_pin, uint16_t SW_TX_pin, float RS, uint8_t addr);
		#endif

		Stream * HWSerial = nullptr;
		#if SW_CAPABLE_PLATFORM
			SoftwareSerial * SWSerial = nullptr;
			const uint16_t RXTX_pin = 0; // Half duplex
		#endif

		SSwitch *sswitch = nullptr;

		int available();
		void preWriteCommunication();
		void preReadCommunication();
		int16_t serial_read();
		uint8_t serial_write(const uint8_t data);
		void postWriteCommunication();
		void postReadCommunication();
		void write(uint8_t, uint32_t);
		uint32_t read(uint8_t);
		const uint8_t slave_address;
		uint8_t calcCRC(uint8_t datagram[], uint8_t len);
		static constexpr uint8_t  TMC2208_SYNC = 0x05,
															TMC2208_SLAVE_ADDR = 0x00;
		static constexpr uint8_t replyDelay = 2;
		static constexpr uint8_t abort_window = 5;
		static constexpr uint8_t max_retries = 2;

		uint64_t _sendDatagram(uint8_t [], const uint8_t, uint16_t);
};
