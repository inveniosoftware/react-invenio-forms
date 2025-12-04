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
  constructor(props) {
    super(props);
    this.state = {
      options: props.options || [],
    };
  }

  componentDidUpdate(prevProps) {
    const { options } = this.props;
    if (prevProps.options !== options) {
      const nextOptions = options || [];
      this.setState((prevState) => {
        // Merge previous state options and new props options, de-duplicating by value
        const existing = prevState.options || [];
        const merged = [...existing];
        nextOptions.forEach((opt) => {
          if (!merged.some((o) => o.value === opt.value)) {
            merged.push(opt);
          }
        });
        return { options: merged };
      });
    }
  }

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
      disabled,
      required,
      allowAdditions,
      ...uiProps
    } = cmpProps;
    const _defaultValue = multiple ? [] : "";
    let value = getIn(values, fieldPath, defaultValue || _defaultValue);
    // Fix: for multiple selects, normalize empty string to empty array
    if (multiple && (value === "" || value === null || value === undefined)) {
      value = [];
    }
    const initialValue = getIn(initialValues, fieldPath, _defaultValue);
    const { options: stateOptions } = this.state;
    let dropdownOptions =
      (stateOptions && stateOptions.length > 0 ? stateOptions : options) || [];

    // Ensure that all currently selected values are present in the options list
    const ensureOptionPresent = (val) => {
      if (val === undefined || val === null || val === "") return;
      if (!dropdownOptions.some((opt) => opt.value === val)) {
        dropdownOptions = [...dropdownOptions, { key: val, text: val, value: val }];
      }
    };

    if (multiple) {
      if (Array.isArray(value)) {
        value.forEach((v) => ensureOptionPresent(v));
      } else {
        ensureOptionPresent(value);
      }
    } else {
      ensureOptionPresent(value);
    }
    return (
      <Form.Dropdown
        fluid
        className="invenio-select-field"
        search
        selection
        error={this.renderError(meta, initialValue, initialErrors, value, errors)}
        label={{ children: label }}
        name={fieldPath}
        disabled={disabled}
        required={required}
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
          } else {
            const newValue = data.value;
            // Add the new option to the local options state (if not already present)
            this.setState((prevState) => {
              const prevOptions = prevState.options || [];
              if (prevOptions.some((opt) => opt.value === newValue)) {
                return null;
              }
              const newOption = { key: newValue, text: newValue, value: newValue };
              return { options: [...prevOptions, newOption] };
            });

            // Update the Formik field value
            if (multiple) {
              const current = Array.isArray(value)
                ? value
                : value === undefined || value === null || value === ""
                ? []
                : [value];
              setFieldValue(fieldPath, [...current, newValue]);
            } else {
              setFieldValue(fieldPath, newValue);
            }
          }
        }}
        options={dropdownOptions}
        value={value}
        multiple={multiple}
        selectOnBlur={false}
        allowAdditions={allowAdditions}
        {...uiProps}
      />
    );
  };

  render() {
    const { optimized, fieldPath, helpText, ...uiProps } = this.props;
    const FormikField = optimized ? FastField : Field;
    return (
      <>
        <FormikField
          name={fieldPath}
          component={this.renderFormField}
          fieldPath={fieldPath}
          {...uiProps}
        />
        {helpText && <label className="helptext">{helpText}</label>}
      </>
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
  allowAdditions: PropTypes.bool,
  multiple: PropTypes.bool,
  helpText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

SelectField.defaultProps = {
  defaultValue: "",
  optimized: false,
  error: undefined,
  label: "",
  onChange: undefined,
  onAddItem: undefined,
  multiple: false,
  helpText: undefined,
  required: false,
  disabled: false,
  allowAdditions: false,
};
