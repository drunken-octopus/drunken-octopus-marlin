/**
 * TMCStepper library by @teemuatlut
 * TMC2160Stepper.cpp
 * Implementing methods for TMC2160 (TMC5130, TMC5160, TMC5161)
 */
#include "../TMCStepper.h"
#include "TMC_MACROS.h"

TMC2160Stepper::TMC2160Stepper(uint16_t pinCS, float RS, int8_t link) : TMC2130Stepper(pinCS, RS, link)
  { defaults(); }
TMC2160Stepper::TMC2160Stepper(uint16_t pinCS, float RS, uint16_t pinMOSI, uint16_t pinMISO, uint16_t pinSCK, int8_t link) :
  TMC2130Stepper(pinCS, RS, pinMOSI, pinMISO, pinSCK, link)
  { defaults(); }
TMC2160Stepper::TMC2160Stepper(uint16_t pinCS, uint16_t pinMOSI, uint16_t pinMISO, uint16_t pinSCK, int8_t link) :
  TMC2130Stepper(pinCS, default_RS, pinMOSI, pinMISO, pinSCK, link)
  { defaults(); }

void TMC2160Stepper::begin() {
  //set pins
  pinMode(_pinCS, OUTPUT);
  switchCSpin(HIGH);

  if (TMC_SW_SPI != nullptr) TMC_SW_SPI->init();

  GCONF(GCONF_register.sr);
  CHOPCONF(CHOPCONF_register.sr);
  COOLCONF(COOLCONF_register.sr);
  PWMCONF(PWMCONF_register.sr);
  IHOLD_IRUN(IHOLD_IRUN_register.sr);

  toff(8); //off_time(8);
  tbl(1); //blank_time(24);
}

void TMC2160Stepper::defaults() {
  SHORT_CONF_register.s2vs_level = 6;
  SHORT_CONF_register.s2g_level = 6;
  SHORT_CONF_register.shortfilter = 0b01;
  SHORT_CONF_register.shortdelay = 0;

  DRV_CONF_register.bbmtime = 0;
  DRV_CONF_register.bbmclks = 4;
  DRV_CONF_register.otselect = 0b00;
  DRV_CONF_register.drvstrength = 0b10;
  DRV_CONF_register.filt_isense = 0b00;

  TPOWERDOWN_register.sr = 10;

  //MSLUT0_register.sr = ???;
  //MSLUT1_register.sr = ???;
  //MSLUT2_register.sr = ???;
  //MSLUT3_register.sr = ???;
  //MSLUT4_register.sr = ???;
  //MSLUT5_register.sr = ???;
  //MSLUT6_register.sr = ???;
  //MSLUT7_register.sr = ???;

  //MSLUTSEL_register.sr = ???;

  //MSLUTSTART_register.start_sin = 0;
  //MSLUTSTART_register.start_sin90 = 247;

  //CHOPCONF_register.sr = 0x10410150;
  CHOPCONF_register.toff     = 0;
  CHOPCONF_register.hstrt    = 5;
  CHOPCONF_register.hend     = 2;
  CHOPCONF_register.disfdcc  = false;
  CHOPCONF_register.rndtf    = false;
  CHOPCONF_register.chm      = false;
  CHOPCONF_register.tbl      = 2;
  CHOPCONF_register.vsense   = false;
  CHOPCONF_register.vhighfs  = false;
  CHOPCONF_register.vhighchm = false;
  CHOPCONF_register.sync     = 4;
  CHOPCONF_register.mres     = 0;
  CHOPCONF_register.intpol   = true;
  CHOPCONF_register.dedge    = false;
  CHOPCONF_register.diss2g   = false;

  //PWMCONF_register.sr = 0xC40C001E;
  PWMCONF_register.pwm_ofs       = 30;
  PWMCONF_register.pwm_grad      = 0;
  PWMCONF_register.pwm_freq      = 0;
  PWMCONF_register.pwm_autoscale = true;
  PWMCONF_register.pwm_autograd  = true;
  PWMCONF_register.freewheel     = 0;
  PWMCONF_register.pwm_reg       = 4;
  PWMCONF_register.pwm_lim       = 12;
}

/*
  Requested current = mA = I_rms/1000
  Equation for current:
  I_rms = GLOBALSCALER/256 * (CS+1)/32 * V_fs/R_sense * 1/sqrt(2)
  Solve for GLOBALSCALER ->

                 32 * 256 * sqrt(2) * I_rms * R_sense    |
  GLOBALSCALER = ------------------------------------    |
                           (CS + 1) * V_fs               | V_fs = 0.325

*/
void TMC2160Stepper::rms_current(uint16_t mA) {
  constexpr uint32_t V_fs = 325; // 0.325 * 1000
  uint8_t CS = 31;
  uint32_t scaler = 0; // = 256

  const uint16_t RS_scaled = Rsense * 0xFFFF; // Scale to 16b
  uint32_t numerator = 11585; // 32 * 256 * sqrt(2)
  numerator *= RS_scaled;
  numerator >>= 8;
  numerator *= mA;

  do {
    uint32_t denominator = V_fs * 0xFFFF >> 8;
    denominator *= CS+1;
    scaler = numerator / denominator;

    if (scaler > 255) scaler = 0; // Maximum
    else if (scaler < 128) CS--;  // Try again with smaller CS
  } while(0 < scaler && scaler < 128);


  if (CS > 31)
    CS = 31;

  GLOBAL_SCALER(scaler);
  irun(CS);
  ihold(CS*holdMultiplier);
}
void TMC2160Stepper::rms_current(uint16_t mA, float mult) {
  holdMultiplier = mult;
  rms_current(mA);
}
uint16_t TMC2160Stepper::cs2rms(uint8_t CS) {
    uint16_t scaler = GLOBAL_SCALER();
    if (!scaler) scaler = 256;
    uint32_t numerator = scaler * (CS+1);
    numerator *= 325;
    numerator >>= (8+5); // Divide by 256 and 32
    numerator *= 1000000;
    uint32_t denominator = Rsense*1000;
    denominator *= 1414;

    return numerator / denominator;
}
uint16_t TMC2160Stepper::rms_current() { return cs2rms(irun()); }

void TMC2160Stepper::push() {
  GCONF(GCONF_register.sr);
  IHOLD_IRUN(IHOLD_IRUN_register.sr);
  TPOWERDOWN(TPOWERDOWN_register.sr);
  TPWMTHRS(TPWMTHRS_register.sr);
  TCOOLTHRS(TCOOLTHRS_register.sr);
  THIGH(THIGH_register.sr);
  XDIRECT(XDIRECT_register.sr);
  VDCMIN(VDCMIN_register.sr);
  CHOPCONF(CHOPCONF_register.sr);
  COOLCONF(COOLCONF_register.sr);
  DCCTRL(DCCTRL_register.sr);
  PWMCONF(PWMCONF_register.sr);
  SHORT_CONF(SHORT_CONF_register.sr);
  DRV_CONF(DRV_CONF_register.sr);
  GLOBAL_SCALER(GLOBAL_SCALER_register.sr);
}

// R: OFFSET_READ
uint16_t TMC2160Stepper::OFFSET_READ() { return read(OFFSET_READ_t::address); }

// R: PWM_SCALE
uint32_t TMC2160Stepper::PWM_SCALE() {
  return read(TMC2160_n::PWM_SCALE_t::address);
}
uint8_t TMC2160Stepper::pwm_scale_sum()   { TMC2160_n::PWM_SCALE_t r{}; r.sr = PWM_SCALE(); return r.pwm_scale_sum; }
uint16_t TMC2160Stepper::pwm_scale_auto() { TMC2160_n::PWM_SCALE_t r{}; r.sr = PWM_SCALE(); return r.pwm_scale_auto; }
