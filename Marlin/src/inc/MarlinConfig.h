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
#pragma once

//
// Prefix header for all Marlin sources
//

#include "Conditionals-6-type.h"

#ifndef __MARLIN_DEPS__

  #include HAL_PATH(.., inc/Conditionals_type.h)

  #include "Changes.h"

  // Include all core headers
  #include "../core/language.h"
  #include "../core/utility.h"
  #include "../core/mstring.h"
  #include "../core/serial.h"
  #include "../core/endianness.h"

#endif

#include "../drunken_octopus_extras.h"
#include "../core/multi_language.h"

#ifndef __MARLIN_DEPS__
  #include "SanityCheck.h"
  #include HAL_PATH(.., inc/SanityCheck.h)
#endif
