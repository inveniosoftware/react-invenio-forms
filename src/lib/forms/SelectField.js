// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";
import PropTypes from "prop-types";
import { FastField, Field, getIn } from "formik";
import { Form } from "semantic-ui-react";
import { FeedbackLabel } from "../forms/FeedbackLabel";

export class SelectField extends Component {
  renderError = (meta, initialValue, initialErrors, value, errors) => {
    const { error, fieldPath } = this.props;
    const computedError =
      error ||
      getIn(errors, fieldPath, null) ||
      // We check if initialValue changed to display the initialError,
      // otherwise it would be displayed despite updating the field
      (initialValue === value && getIn(initialErrors, fieldPath, null));
    return (
      computedError && (
        <FeedbackLabel
          errorMessage={computedError}
          pointing="above"
          fieldPath={fieldPath}
        />
      )
    );
  };

  renderFormField = (formikProps) => {
    const {
      form: {
        values,
        setFieldValue,
        handleBlur,
        errors,
        initialErrors,
        initialValues,
        meta,
      },
      ...cmpProps
    } = formikProps;
    const {
      defaultValue,
      error,
      fieldPath,
      label,
      options,
      onChange,
      onAddItem,
      multiple,
      ...uiProps
    } = cmpProps;
    const _defaultValue = multiple ? [] : "";
    const value = getIn(values, fieldPath, defaultValue || _defaultValue);
    const initialValue = getIn(initialValues, fieldPath, _defaultValue);
    return (
      <Form.Dropdown
        fluid
        className="invenio-select-field"
        search
        selection
        error={this.renderError(meta, initialValue, initialErrors, value, errors)}
        label={{ children: label }}
        name={fieldPath}
        onBlur={handleBlur}
        onChange={(event, data) => {
          if (onChange) {
            onChange({ event, data, formikProps });
            event.target.value = "";
          } else {
            setFieldValue(fieldPath, data.value);
          }
        }}
        onAddItem={(event, data) => {
          if (onAddItem) {
            onAddItem({ event, data, formikProps });
          }
        }}
        options={options}
        value={value}
        multiple={multiple}
        selectOnBlur={false}
        {...uiProps}
      />
    );
  };

  render() {
    const { optimized, fieldPath, ...uiProps } = this.props;
    const FormikField = optimized ? FastField : Field;
    return (
      <FormikField
        name={fieldPath}
        component={this.renderFormField}
        fieldPath={fieldPath}
        {...uiProps}
      />
    );
  }
}

SelectField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  optimized: PropTypes.bool,
  error: PropTypes.any,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onChange: PropTypes.func,
  onAddItem: PropTypes.func,
  multiple: PropTypes.bool,
};

SelectField.defaultProps = {
  defaultValue: "",
  optimized: false,
  error: undefined,
  label: "",
  onChange: undefined,
  onAddItem: undefined,
  multiple: false,
};
