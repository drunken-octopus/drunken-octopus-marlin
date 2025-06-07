# Arduino library for Trinamic TMC stepper motor drivers
This library works with any Arduino compatible board (Arduino, STM32, NXP, etc) and it's available on PlatformIO

## Supported TMC Drivers

| Drivers  | Support | Supply       | Max RMS       | Interface | CoolStep™  | StallGuard™  | StealthChop™  |
| :------: | :-----: | :----------: | :-----------: | :-------: | :--------: | :-----------:| :------------:|
| [TMC2130](//teemuatlut.github.io/TMCStepper/class_t_m_c2130_stepper.html) | ✅      | 5…46V        | 1.4A          | SPI       | ✅          | ✅ v2        | ✅ v1 |
| [TMC2160](//teemuatlut.github.io/TMCStepper/class_t_m_c2160_stepper.html) | ✅      | 8…60V        | ext. MOSFETs  | SPI       | ✅          | ✅ v2        | ✅ v2 |
| [TMC2208](//teemuatlut.github.io/TMCStepper/class_t_m_c2208_stepper.html) | ✅      | 4.75…36V     | 1.4A          | UART      | ❌          | ❌           | ✅ v2 |
| [TMC2209](//teemuatlut.github.io/TMCStepper/class_t_m_c2209_stepper.html) | ✅      | 4.75…29V     | 2.0A          | UART      | ✅          | ✅ v4        | ✅ v2 |
| [TMC2224](//teemuatlut.github.io/TMCStepper/class_t_m_c2224_stepper.html) | ✅      | 4.75…36V     | 1.4A          | UART      | ❌          | ❌           | ✅ v2 |
| TMC2240 | ✅      | 4.75…36V     | 1.4A          | SPI       | ✅          | ✅           | ✅ v2 |
| [TMC2660](//teemuatlut.github.io/TMCStepper/class_t_m_c2660_stepper.html) | ✅      | 9…30V        | 2.8A          | SPI       | ✅          | ✅ v2        | ❌    |
| [TMC5130](//teemuatlut.github.io/TMCStepper/class_t_m_c5130_stepper.html) | ✅      | 4.75…46V     | 1.4A          | SPI only  | ✅          | ✅ v2        | ✅ v1 |
| [TMC5160](//teemuatlut.github.io/TMCStepper/class_t_m_c5160_stepper.html) | ✅      | 8…60V        | ext. MOSFETs  | SPI only  | ✅          | ✅ v2        | ✅ v2 |
| [TMC5161](//teemuatlut.github.io/TMCStepper/class_t_m_c5161_stepper.html) | ✅      | 8…40V        | 3.5A          | SPI only  | ✅          | ✅ v2        | ✅ v2 |

- [New Doxygen documentation](//teemuatlut.github.io/TMCStepper/index.html)

---

The TMCStepper library is and always will be free to use.

This project started for me as a personal test to see if I could do it. Over the years it has gained some popularity as more and more hobbyists are looking into advanced stepper motor drivers. More users also comes with more unique setups.
This donation option will allow me to purchase the hardware that I can use for testing, validation and supporting you.

- [![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=KFRSQ3KUUPKWS&currency_code=EUR&source=url)
