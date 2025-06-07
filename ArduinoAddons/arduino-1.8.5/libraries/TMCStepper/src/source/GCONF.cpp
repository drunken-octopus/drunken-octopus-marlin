/**
 * TMCStepper library by @teemuatlut
 * ENCMODE.cpp - Driver Status
 * TMC2130 (TMC2160, TMC5130, TMC5160, TMC5161), TMC5160 (TMC5161), TMC2208 (TMC2209, TMC2224)
 */
#include "../TMCStepper.h"
#include "TMC_MACROS.h"

#define GET_REG(SETTING) GCONF_t r{}; r.sr = GCONF(); return r.SETTING
#define SET_REG(SETTING) GCONF_register.SETTING = B; write(GCONF_register.address, GCONF_register.sr)

//
// TMC2130 (TMC2160, TMC5130, TMC5160, TMC5161)
//

uint32_t TMC2130Stepper::GCONF() {
	return read(GCONF_register.address);
}
void TMC2130Stepper::GCONF(uint32_t input) {
	GCONF_register.sr = input;
	write(GCONF_register.address, GCONF_register.sr);
}

void TMC2130Stepper::I_scale_analog(bool B)			{ SET_REG(i_scale_analog);			}
void TMC2130Stepper::internal_Rsense(bool B)		{ SET_REG(internal_rsense);			}
void TMC2130Stepper::en_pwm_mode(bool B)			{ SET_REG(en_pwm_mode);				}
void TMC2130Stepper::enc_commutation(bool B)		{ SET_REG(enc_commutation);			}
void TMC2130Stepper::shaft(bool B) 					{ SET_REG(shaft);					}
void TMC2130Stepper::diag0_error(bool B) 			{ SET_REG(diag0_error);				}
void TMC2130Stepper::diag0_otpw(bool B) 			{ SET_REG(diag0_otpw);				}
void TMC2130Stepper::diag0_stall(bool B) 			{ SET_REG(diag0_stall);				}
void TMC2130Stepper::diag1_stall(bool B) 			{ SET_REG(diag1_stall);				}
void TMC2130Stepper::diag1_index(bool B) 			{ SET_REG(diag1_index);				}
void TMC2130Stepper::diag1_onstate(bool B) 			{ SET_REG(diag1_onstate);			}
void TMC2130Stepper::diag1_steps_skipped(bool B) 	{ SET_REG(diag1_steps_skipped);		}
void TMC2130Stepper::diag0_int_pushpull(bool B) 	{ SET_REG(diag0_int_pushpull);		}
void TMC2130Stepper::diag1_pushpull(bool B) 		{ SET_REG(diag1_poscomp_pushpull);	}
void TMC2130Stepper::small_hysteresis(bool B) 		{ SET_REG(small_hysteresis);		}
void TMC2130Stepper::stop_enable(bool B) 			{ SET_REG(stop_enable);				}
void TMC2130Stepper::direct_mode(bool B) 			{ SET_REG(direct_mode);				}

bool TMC2130Stepper::I_scale_analog()				{ GET_REG(i_scale_analog);			}
bool TMC2130Stepper::internal_Rsense()				{ GET_REG(internal_rsense);			}
bool TMC2130Stepper::en_pwm_mode()					{ GET_REG(en_pwm_mode);				}
bool TMC2130Stepper::enc_commutation()				{ GET_REG(enc_commutation);			}
bool TMC2130Stepper::shaft() 						{ GET_REG(shaft);					}
bool TMC2130Stepper::diag0_error() 					{ GET_REG(diag0_error);				}
bool TMC2130Stepper::diag0_otpw() 					{ GET_REG(diag0_otpw);				}
bool TMC2130Stepper::diag0_stall() 					{ GET_REG(diag0_stall);				}
bool TMC2130Stepper::diag1_stall() 					{ GET_REG(diag1_stall);				}
bool TMC2130Stepper::diag1_index() 					{ GET_REG(diag1_index);				}
bool TMC2130Stepper::diag1_onstate() 				{ GET_REG(diag1_onstate);			}
bool TMC2130Stepper::diag1_steps_skipped() 			{ GET_REG(diag1_steps_skipped);		}
bool TMC2130Stepper::diag0_int_pushpull() 			{ GET_REG(diag0_int_pushpull);		}
bool TMC2130Stepper::diag1_pushpull()		 		{ GET_REG(diag1_poscomp_pushpull);	}
bool TMC2130Stepper::small_hysteresis() 			{ GET_REG(small_hysteresis);		}
bool TMC2130Stepper::stop_enable() 					{ GET_REG(stop_enable);				}
bool TMC2130Stepper::direct_mode() 					{ GET_REG(direct_mode);				}

//
// TMC5160 (TMC5161)
//

/*
bit 18 not implemented:
test_mode 0:
Normal operation 1:
Enable analog test output on pin DCO. IHOLD[1..0] selects the function of DCO:
0…2: T120, DAC, VDDH Attention:
Not for user, set to 0 for normal operation!
*/

void TMC5160Stepper::recalibrate(bool B)			{ SET_REG(recalibrate); 	}
void TMC5160Stepper::faststandstill(bool B)			{ SET_REG(faststandstill); 	}
void TMC5160Stepper::multistep_filt(bool B)			{ SET_REG(multistep_filt); 	}
bool TMC5160Stepper::recalibrate()					{ GET_REG(recalibrate);		}
bool TMC5160Stepper::faststandstill()				{ GET_REG(faststandstill);	}
bool TMC5160Stepper::multistep_filt()				{ GET_REG(multistep_filt);	}

//
// TMC2208 (TMC2209, TMC2224)
//
#define GET_REG_2208(SETTING) TMC2208_n::GCONF_t r{}; r.sr = GCONF(); return r.SETTING

uint32_t TMC2208Stepper::GCONF() {
	return read(GCONF_register.address);
}
void TMC2208Stepper::GCONF(uint32_t input) {
	GCONF_register.sr = input;
	write(GCONF_register.address, GCONF_register.sr);
}

void TMC2208Stepper::I_scale_analog(bool B)		{ SET_REG(i_scale_analog);	}
void TMC2208Stepper::internal_Rsense(bool B)	{ SET_REG(internal_rsense);	}
void TMC2208Stepper::en_spreadCycle(bool B)		{ SET_REG(en_spreadcycle);	}
void TMC2208Stepper::shaft(bool B) 				{ SET_REG(shaft);			}
void TMC2208Stepper::index_otpw(bool B)			{ SET_REG(index_otpw);		}
void TMC2208Stepper::index_step(bool B)			{ SET_REG(index_step);		}
void TMC2208Stepper::pdn_disable(bool B)		{ SET_REG(pdn_disable);		}
void TMC2208Stepper::mstep_reg_select(bool B)	{ SET_REG(mstep_reg_select);}
void TMC2208Stepper::multistep_filt(bool B)		{ SET_REG(multistep_filt);	}

bool TMC2208Stepper::I_scale_analog()	{ GET_REG_2208(i_scale_analog);		}
bool TMC2208Stepper::internal_Rsense()	{ GET_REG_2208(internal_rsense);	}
bool TMC2208Stepper::en_spreadCycle()	{ GET_REG_2208(en_spreadcycle);		}
bool TMC2208Stepper::shaft()			{ GET_REG_2208(shaft);				}
bool TMC2208Stepper::index_otpw()		{ GET_REG_2208(index_otpw);			}
bool TMC2208Stepper::index_step()		{ GET_REG_2208(index_step);			}
bool TMC2208Stepper::pdn_disable()		{ GET_REG_2208(pdn_disable);		}
bool TMC2208Stepper::mstep_reg_select()	{ GET_REG_2208(mstep_reg_select);	}
bool TMC2208Stepper::multistep_filt()	{ GET_REG_2208(multistep_filt);		}

//
// TMC2240
//
#define GET_REG_2240(SETTING) TMC2240_n::GCONF_t r{}; r.sr = GCONF(); return r.SETTING

uint32_t TMC2240Stepper::GCONF() { return read(GCONF_register.address); }
void TMC2240Stepper::GCONF(uint32_t input) {
	GCONF_register.sr = input;
	write(GCONF_register.address, GCONF_register.sr);
}

void TMC2240Stepper::fast_standstill(bool B)	{ SET_REG(fast_standstill);	}
void TMC2240Stepper::en_pwm_mode(bool B)		{ SET_REG(en_pwm_mode);	    }
void TMC2240Stepper::multistep_filt(bool B)		{ SET_REG(multistep_filt);	}
void TMC2240Stepper::shaft(bool B) 				{ SET_REG(shaft);			}
void TMC2240Stepper::diag0_error(bool B)		{ SET_REG(diag0_error);		}
void TMC2240Stepper::diag0_otpw(bool B)			{ SET_REG(diag0_otpw);		}
void TMC2240Stepper::diag0_stall(bool B)		{ SET_REG(diag0_stall);		}
void TMC2240Stepper::diag1_stall(bool B)		{ SET_REG(diag1_stall);  	}
void TMC2240Stepper::diag1_index(bool B)		{ SET_REG(diag1_index);		}
void TMC2240Stepper::diag1_onstate(bool B)		{ SET_REG(diag1_onstate);	}
void TMC2240Stepper::diag0_pushpull(bool B)		{ SET_REG(diag0_pushpull);	}
void TMC2240Stepper::diag1_pushpull(bool B)		{ SET_REG(diag1_pushpull);  }
void TMC2240Stepper::small_hysteresis(bool B)	{ SET_REG(small_hysteresis);}
void TMC2240Stepper::stop_enable(bool B)		{ SET_REG(stop_enable);		}
void TMC2240Stepper::direct_mode(bool B)		{ SET_REG(direct_mode); 	}

bool TMC2240Stepper::fast_standstill()		{ GET_REG_2240(fast_standstill);	}
bool TMC2240Stepper::en_pwm_mode()			{ GET_REG_2240(en_pwm_mode);		}
bool TMC2240Stepper::multistep_filt()		{ GET_REG_2240(multistep_filt);		}
bool TMC2240Stepper::shaft()				{ GET_REG_2240(shaft);				}
bool TMC2240Stepper::diag0_error()			{ GET_REG_2240(diag0_error);		}
bool TMC2240Stepper::diag0_otpw()			{ GET_REG_2240(diag0_otpw);			}
bool TMC2240Stepper::diag0_stall()			{ GET_REG_2240(diag0_stall);		}
bool TMC2240Stepper::diag1_stall()			{ GET_REG_2240(diag1_stall);		}
bool TMC2240Stepper::diag1_index()			{ GET_REG_2240(diag1_index);		}
bool TMC2240Stepper::diag1_onstate()		{ GET_REG_2240(diag1_onstate);		}
bool TMC2240Stepper::diag0_pushpull()		{ GET_REG_2240(diag0_pushpull);		}
bool TMC2240Stepper::diag1_pushpull()		{ GET_REG_2240(diag1_pushpull);		}
bool TMC2240Stepper::small_hysteresis()		{ GET_REG_2240(small_hysteresis);	}
bool TMC2240Stepper::stop_enable()			{ GET_REG_2240(stop_enable);		}
bool TMC2240Stepper::direct_mode()			{ GET_REG_2240(direct_mode);		}
