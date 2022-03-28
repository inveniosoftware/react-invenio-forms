// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from "react";
import ReactDOM from "react-dom";
import { RadioField } from "./RadioField";

import { Form, Formik } from "formik";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Formik>
      {() => (
        <Form>
          <RadioField
            checked
            fieldPath="testFieldPath"
            label="testLabel"
            labelIcon="money"
            optimized={false}
            onChange={() => null}
            value="testValue"
          />
        </Form>
      )}
    </Formik>,
    div
  );
});
