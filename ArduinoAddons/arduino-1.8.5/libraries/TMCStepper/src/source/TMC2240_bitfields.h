/**
 * TMCStepper library by @teemuatlut
 * TMC2240_bitfields.h
 *
 * TMC2240 hardware register bit fields:
 * CHOPCONF, COOLCONF, DRV_CONF, PWMCONF, SLAVECONF
 * TPOWERDOWN, TSTEP, TPWMTHRS, TCOOLTHRS, THIGH
 * SG4_THRS, SG4_RESULT, SG4_IND
 * GCONF, GSTAT
 * IOIN, GLOBAL_SCALER
 * IHOLD_IRUN
 * DRV_STATUS
 * PWM_SCALE, PWM_AUTO
 */
#pragma once
#pragma pack(push, 1)

namespace TMC2240_n {
  struct GCONF_t {
    constexpr static uint8_t address = 0x00;
    union {
      uint16_t sr;
      struct {
        bool                   : 1, // unused
              fast_standstill  : 1,
              en_pwm_mode      : 1,
              multistep_filt   : 1,
              shaft            : 1,
              diag0_error      : 1,
              diag0_otpw       : 1,
              diag0_stall      : 1,
              diag1_stall      : 1,
              diag1_index      : 1,
              diag1_onstate    : 1,
              diag0_pushpull   : 1,
              diag1_pushpull   : 1,
              small_hysteresis : 1,
              stop_enable      : 1,
              direct_mode      : 1;
      };
    };
  };

  struct GSTAT_t {
      constexpr static uint8_t address = 0x01;
      union {
        uint8_t sr : 8;
        struct {
          bool reset          : 1,
               drv_err        : 1,
               uv_cp          : 1,
               register_reset : 1,
               vm_uvlo        : 1;
      };
    };
  };

  struct SLAVECONF_t {
    constexpr static uint8_t address = 0x03;
    union {
      uint16_t sr : 12;
      struct {
        uint16_t  slaveaddr : 8;
        uint8_t   senddelay : 4;
      };
    };
  };

  struct IOIN_t {
    constexpr static uint8_t address = 0x04;
    union {
      uint32_t sr;
      struct {
        bool  step          : 1,
              dir           : 1,
              encb          : 1,
              enca          : 1,
              drv_enn       : 1,
              encn          : 1,
              uart_en       : 1,
                            : 1, // unused
              comp_a        : 1,
              comp_b        : 1,
              comp_a1_a2    : 1,
              comp_b1_b2    : 1,
              output        : 1,
              ext_res_det   : 1,
              ext_clk       : 1,
              adc_err       : 1;
        uint8_t  silicon_rv : 3,
                            : 5, // unused
              version       : 8;
      };
    };
  };

  struct DRV_CONF_t {
    constexpr static uint8_t address = 0x0A;
    union {
      uint32_t sr;
      struct {
        uint8_t current_range : 2,
                              : 2,  // unused
                slope_control : 2;
        uint16_t              : 16; // unused
      };
    };
  };

  struct GLOBAL_SCALER_t {
    constexpr static uint8_t address = 0x0B;
    union {
      uint8_t sr;
      struct {
           uint8_t  GLOBALSCALER : 8;
      };
    };
  };

  struct IHOLD_IRUN_t {
    constexpr static uint8_t address = 0x10;
    union {
      uint32_t sr;
      struct {
        uint8_t  ihold : 5,
                       : 3, // unused
                 irun  : 5,
                       : 3, // unused
            iholddelay : 4,
                       : 4, // unused
            irundelay  : 4;
      };
    };
  };

  struct TPOWERDOWN_t {
    constexpr static uint8_t address = 0x11;
    union {
      uint32_t sr;
      struct {
        uint16_t TPOWERDOWN : 8;
      };
    };
  };

  struct TSTEP_t {
    constexpr static uint8_t address = 0x12;
    union {
      uint32_t sr;
      struct {
        uint32_t  tstep : 20;
      };
    };
  };

  struct TPWMTHRS_t {
    constexpr static uint8_t address = 0x13;
    union {
      uint32_t sr;
      struct {
        uint32_t  tpwmthrs : 20;
      };
    };
  };

  struct TCOOLTHRS_t {
    constexpr static uint8_t address = 0x14;
    union {
      uint32_t sr;
      struct {
        uint32_t  tcoolthrs : 20;
      };
    };
  };

  struct THIGH_t {
    constexpr static uint8_t address = 0x15;
    union {
      uint32_t sr;
      struct {
        uint32_t  thigh : 20;
      };
    };
  };

  struct CHOPCONF_t {
    constexpr static uint8_t address = 0x6C;
    union {
      uint32_t sr;
      struct {
        uint8_t toff     : 4,
                hstrt    : 3,
                hend     : 4;
        bool    fd3      : 1,
                disfdcc  : 1,
                         : 1, // unused
                chm      : 1;
        uint8_t TBL      : 2;
        bool             : 1, // unused
                vhighfs  : 1,
                vhighchm : 1;
        uint8_t tpfd     : 4,
                mres     : 4;
        bool    intpol   : 1,
                dedge    : 1,
                diss2g   : 1,
                diss2vs  : 1;
      };
    };
  };

  struct COOLCONF_t {
    constexpr static uint8_t address = 0x6D;
    union {
      uint32_t sr;
      struct {
        uint8_t    semin  : 4;
        bool              : 1;
        uint8_t    seup   : 2;
        bool              : 1;
        uint8_t    semax  : 4;
        bool              : 1;
        uint8_t    sedn   : 2;
        bool       seimin : 1;
        int8_t     sgt    : 7,
                          : 1; // unused
        bool       sfilt  : 1;
        uint8_t           : 7; // unused
      };
    };
  };

  struct DRV_STATUS_t {
    constexpr static uint8_t address = 0x6F;
    union {
      uint32_t sr;
      struct {
        uint16_t SG_RESULT : 10;
        uint8_t            : 2; // unused
        uint8_t      s2vsa : 1,
                     s2vsb : 1,
                   stealth : 1,
                  fsactive : 1;
        uint16_t CS_ACTUAL : 5;
        uint8_t            : 3; // unused
        bool    stallguard : 1,
                        ot : 1,
                      otpw : 1,
                      s2ga : 1,
                      s2gb : 1,
                       ola : 1,
                       olb : 1,
                      stst : 1;
      };
    };
  };

  struct PWMCONF_t {
    constexpr static uint8_t address = 0x70;
    union {
      uint32_t sr;                      // 0x00050480  0xC40C1E1D
      struct {
        uint8_t pwm_ofs            : 8, // 128         29
                pwm_grad           : 8, // 4           30
                pwm_freq           : 2; // 1           0
        bool    pwm_autoscale      : 1, // true        true
                pwm_autograd       : 1; // false       true
        uint8_t freewheel          : 2; // 0           0
        bool    pwm_meas_sd_enable : 1, // false       false
                pwm_dis_reg_stst   : 1; // false       false
        uint8_t pwm_reg            : 4, // 0           4
                pwm_lim            : 4; // 0           12
      };
    };
  };

  struct PWM_SCALE_t {
    constexpr static uint8_t address = 0x71;
    union {
      uint32_t sr;
      struct {
        uint16_t pwm_scale_sum  : 10;
        uint8_t                 : 6; // unused
        int16_t  pwm_scale_auto : 9;
      };
    };
  };

  struct PWM_AUTO_t {
    constexpr static uint8_t address = 0x72;
    union {
      uint32_t sr : 24;
      struct {
        uint8_t pwm_ofs_auto  : 8,
                              : 8, // unused
                pwm_grad_auto : 8,
                              : 8; // unused
      };
    };
  };

  struct SG4_THRS_t {
    constexpr static uint8_t address = 0x74;
    union {
      uint32_t sr;
      struct {
        uint8_t  sg4_thrs;
        bool     sg4_filt_en      :  1;
        uint8_t  sg4_angle_offset :  1;
        uint32_t                  : 22; // unused
      };
    };
  };

  struct SG4_RESULT_t {
    constexpr static uint8_t address = 0x75;
    union {
      uint32_t sr;
      struct {
        uint16_t sg4_result : 10;
        uint32_t            : 22; // unused
      };
    };
  };

  struct SG4_IND_t {
    constexpr static uint8_t address = 0x76;
    union {
      uint32_t sr;
      struct {
        uint8_t sg4_ind_0, sg4_ind_1, sg4_ind_2, sg4_ind_3;
      };
    };
  };

} // TMC2240_n

#pragma pack(pop)
