/**
 * TMCStepper library by @teemuatlut
 * TMC2208_bitfields.h
 *
 * TMC2208 (TMC2209, TMC2224) hardware register bit fields.
 *
 * Overriding TMC2130:
 * GCONF, FACTORY_CONF, CHOPCONF
 * PWMCONF, PWM_SCALE
 * IOIN
 * VACTUAL
 * MSCURACT
 * DRV_STATUS
 */
#pragma once
#pragma pack(push, 1)

namespace TMC2208_n {
  struct GCONF_t {
    constexpr static uint8_t address = 0x00;
    union {
      uint16_t sr : 10;
      struct {
        bool  i_scale_analog : 1,
              internal_rsense : 1,
              en_spreadcycle : 1,
              shaft : 1,
              index_otpw : 1,
              index_step : 1,
              pdn_disable : 1,
              mstep_reg_select : 1,
              multistep_filt : 1,
              test_mode : 1;
      };
    };
  };
}

namespace TMC2208_n {
  struct IOIN_t {
    constexpr static uint8_t address = 0x06;
    union {
      uint32_t sr;
      struct {
        bool  enn : 1,
                  : 1,
              ms1 : 1,
              ms2 : 1,
              diag : 1,
                   : 1,
              pdn_uart : 1,
              step : 1,
              sel_a : 1,
              dir : 1;
        uint16_t : 14;
        uint8_t version : 8;
      };
    };
  };
}

namespace TMC2224_n {
  struct IOIN_t {
    constexpr static uint8_t address = 0x06;
    union {
      uint32_t sr;
      struct {
        bool  : 1,
              pdn_uart : 1,
              spread : 1,
              dir : 1,
              enn : 1,
              step : 1,
              ms1 : 1,
              ms2 : 1,
              sel_a : 1;
        uint16_t : 15;
        uint8_t version : 8;
      };
    };
  };
}

struct FACTORY_CONF_t {
  constexpr static uint8_t address = 0x07;
  union {
    uint16_t sr;
    struct {
        uint8_t fclktrim : 5,
                         : 3,
                ottrim : 2;
    };
  };
};

namespace TMC2208_n {
  struct VACTUAL_t {
    constexpr static uint8_t address = 0x22;
    uint32_t sr;
  };
}

struct MSCURACT_t {
  constexpr static uint8_t address = 0x6B;
  union {
    uint32_t sr : 25;
    struct {
      int16_t cur_a : 9,
                    : 7,
              cur_b : 9;
    };
  };
};

namespace TMC2208_n {
  struct CHOPCONF_t {
    constexpr static uint8_t address = 0x6C;
    union {
      uint32_t sr;            // 0x10000053
      struct {
        uint8_t toff    : 4,  // 3
                hstrt   : 3,  // 5
                hend    : 4,  // 0
                        : 4,  // unused
                tbl     : 2;  // 0
        bool    vsense  : 1;  // false
        uint8_t         : 6,  // unused
                mres    : 4;  // 0
        bool    intpol  : 1,  // true
                dedge   : 1,  // false
                diss2g  : 1,  // false
                diss2vs : 1;  // false
      };
    };
  };

  struct PWMCONF_t {
    constexpr static uint8_t address = 0x70;
    union {
      uint32_t sr;              // 0xC10D0024
      struct {
        uint8_t pwm_ofs    : 8, // 36
                pwm_grad   : 8, // 0
                pwm_freq   : 2; // 1
        bool pwm_autoscale : 1, // true
             pwm_autograd  : 1; // true
        uint8_t freewheel  : 2, // 0
                           : 2, // unused
                pwm_reg    : 4, // 1
                pwm_lim    : 4; // 12
      };
    };
  };

  struct DRV_STATUS_t {
    constexpr static uint8_t address = 0x6F;
    union {
      uint32_t sr;
      struct {
        bool otpw : 1,
             ot : 1,
             s2ga : 1,
             s2gb : 1,
             s2vsa : 1,
             s2vsb : 1,
             ola : 1,
             olb : 1,
             t120 : 1,
             t143 : 1,
             t150 : 1,
             t157 : 1;
        uint8_t : 4,
                cs_actual : 5,
                : 3,
                : 6;
        bool stealth : 1,
             stst : 1;
      };
    };
  };

  struct PWM_SCALE_t {
    constexpr static uint8_t address = 0x71;
    union {
      uint32_t sr;
      struct {
        uint8_t pwm_scale_sum   : 8,
                                : 8;  // unused
        int16_t pwm_scale_auto  : 9;
      };
    };
  };
}

#pragma pack(pop)
