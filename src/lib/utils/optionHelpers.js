// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _uniqBy from "lodash/uniqBy";

/**
 * Merges two option arrays, removing duplicates by value
 * @param {Array} existingOptions - Options already in state
 * @param {Array} newOptions - New options to merge
 * @returns {Array} Deduplicated merged options
 */
export const mergeOptions = (existingOptions, newOptions) => {
  return _uniqBy([...existingOptions, ...newOptions], "value");
};

/**
 * Ensures selected values exist as options in the dropdown
 * This is necessary because when forms load with saved values,
 * those values need to be present in the options list to display correctly.
 *
 * Common scenarios:
 * - DB load: Values loaded from DB need to appear as options
 * - allowAdditions: User-entered values need to persist as options
 *
 * @param {Array} options - Current options list
 * @param {*} value - Selected value(s) to ensure are present (string, array, or null/undefined)
 * @param {boolean} multiple - Whether this is a multi-select dropdown
 * @returns {Array} Options with selected values included
 */
export const ensureSelectedValuesInOptions = (options, value, multiple) => {
  const valuesToEnsure = multiple && Array.isArray(value) ? value : [value];
  const additionalOptions = [];

  valuesToEnsure.forEach((val) => {
    // Skip empty/null/undefined values
    if (val === undefined || val === null || val === "") return;

    // Add option if not already present
    if (!options.some((opt) => opt.value === val)) {
      additionalOptions.push({ key: val, text: val, value: val });
    }
  });

  return additionalOptions.length > 0 ? [...options, ...additionalOptions] : options;
};

/**
 * Creates a standardized option object
 * @param {string|number} value - The option value
 * @param {string} text - Display text (defaults to value if not provided)
 * @returns {Object} Formatted option object with key, text, and value
 */
export const createOption = (value, text = null) => ({
  key: value,
  text: text || value,
  value: value,
});
