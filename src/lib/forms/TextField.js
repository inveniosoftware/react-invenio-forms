// This file is part of React-Invenio-Forms
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { Field } from "formik";
import _omit from "lodash/omit";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Form } from "semantic-ui-react";

export class TextField extends Component {
  render() {
    const { fieldPath, error, helpText, disabled, label, ...ui } = this.props;
    const uiProps = _omit({ ...ui }, ["onChange"]);
    return (
      <>
        <Field
          className="invenio-text-input-field"
          id={fieldPath}
          name={fieldPath}
          {...uiProps}
        >
          {({ field, form: { touched, errors }, meta }) => {
            return (
              <Form.Input
                {...field}
                error={meta.touched && meta.error}
                disabled={disabled}
                fluid
                label={label}
              />
            );
          }}
        </Field>
        {helpText && <label className="helptext">{helpText}</label>}
      </>
    );
  }
}

TextField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  error: PropTypes.any,
  helpText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
};

TextField.defaultProps = {
  error: undefined,
  helpText: "",
  onChange: null,
  disabled: false,
};
