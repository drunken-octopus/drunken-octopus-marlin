/**
 * Marlin 3D Printer Firmware
 * Copyright (c) 2020 MarlinFirmware [https://github.com/MarlinFirmware/Marlin]
 *
 * Based on Sprinter and grbl.
 * Copyright (c) 2011 Camiel Gubbels / Erik van der Zalm
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

/**
 * Based on u8g_com_st7920_hw_spi.c
 *
 * Universal 8bit Graphics Library
 *
 * Copyright (c) 2011, olikraus@gmail.com
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 *  * Redistributions of source code must retain the above copyright notice, this list
 *    of conditions and the following disclaimer.
 *
 *  * Redistributions in binary form must reproduce the above copyright notice, this
 *    list of conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
 * CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 * NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#if defined(ARDUINO) && !defined(ARDUINO_ARCH_STM32) && !defined(ARDUINO_ARCH_SAM)

#include "../../../inc/MarlinConfigPre.h"

#if HAS_MARLINUI_U8GLIB

#include "../../shared/Marduino.h"
#include "../../shared/Delay.h"

#include <U8glib-HAL.h>

static uint8_t u8g_bitData, u8g_bitNotData, u8g_bitClock, u8g_bitNotClock;
static volatile uint8_t *u8g_outData, *u8g_outClock;

static void u8g_com_arduino_init_shift_out(uint8_t dataPin, uint8_t clockPin) {
  u8g_outData = portOutputRegister(digitalPinToPort(dataPin));
  u8g_outClock = portOutputRegister(digitalPinToPort(clockPin));
  u8g_bitData = digitalPinToBitMask(dataPin);
  u8g_bitClock = digitalPinToBitMask(clockPin);

  u8g_bitNotClock = u8g_bitClock;
  u8g_bitNotClock ^= 0xFF;

  u8g_bitNotData = u8g_bitData;
  u8g_bitNotData ^= 0xFF;
}

void u8g_spiSend_sw_AVR_mode_0(uint8_t val) {
  uint8_t bitData = u8g_bitData,
          bitNotData = u8g_bitNotData,
          bitClock = u8g_bitClock,
          bitNotClock = u8g_bitNotClock;
  volatile uint8_t *outData = u8g_outData,
                   *outClock = u8g_outClock;
  U8G_ATOMIC_START();
  for (uint8_t i = 0; i < 8; ++i) {
    if (val & 0x80)
      *outData |= bitData;
    else
      *outData &= bitNotData;
    *outClock |= bitClock;
    val <<= 1;
    *outClock &= bitNotClock;
  }
  U8G_ATOMIC_END();
}

void u8g_spiSend_sw_AVR_mode_3(uint8_t val) {
  uint8_t bitData = u8g_bitData,
          bitNotData = u8g_bitNotData,
          bitClock = u8g_bitClock,
          bitNotClock = u8g_bitNotClock;
  volatile uint8_t *outData = u8g_outData,
                   *outClock = u8g_outClock;
  U8G_ATOMIC_START();
  for (uint8_t i = 0; i < 8; ++i) {
    *outClock &= bitNotClock;
    if (val & 0x80)
      *outData |= bitData;
    else
      *outData &= bitNotData;
    *outClock |= bitClock;
    val <<= 1;
  }
  U8G_ATOMIC_END();
}

#if U8G_SPI_USE_MODE_3
  #define SPISEND_SW_AVR u8g_spiSend_sw_AVR_mode_3
#else
  #define SPISEND_SW_AVR u8g_spiSend_sw_AVR_mode_0
#endif

uint8_t u8g_com_HAL_AVR_sw_sp_fn(u8g_t *u8g, uint8_t msg, uint8_t arg_val, void *arg_ptr) {
  switch (msg) {
    case U8G_COM_MSG_INIT:
      u8g_com_arduino_init_shift_out(u8g->pin_list[U8G_PI_MOSI], u8g->pin_list[U8G_PI_SCK]);
      u8g_com_arduino_assign_pin_output_high(u8g);
      u8g_com_arduino_digital_write(u8g, U8G_PI_SCK, 0);
      u8g_com_arduino_digital_write(u8g, U8G_PI_MOSI, 0);
      break;

    case U8G_COM_MSG_STOP:
      break;

    case U8G_COM_MSG_RESET:
      if (U8G_PIN_NONE != u8g->pin_list[U8G_PI_RESET]) u8g_com_arduino_digital_write(u8g, U8G_PI_RESET, arg_val);
      break;

    case U8G_COM_MSG_CHIP_SELECT:
      #if U8G_SPI_USE_MODE_3                                  // LCD SPI is running mode 3 while SD card is running mode 0
        if (arg_val) {                                        // SCK idle state needs to be set to the proper idle state before
                                                              //  the next chip select goes active
          u8g_com_arduino_digital_write(u8g, U8G_PI_SCK, 1);  // Set SCK to mode 3 idle state before CS goes active
          u8g_com_arduino_digital_write(u8g, U8G_PI_CS, LOW);
        }
        else {
          u8g_com_arduino_digital_write(u8g, U8G_PI_CS, HIGH);
          u8g_com_arduino_digital_write(u8g, U8G_PI_SCK, 0);  // Set SCK to mode 0 idle state after CS goes inactive
        }
      #else
        u8g_com_arduino_digital_write(u8g, U8G_PI_CS, !arg_val);
      #endif
      break;

    case U8G_COM_MSG_WRITE_BYTE:
      SPISEND_SW_AVR(arg_val);
      break;

    case U8G_COM_MSG_WRITE_SEQ: {
        uint8_t *ptr = (uint8_t *)arg_ptr;
        while (arg_val > 0) {
          SPISEND_SW_AVR(*ptr++);
          arg_val--;
        }
      }
      break;

      case U8G_COM_MSG_WRITE_SEQ_P: {
        uint8_t *ptr = (uint8_t *)arg_ptr;
        while (arg_val > 0) {
          SPISEND_SW_AVR(u8g_pgm_read(ptr));
          ptr++;
          arg_val--;
        }
      }
      break;

    case U8G_COM_MSG_ADDRESS:                     /* define cmd (arg_val = 0) or data mode (arg_val = 1) */
      u8g_com_arduino_digital_write(u8g, U8G_PI_A0, arg_val);
      break;
  }
  return 1;
}

#endif // HAS_MARLINUI_U8GLIB
#endif // ARDUINO_ARCH_SAM
