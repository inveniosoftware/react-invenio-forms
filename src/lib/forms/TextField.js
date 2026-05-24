/*
 * SPDX-FileCopyrightText: 2020-2021 CERN.
 * SPDX-FileCopyrightText: 2020-2021 Northwestern University.
 * SPDX-FileCopyrightText: 2021 Graz University of Technology
 * SPDX-License-Identifier: MIT
 */

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
          required={required}
          disabled={disabled}
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
                <FeedbackLabel
                  errorMessage={computedError}
                  pointing="above"
                  fieldPath={fieldPath}
                />
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
