// This file is part of React-Invenio-Forms
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2022 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";
import PropTypes from "prop-types";
import { getIn, FieldArray } from "formik";
import { Form, Icon } from "semantic-ui-react";
import _isEmpty from "lodash/isEmpty";
import _filter from "lodash/filter";
import _matches from "lodash/matches";
import { FieldLabel } from "./FieldLabel";

export class ArrayField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Chosen because it will never cross with 0-indexed pre-existing keys.
      nextKey: -1,
      hasBeenShown: false,
    };
  }

  hasGroupErrors = (errors) => {
    const { fieldPath } = this.props;
    for (const field in errors) {
      if (field.startsWith(fieldPath)) {
        return true;
      }
    }
    return false;
  };

  /**
   * Returns the array of values to display, it checks for required options and adds empty rows with the required values prefilled
   * @param {Array} values The array of values
   * @param {String} fieldPath The path of the field
   * @returns An array of values to display
   */
  getValues = (values, fieldPath) => {
    const { requiredOptions, defaultNewValue, showEmptyValue } = this.props;
    const { hasBeenShown } = this.state;
    const existingValues = getIn(values, fieldPath, []);

    if (
      !hasBeenShown &&
      _isEmpty(requiredOptions) &&
      _isEmpty(existingValues) &&
      showEmptyValue
    ) {
      existingValues.push({ __key: existingValues.length, ...defaultNewValue });
      this.setState({ hasBeenShown: true });
    }

    for (const requiredOption of requiredOptions) {
      const valuesMatchingRequiredOption = _filter(
        existingValues,
        _matches(requiredOption)
      );
      if (valuesMatchingRequiredOption.length === 0) {
        existingValues.push({ __key: existingValues.length, ...requiredOption });
      }
    }
    return existingValues;
  };

  renderFormField = (props) => {
    const {
      form: { values, errors },
      ...arrayHelpers
    } = props;
    const {
      addButtonLabel,
      children,
      defaultNewValue,
      fieldPath,
      label,
      labelIcon,
      helpText,
      requiredOptions,
      ...uiProps
    } = this.props;
    const hasError = this.hasGroupErrors(errors) ? { error: {} } : {};
    const { nextKey } = this.state;
    const valuesToDisplay = this.getValues(values, fieldPath);
    return (
      <Form.Field {...uiProps} {...hasError}>
        <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />

        {valuesToDisplay.map((value, index, array) => {
          const arrayPath = fieldPath;
          const indexPath = index;
          const key = value.__key || index;

          return (
            <div key={key}>
              {children({
                array,
                arrayHelpers,
                arrayPath,
                indexPath,
                key,
                value,
                ...props,
              })}
            </div>
          );
        })}

        <label className="helptext">{helpText}</label>

        <Form.Group>
          <Form.Button
            type="button"
            icon
            className="align-self-end"
            labelPosition="left"
            onClick={() => {
              arrayHelpers.push({
                ...defaultNewValue,
                __key: nextKey,
              });
              this.setState((state) => ({ nextKey: state.nextKey - 1 }));
            }}
          >
            <Icon name="add" />
            {addButtonLabel}
          </Form.Button>
        </Form.Group>
      </Form.Field>
    );
  };

  render() {
    const { fieldPath } = this.props;
    return (
      <FieldArray
        className="invenio-array-field"
        name={fieldPath}
        component={this.renderFormField}
      />
    );
  }
}

ArrayField.propTypes = {
  addButtonLabel: PropTypes.string,
  children: PropTypes.func.isRequired,
  defaultNewValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  fieldPath: PropTypes.string.isRequired,
  helpText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  labelIcon: PropTypes.string,
  requiredOptions: PropTypes.array,
  showEmptyValue: PropTypes.bool,
};

ArrayField.defaultProps = {
  addButtonLabel: "Add new row",
  helpText: "",
  label: "",
  labelIcon: "",
  requiredOptions: [],
  showEmptyValue: false,
};
