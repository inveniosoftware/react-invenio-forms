// This file is part of React-Invenio-Forms
// Copyright (C) 2025 CERN.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

export function flattenAndCategorizeErrors(obj, prefix = "") {
  if (!obj || typeof obj !== "object") {
    throw Error("Invalid input: expected an object");
  }

  const flattenedErrors = {};
  const severityChecks = {};

  // Handle direct severity-based error objects
  if (obj.message && obj.severity) {
    severityChecks[prefix || "error"] = obj;
    return { flattenedErrors, severityChecks };
  }

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object") {
      if (value.message && value.severity) {
        // Handle severity-based error format
        severityChecks[newKey] = value;
      } else if (Array.isArray(value)) {
        // Handle arrays
        value.forEach((item, index) => {
          const arrayKey = `${newKey}[${index}]`;
          if (item && typeof item === "object") {
            const { flattenedErrors: nestedErrors, severityChecks: nestedChecks } =
              flattenAndCategorizeErrors(item, arrayKey);
            Object.assign(flattenedErrors, nestedErrors);
            Object.assign(severityChecks, nestedChecks);
          } else {
            flattenedErrors[arrayKey] = item;
          }
        });
      } else {
        // Handle nested objects
        const { flattenedErrors: nestedErrors, severityChecks: nestedChecks } =
          flattenAndCategorizeErrors(value, newKey);
        Object.assign(flattenedErrors, nestedErrors);
        Object.assign(severityChecks, nestedChecks);
      }
    } else {
      // Handle primitive values
      flattenedErrors[newKey] = value;
    }
  }

  return { flattenedErrors, severityChecks };
}
