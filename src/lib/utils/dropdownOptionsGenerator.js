// This file is part of React-Invenio-Forms
// Copyright (C) 2024 CERN.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

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
