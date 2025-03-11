// This file is part of React-Invenio-Forms
// Copyright (C) 2025 CERN.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

export function flattenAndCategorizeErrors(obj, prefix = "") {
  let flattenedErrors = {};
  let severityChecks = {};

  for (let key in obj) {
    let newKey = prefix ? `${prefix}.${key}` : key;
    let value = obj[key];

    if (value && typeof value === "object") {
      if ("message" in value && "severity" in value) {
        severityChecks[newKey] = value;
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          let arrayKey = `${newKey}[${index}]`;
          let nested = flattenAndCategorizeErrors(item, arrayKey);
          Object.assign(flattenedErrors, nested.flattenedErrors);
          Object.assign(severityChecks, nested.severityChecks);
        });
      } else {
        let nested = flattenAndCategorizeErrors(value, newKey);
        Object.assign(flattenedErrors, nested.flattenedErrors);
        Object.assign(severityChecks, nested.severityChecks);
      }
    } else {
      flattenedErrors[newKey] = value;
    }
  }

  return { flattenedErrors, severityChecks };
}
