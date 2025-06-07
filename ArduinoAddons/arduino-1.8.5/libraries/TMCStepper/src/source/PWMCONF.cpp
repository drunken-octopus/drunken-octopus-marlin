/**
 * TMCStepper library by @teemuatlut
 * PWMCONF.cpp - PWM Configuration
 * TMC2130 (TMC2160, TMC5130, TMC5160, TMC5161), TMC2160 (TMC5130, TMC5160, TMC5161), TMC2208 (TMC2209, TMC2224)
 */
#include "../TMCStepper.h"
#include "TMC_MACROS.h"

#define SET_REG(SETTING) PWMCONF_register.SETTING = B; write(PWMCONF_register.address, PWMCONF_register.sr)
#define GET_REG(SETTING) return PWMCONF_register.SETTING

//
// TMC2130 (TMC2160, TMC5130, TMC5160, TMC5161)
//

uint32_t TMC2130Stepper::PWMCONF() { return PWMCONF_register.sr; }
void TMC2130Stepper::PWMCONF(uint32_t input) {
	PWMCONF_register.sr = input;
	write(PWMCONF_register.address, PWMCONF_register.sr);
}

void TMC2130Stepper::pwm_ampl(		uint8_t B )	{ SET_REG(pwm_ampl);		}
void TMC2130Stepper::pwm_grad(		uint8_t B )	{ SET_REG(pwm_grad);		}
void TMC2130Stepper::pwm_freq(		uint8_t B )	{ SET_REG(pwm_freq);		}
void TMC2130Stepper::pwm_autoscale(	bool 	B )	{ SET_REG(pwm_autoscale);	}
void TMC2130Stepper::pwm_symmetric(	bool 	B )	{ SET_REG(pwm_symmetric);	}
void TMC2130Stepper::freewheel(		uint8_t B )	{ SET_REG(freewheel);		}

uint8_t TMC2130Stepper::pwm_ampl()		{ GET_REG(pwm_ampl);		}
uint8_t TMC2130Stepper::pwm_grad()		{ GET_REG(pwm_grad);		}
uint8_t TMC2130Stepper::pwm_freq()		{ GET_REG(pwm_freq);		}
bool 	TMC2130Stepper::pwm_autoscale()	{ GET_REG(pwm_autoscale);	}
bool 	TMC2130Stepper::pwm_symmetric()	{ GET_REG(pwm_symmetric);	}
uint8_t TMC2130Stepper::freewheel()		{ GET_REG(freewheel);		}

//
// TMC2160 (TMC5130, TMC5160, TMC5161)
//

uint32_t TMC2160Stepper::PWMCONF() {
	return PWMCONF_register.sr;
}
void TMC2160Stepper::PWMCONF(uint32_t input) {
	PWMCONF_register.sr = input;
	write(PWMCONF_register.address, PWMCONF_register.sr);
}

void TMC2160Stepper::pwm_ofs		( uint8_t B ) { SET_REG(pwm_ofs);		}
void TMC2160Stepper::pwm_grad		( uint8_t B ) { SET_REG(pwm_grad);		}
void TMC2160Stepper::pwm_freq		( uint8_t B ) { SET_REG(pwm_freq);		}
void TMC2160Stepper::pwm_autoscale	( bool 	  B ) { SET_REG(pwm_autoscale);	}
void TMC2160Stepper::pwm_autograd	( bool    B ) { SET_REG(pwm_autograd);	}
void TMC2160Stepper::freewheel		( uint8_t B ) { SET_REG(freewheel);		}
void TMC2160Stepper::pwm_reg		( uint8_t B ) { SET_REG(pwm_reg);		}
void TMC2160Stepper::pwm_lim		( uint8_t B ) { SET_REG(pwm_lim);		}

uint8_t TMC2160Stepper::pwm_ofs()		{ GET_REG(pwm_ofs);			}
uint8_t TMC2160Stepper::pwm_grad()		{ GET_REG(pwm_grad);		}
uint8_t TMC2160Stepper::pwm_freq()		{ GET_REG(pwm_freq);		}
bool 	TMC2160Stepper::pwm_autoscale()	{ GET_REG(pwm_autoscale);	}
bool 	TMC2160Stepper::pwm_autograd()	{ GET_REG(pwm_autograd);	}
uint8_t TMC2160Stepper::freewheel()		{ GET_REG(freewheel);		}
uint8_t TMC2160Stepper::pwm_reg()		{ GET_REG(pwm_reg);			}
uint8_t TMC2160Stepper::pwm_lim()		{ GET_REG(pwm_lim);			}

//
// TMC2208 (TMC2209, TMC2224)
//
#define GET_REG_2208(SETTING) TMC2208_n::PWMCONF_t r{}; r.sr = PWMCONF(); return r.SETTING

uint32_t TMC2208Stepper::PWMCONF() {
	return read(PWMCONF_register.address);
}
void TMC2208Stepper::PWMCONF(uint32_t input) {
	PWMCONF_register.sr = input;
	write(PWMCONF_register.address, PWMCONF_register.sr);
}

void TMC2208Stepper::pwm_ofs		( uint8_t B ) { SET_REG(pwm_ofs);		}
void TMC2208Stepper::pwm_grad		( uint8_t B ) { SET_REG(pwm_grad);		}
void TMC2208Stepper::pwm_freq		( uint8_t B ) { SET_REG(pwm_freq);		}
void TMC2208Stepper::pwm_autoscale	( bool 	  B ) { SET_REG(pwm_autoscale);	}
void TMC2208Stepper::pwm_autograd	( bool    B ) { SET_REG(pwm_autograd);	}
void TMC2208Stepper::freewheel		( uint8_t B ) { SET_REG(freewheel);		}
void TMC2208Stepper::pwm_reg		( uint8_t B ) { SET_REG(pwm_reg);		}
void TMC2208Stepper::pwm_lim		( uint8_t B ) { SET_REG(pwm_lim);		}

uint8_t TMC2208Stepper::pwm_ofs()		{ GET_REG_2208(pwm_ofs);		}
uint8_t TMC2208Stepper::pwm_grad()		{ GET_REG_2208(pwm_grad);		}
uint8_t TMC2208Stepper::pwm_freq()		{ GET_REG_2208(pwm_freq);		}
bool 	TMC2208Stepper::pwm_autoscale()	{ GET_REG_2208(pwm_autoscale);	}
bool 	TMC2208Stepper::pwm_autograd()	{ GET_REG_2208(pwm_autograd);	}
uint8_t TMC2208Stepper::freewheel()		{ GET_REG_2208(freewheel);		}
uint8_t TMC2208Stepper::pwm_reg()		{ GET_REG_2208(pwm_reg);		}
uint8_t TMC2208Stepper::pwm_lim()		{ GET_REG_2208(pwm_lim);		}

//
// TMC2240
//
#define GET_REG_2240(SETTING) TMC2240_n::PWMCONF_t r{}; r.sr = PWMCONF(); return r.SETTING

uint32_t TMC2240Stepper::PWMCONF() { return PWMCONF_register.sr; }
void TMC2240Stepper::PWMCONF(uint32_t input) {
	PWMCONF_register.sr = input;
	write(PWMCONF_register.address, PWMCONF_register.sr);
}

void TMC2240Stepper::pwm_ofs			( uint8_t B ) { SET_REG(pwm_ofs);		}
void TMC2240Stepper::pwm_grad			( uint8_t B ) { SET_REG(pwm_grad);		}
void TMC2240Stepper::pwm_freq			( uint8_t B ) { SET_REG(pwm_freq);		}
void TMC2240Stepper::pwm_autoscale		( bool 	  B ) { SET_REG(pwm_autoscale);	}
void TMC2240Stepper::pwm_autograd		( bool    B ) { SET_REG(pwm_autograd);	}
void TMC2240Stepper::freewheel			( uint8_t B ) { SET_REG(freewheel);		}
void TMC2240Stepper::pwm_meas_sd_enable	( bool 	  B ) { SET_REG(pwm_autoscale);	}
void TMC2240Stepper::pwm_dis_reg_stst	( bool    B ) { SET_REG(pwm_autograd);	}
void TMC2240Stepper::pwm_reg			( uint8_t B ) { SET_REG(pwm_reg);		}
void TMC2240Stepper::pwm_lim			( uint8_t B ) { SET_REG(pwm_lim);		}

uint8_t TMC2240Stepper::pwm_ofs()				{ GET_REG_2240(pwm_ofs);		}
uint8_t TMC2240Stepper::pwm_grad()				{ GET_REG_2240(pwm_grad);		}
uint8_t TMC2240Stepper::pwm_freq()				{ GET_REG_2240(pwm_freq);		}
bool 	TMC2240Stepper::pwm_autoscale()			{ GET_REG_2240(pwm_autoscale);	}
bool 	TMC2240Stepper::pwm_autograd()			{ GET_REG_2240(pwm_autograd);	}
uint8_t TMC2240Stepper::freewheel()				{ GET_REG_2240(freewheel);		}
bool 	TMC2240Stepper::pwm_meas_sd_enable()	{ GET_REG_2240(pwm_autoscale);	}
bool 	TMC2240Stepper::pwm_dis_reg_stst()		{ GET_REG_2240(pwm_autograd);	}
uint8_t TMC2240Stepper::pwm_reg()				{ GET_REG_2240(pwm_reg);		}
uint8_t TMC2240Stepper::pwm_lim()				{ GET_REG_2240(pwm_lim);		}
