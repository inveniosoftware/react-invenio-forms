/*
 * SPDX-FileCopyrightText: 2023 CERN.
 * SPDX-License-Identifier: MIT
 */

import { DateTime } from "luxon";

/**
 * Make relative date for a given timestamp
 *
 * @param timestamp string ISO timestamp
 * @returns {string} relative date in a given language, f.e. 3 days ago
 */
export const toRelativeTime = (timestamp, language = "en") => {
  return DateTime.fromISO(timestamp).setLocale(language).toRelative();
};
