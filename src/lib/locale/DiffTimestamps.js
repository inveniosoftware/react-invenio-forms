// This file is part of React-Invenio-Forms
// Copyright (C) 2024 CERN.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { DateTime } from "luxon";

/**
 * Create duration string for two given timestamps
 *
 * @param firstTimestamp string ISO timestamp
 * @param secondTimestamp string ISO timestamp
 * @returns {string} string representation of duration, i.e. 3 days
 */
export const diffTimestamps = (firstTimestamp, secondTimestamp, language = "en") => {
  const first = DateTime.fromISO(firstTimestamp);
  const second = DateTime.fromISO(secondTimestamp);
  const duration = first.diff(second).reconfigure({ locale: language });
  // If we used a newer version of luxon we could just do this:
  // return duration.toHuman();

  // instead return the largest unit and value (ignore everything smaller)
  const rescale = duration.shiftTo(
    "years",
    "months",
    "weeks",
    "days",
    "hours",
    "minutes",
    "seconds",
    "milliseconds"
  ); // in new luxon this is just duration.rescale()
  const units = [
    "years",
    "months",
    "weeks",
    "days",
    "hours",
    "minutes",
    "seconds",
    "milliseconds",
  ];

  for (const unit of units) {
    if (rescale[unit] && rescale[unit] > 0) {
      if (rescale[unit] == 1) {
        return rescale[unit] + " " + unit.slice(0, -1); // remove s
      } else {
        return rescale[unit] + " " + unit;
      }
    }
  }
  return "-"; // in case all components are zero
};
