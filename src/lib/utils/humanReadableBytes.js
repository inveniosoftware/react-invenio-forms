/*
 * SPDX-FileCopyrightText: 2020 CERN.
 * SPDX-FileCopyrightText: 2020 Northwestern University.
 * SPDX-FileCopyrightText: 2022 TU Wien.
 * SPDX-License-Identifier: MIT
 */

import _isNumber from "lodash/isNumber";

export function humanReadableBytes(bytes, decimalDisplay = false) {
  if (_isNumber(bytes)) {
    const base = decimalDisplay ? 1000 : 1024;
    const kiloBytes = base;
    const megaBytes = base * kiloBytes;
    const gigaBytes = base * megaBytes;

    if (bytes < kiloBytes) {
      return `${bytes} bytes`;
    } else if (bytes < megaBytes) {
      return `${(bytes / kiloBytes).toFixed(2)} ${decimalDisplay ? "KB" : "KiB"}`;
    } else if (bytes < gigaBytes) {
      return `${(bytes / megaBytes).toFixed(2)} ${decimalDisplay ? "MB" : "MiB"}`;
    } else {
      return `${(bytes / gigaBytes).toFixed(2)} ${decimalDisplay ? "GB" : "GiB"}`;
    }
  }
  return "";
}
