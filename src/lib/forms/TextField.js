// This file is part of React-Invenio-Forms
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { FastField, Field } from "formik";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Form } from "semantic-ui-react";
import { FeedbackLabel } from "./FeedbackLabel";

export class TextField extends Component {
  render() {
    const {
      fieldPath,
      error,
      helpText,
      disabled,
      label,
      optimized,
      required,
      ...uiProps
    } = this.props;
    const FormikField = optimized ? FastField : Field;
    return (
      <>
        <FormikField
          className="invenio-text-input-field"
          id={fieldPath}
          name={fieldPath}
        >
          {({ field, meta }) => {
            const computedError =
              error ||
              meta.error ||
              // We check if initialValue changed to display the initialError,
              // otherwise it would be displayed despite updating the field
              (!meta.touched && meta.initialError);

            let formInputError = null;
            if (typeof computedError === "string") {
              formInputError = computedError;
            } else if (
              typeof computedError === "object" &&
              computedError.message &&
              computedError.severity
            ) {
              formInputError = (
                <FeedbackLabel errorMessage={computedError} pointing="above" />
              );
            }

            return (
              <Form.Input
                {...field}
                error={formInputError}
                disabled={disabled}
                fluid
                label={label}
                id={fieldPath}
                required={required}
                {...uiProps}
              />
            );
          }}
        </FormikField>
        {helpText && <label className="helptext">{helpText}</label>}
      </>
    );
  }
}

TextField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  error: PropTypes.any,
  helpText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  optimized: PropTypes.bool,
  required: PropTypes.bool,
};

TextField.defaultProps = {
  error: undefined,
  helpText: "",
  disabled: false,
  optimized: false,
  required: false,
};
