/**
 * TMCStepper library by @teemuatlut
 * TMC2160_bitfields.h
 *
 * TMC2160 (TMC5130, TMC5160, TMC5161) hardware register bit fields.
 *
 * Overriding TMC2130:
 * IOIN
 * PWMCONF, PWM_SCALE
 */
#pragma once
#pragma pack(push, 1)

namespace TMC2160_n {
  struct IOIN_t {
    constexpr static uint8_t address = 0x04;
    union {
      uint32_t sr;
      struct {
        bool  refl_step : 1,
              refr_dir : 1,
              encb_dcen_cfg4 : 1,
              enca_dcin_cfg5 : 1,
              drv_enn : 1,
              dco_cfg6 : 1,
              : 2;
        uint16_t : 16;
        uint8_t version : 8;
      };
    };
  };

  struct PWMCONF_t {
    constexpr static uint8_t address = 0x70;
    union {
      uint32_t sr;                // 0xC40C001E
      struct {
        uint8_t pwm_ofs    : 8,   // 30
                pwm_grad   : 8,   // 0
                pwm_freq   : 2;   // 0
        bool pwm_autoscale : 1,   // true
             pwm_autograd  : 1;   // true
        uint8_t freewheel  : 2,   // 0
                           : 2,
                pwm_reg    : 4,   // 4
                pwm_lim    : 4;   // 12
      };
    };
  };

  struct PWM_SCALE_t {
    constexpr static uint8_t address = 0x71;
    union {
      uint32_t sr : 25;
      struct {
        uint8_t pwm_scale_sum : 8,
                              : 8;
        uint16_t pwm_scale_auto : 9;
      };
    };
  };
}

#pragma pack(pop)
