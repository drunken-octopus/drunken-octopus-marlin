/**
 * TMCStepper library by @teemuatlut
 * CHOPCONF.cpp - CHOPCONF Chopper Configuration
 * TMC2130 (TMC2160, TMC5130, TMC5160, TMC5161), TMC5160, TMC2208 (TMC2209, TMC2224), TMC2660
 */
#include "../TMCStepper.h"
#include "TMC_MACROS.h"

#define GET_REG(SETTING) CHOPCONF_t r{}; r.sr = CHOPCONF(); return r.SETTING
#define SET_REG(SETTING) CHOPCONF_register.SETTING = B; write(CHOPCONF_register.address, CHOPCONF_register.sr)

//
// TMC2130 (TMC2160, TMC5130, TMC5160, TMC5161)
//

uint32_t TMC2130Stepper::CHOPCONF() { return read(CHOPCONF_register.address); }
void TMC2130Stepper::CHOPCONF(uint32_t input) {
	CHOPCONF_register.sr = input;
	write(CHOPCONF_register.address, CHOPCONF_register.sr);
}

void TMC2130Stepper::toff(		uint8_t B )	{ SET_REG(toff);	}
void TMC2130Stepper::hstrt(		uint8_t B )	{ SET_REG(hstrt);	}
void TMC2130Stepper::hend(		uint8_t B )	{ SET_REG(hend);	}
//void TMC2130Stepper::fd(		uint8_t B )	{ SET_REG(fd);		}
void TMC2130Stepper::disfdcc(	bool	B )	{ SET_REG(disfdcc);	}
void TMC2130Stepper::rndtf(		bool	B )	{ SET_REG(rndtf);	}
void TMC2130Stepper::chm(		bool	B )	{ SET_REG(chm);		}
void TMC2130Stepper::tbl(		uint8_t B )	{ SET_REG(tbl);		}
void TMC2130Stepper::vsense(	bool	B )	{ SET_REG(vsense);	}
void TMC2130Stepper::vhighfs(	bool	B )	{ SET_REG(vhighfs);	}
void TMC2130Stepper::vhighchm(	bool	B )	{ SET_REG(vhighchm);}
void TMC2130Stepper::sync(		uint8_t B )	{ SET_REG(sync);	}
void TMC2130Stepper::mres(		uint8_t B )	{ SET_REG(mres);	}
void TMC2130Stepper::intpol(	bool	B )	{ SET_REG(intpol);	}
void TMC2130Stepper::dedge(		bool	B )	{ SET_REG(dedge);	}
void TMC2130Stepper::diss2g(	bool	B )	{ SET_REG(diss2g);	}

uint8_t TMC2130Stepper::toff()		{ GET_REG(toff);		}
uint8_t TMC2130Stepper::hstrt()		{ GET_REG(hstrt);		}
uint8_t TMC2130Stepper::hend()		{ GET_REG(hend);		}
//uint8_t TMC2130Stepper::fd()		{ GET_REG(fd);			}
bool	TMC2130Stepper::disfdcc()	{ GET_REG(disfdcc);		}
bool	TMC2130Stepper::rndtf()		{ GET_REG(rndtf);		}
bool	TMC2130Stepper::chm()		{ GET_REG(chm);			}
uint8_t TMC2130Stepper::tbl()		{ GET_REG(tbl);			}
bool	TMC2130Stepper::vsense()	{ GET_REG(vsense);		}
bool	TMC2130Stepper::vhighfs()	{ GET_REG(vhighfs);		}
bool	TMC2130Stepper::vhighchm()	{ GET_REG(vhighchm);	}
uint8_t TMC2130Stepper::sync()		{ GET_REG(sync);		}
uint8_t TMC2130Stepper::mres()		{ GET_REG(mres);		}
bool	TMC2130Stepper::intpol()	{ GET_REG(intpol);		}
bool	TMC2130Stepper::dedge()		{ GET_REG(dedge);		}
bool	TMC2130Stepper::diss2g()	{ GET_REG(diss2g);		}

//
// TMC5160 (TMC5161)
//

void TMC5160Stepper::diss2vs(bool B){ SET_REG(diss2vs); }
void TMC5160Stepper::tpfd(uint8_t B){ SET_REG(tpfd);	}
bool TMC5160Stepper::diss2vs()		{ GET_REG(diss2vs); }
uint8_t TMC5160Stepper::tpfd()		{ GET_REG(tpfd);	}

//
// TMC2208 (TMC2209, TMC2224)
//
#define GET_REG_2208(SETTING) TMC2208_n::CHOPCONF_t r{}; r.sr = CHOPCONF(); return r.SETTING

uint32_t TMC2208Stepper::CHOPCONF() { return read(CHOPCONF_register.address); }
void TMC2208Stepper::CHOPCONF(uint32_t input) {
	CHOPCONF_register.sr = input;
	write(CHOPCONF_register.address, CHOPCONF_register.sr);
}
void TMC2208Stepper::toff	( uint8_t  B )	{ SET_REG(toff);	}
void TMC2208Stepper::hstrt	( uint8_t  B )	{ SET_REG(hstrt);	}
void TMC2208Stepper::hend	( uint8_t  B )	{ SET_REG(hend);	}
void TMC2208Stepper::tbl	( uint8_t  B )	{ SET_REG(tbl);	}
void TMC2208Stepper::vsense	( bool     B )	{ SET_REG(vsense);	}
void TMC2208Stepper::mres	( uint8_t  B )	{ SET_REG(mres);	}
void TMC2208Stepper::intpol	( bool     B )	{ SET_REG(intpol);	}
void TMC2208Stepper::dedge	( bool     B )	{ SET_REG(dedge);	}
void TMC2208Stepper::diss2g	( bool     B )	{ SET_REG(diss2g);	}
void TMC2208Stepper::diss2vs( bool     B )	{ SET_REG(diss2vs); }

uint8_t TMC2208Stepper::toff()		{ GET_REG_2208(toff);		}
uint8_t TMC2208Stepper::hstrt()		{ GET_REG_2208(hstrt);		}
uint8_t TMC2208Stepper::hend()		{ GET_REG_2208(hend);		}
uint8_t TMC2208Stepper::tbl()		{ GET_REG_2208(tbl);		}
bool	TMC2208Stepper::vsense()	{ GET_REG_2208(vsense);		}
uint8_t TMC2208Stepper::mres()		{ GET_REG_2208(mres);		}
bool	TMC2208Stepper::intpol()	{ GET_REG_2208(intpol);		}
bool	TMC2208Stepper::dedge()		{ GET_REG_2208(dedge);		}
bool	TMC2208Stepper::diss2g()	{ GET_REG_2208(diss2g);		}
bool	TMC2208Stepper::diss2vs()	{ GET_REG_2208(diss2vs);	}

//
// TMC2240
//
#define GET_REG_2240(SETTING) TMC2240_n::CHOPCONF_t r{}; r.sr = CHOPCONF(); return r.SETTING

uint32_t TMC2240Stepper::CHOPCONF() { return read(CHOPCONF_register.address); }
void TMC2240Stepper::CHOPCONF(uint32_t input) {
	CHOPCONF_register.sr = input;
	write(CHOPCONF_register.address, CHOPCONF_register.sr);
}
void TMC2240Stepper::toff(uint8_t B)	{ SET_REG(toff);	}
void TMC2240Stepper::hstrt(uint8_t B)	{ SET_REG(hstrt);	}
void TMC2240Stepper::hend(uint8_t B)	{ SET_REG(hend);	}
void TMC2240Stepper::fd3(bool B)		{ SET_REG(fd3);		}
void TMC2240Stepper::disfdcc(bool B)	{ SET_REG(disfdcc);	}
void TMC2240Stepper::chm(bool B)		{ SET_REG(chm);		}
void TMC2240Stepper::TBL(uint8_t B)		{ SET_REG(TBL);		}
void TMC2240Stepper::vhighfs(bool B)	{ SET_REG(vhighfs);	}
void TMC2240Stepper::vhighchm(bool B)	{ SET_REG(vhighchm);}
void TMC2240Stepper::tpfd(uint8_t B)	{ SET_REG(tpfd);	}
void TMC2240Stepper::mres(uint8_t B)	{ SET_REG(mres);	}
void TMC2240Stepper::intpol(bool B)		{ SET_REG(intpol);	}
void TMC2240Stepper::dedge(bool B)		{ SET_REG(dedge);	}
void TMC2240Stepper::diss2g(bool B)		{ SET_REG(diss2g);	}
void TMC2240Stepper::diss2vs(bool B)	{ SET_REG(diss2vs);	}

uint8_t TMC2240Stepper::toff()		{ GET_REG_2240(toff);		}
uint8_t TMC2240Stepper::hstrt()		{ GET_REG_2240(hstrt);		}
uint8_t TMC2240Stepper::hend()		{ GET_REG_2240(hend);		}
bool	TMC2240Stepper::fd3()		{ GET_REG_2240(fd3);		}
bool	TMC2240Stepper::disfdcc()	{ GET_REG_2240(disfdcc);	}
bool	TMC2240Stepper::chm()		{ GET_REG_2240(chm);		}
uint8_t TMC2240Stepper::TBL()		{ GET_REG_2240(TBL);		}
bool	TMC2240Stepper::vhighfs()	{ GET_REG_2240(vhighfs);	}
bool	TMC2240Stepper::vhighchm()	{ GET_REG_2240(vhighchm);	}
uint8_t TMC2240Stepper::tpfd()		{ GET_REG_2240(tpfd);		}
uint8_t TMC2240Stepper::mres()		{ GET_REG_2240(mres);		}
bool	TMC2240Stepper::intpol()	{ GET_REG_2240(intpol);		}
bool	TMC2240Stepper::dedge()		{ GET_REG_2240(dedge);		}
bool	TMC2240Stepper::diss2g()	{ GET_REG_2240(diss2g);		}
bool	TMC2240Stepper::diss2vs()	{ GET_REG_2240(diss2vs);	}

//
// TMC2660
//
#define GET_REG_2660(SETTING) return CHOPCONF_register.SETTING;

uint32_t TMC2660Stepper::CHOPCONF() { return CHOPCONF_register.sr; }
void TMC2660Stepper::CHOPCONF(uint32_t data) {
  CHOPCONF_register.sr = data;
  write(CHOPCONF_register.address, CHOPCONF_register.sr);
}

void TMC2660Stepper::toff(uint8_t B) {
	SET_REG(toff);
	if (B>0) _savedToff = B;
}
void TMC2660Stepper::hstrt(uint8_t B)	{ SET_REG(hstrt); 	}
void TMC2660Stepper::hend(uint8_t B)	{ SET_REG(hend);	}
void TMC2660Stepper::hdec(uint8_t B)	{ SET_REG(hdec);	}
void TMC2660Stepper::rndtf(bool B)		{ SET_REG(rndtf);	}
void TMC2660Stepper::chm(bool B)		{ SET_REG(chm);	}
void TMC2660Stepper::tbl(uint8_t B)		{ SET_REG(tbl);	}

uint8_t TMC2660Stepper::toff()	{ GET_REG_2660(toff);	}
uint8_t TMC2660Stepper::hstrt() { GET_REG_2660(hstrt);	}
uint8_t TMC2660Stepper::hend()	{ GET_REG_2660(hend);	}
uint8_t TMC2660Stepper::hdec()	{ GET_REG_2660(hdec);	}
bool TMC2660Stepper::rndtf()	{ GET_REG_2660(rndtf);	}
bool TMC2660Stepper::chm()		{ GET_REG_2660(chm);	}
uint8_t TMC2660Stepper::tbl()	{ GET_REG_2660(tbl);	}
