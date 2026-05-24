/*
 * SPDX-FileCopyrightText: 2024 CERN.
 * SPDX-License-Identifier: MIT
 */

import React from "react";

export function dropdownOptionsGenerator(dropdownOptions) {
  return dropdownOptions.map((options) => {
    return {
      key: options.key,
      text: options.text,
      value: options.key,
      content: (
        <>
          <div>{options.text}</div>
          <div>
            <small className="text-muted">{options.description}</small>
          </div>
        </>
      ),
    };
  });
}
