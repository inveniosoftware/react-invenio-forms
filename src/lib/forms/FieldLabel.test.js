/*
 * SPDX-FileCopyrightText: 2020 CERN.
 * SPDX-FileCopyrightText: 2020 Northwestern University.
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import ReactDOM from "react-dom";
import { FieldLabel } from "./FieldLabel";

it("renders without crashing with no props", () => {
  const div = document.createElement("div");
  ReactDOM.render(<FieldLabel />, div);
});

it("renders without crashing with all props", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <FieldLabel htmlFor="foo" icon="american sign language interpreting" label="Foo" />,
    div
  );
});
