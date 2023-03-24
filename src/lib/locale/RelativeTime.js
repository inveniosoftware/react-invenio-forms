// This file is part of React-Invenio-Forms
// Copyright (C) 2023 CERN.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

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
