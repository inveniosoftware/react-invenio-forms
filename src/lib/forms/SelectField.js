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
import { mergeOptions, ensureSelectedValuesInOptions, createOption } from "../utils";

export class SelectField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Track dynamically added options (e.g., user-entered values via allowAdditions)
      options: props.options || [],
    };
  }

  componentDidUpdate(prevProps) {
    const { options } = this.props;
    if (prevProps.options !== options) {
      // When props.options change, merge with existing state options
      // This preserves user-added options while incorporating new prop options
      this.setState((prevState) => {
        const merged = mergeOptions(prevState.options || [], options || []);
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

    // Normalize empty values for multiple selects to empty array
    if (multiple && (value === "" || value === null || value === undefined)) {
      value = [];
    }

    const initialValue = getIn(initialValues, fieldPath, _defaultValue);
    const { options: stateOptions } = this.state;

    // Use state options if available (includes user-added options), otherwise use props
    let dropdownOptions =
      (stateOptions && stateOptions.length > 0 ? stateOptions : options) || [];

    const dropdownValue = uiProps.value !== undefined ? uiProps.value : value;

    // Ensure selected values are present in options
    dropdownOptions = ensureSelectedValuesInOptions(
      dropdownOptions,
      dropdownValue,
      multiple
    );

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
            // Allow custom onAddItem handler if provided
            onAddItem({ event, data, formikProps });
          } else {
            // Default behavior: add new option to state and update form value
            const newValue = data.value;
            const newOption = createOption(newValue);

            // Add new option to state (deduplication handled by state update)
            this.setState((prevState) => {
              const prevOptions = prevState.options || [];
              // Skip update if option already exists
              if (prevOptions.some((opt) => opt.value === newValue)) {
                return null;
              }
              return { options: [...prevOptions, newOption] };
            });

            // Update form value with new selection
            if (multiple) {
              const currentArray = Array.isArray(value) ? value : [];
              setFieldValue(fieldPath, [...currentArray, newValue]);
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
