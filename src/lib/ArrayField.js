// This file is part of React-Invenio-Forms
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn, FieldArray } from 'formik';
import { Form, Icon } from 'semantic-ui-react';

import { FieldLabel } from './FieldLabel';

export class ArrayField extends Component {
  hasGroupErrors = (errors) => {
    for (const field in errors) {
      if (field.startsWith(this.props.fieldPath)) {
        return true;
      }
    }
    return false;
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
      ...uiProps
    } = this.props;

    const hasError = this.hasGroupErrors(errors) ? { error: {} } : {};
    return (
      <Form.Field {...uiProps} {...hasError}>
        <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />

        {getIn(values, fieldPath, []).map((value, index, array) => {
          const arrayPath = fieldPath;
          const indexPath = index;
          const key = `${arrayPath}.${indexPath}`;
          // TODO: Revise what we pass to children to have a nice interface
          // Passing: array, arrayHelpers, parentFieldPath, index and ...props
          //          seems enough.
          return (
            <div key={key}>
              {children({
                array,
                arrayHelpers,
                arrayPath,
                indexPath,
                key,
                ...props,
              })}
            </div>
          );
        })}

        <label className="helptext">
          {helpText}
        </label>

        <Form.Group>
          <Form.Button
            type="button"
            onClick={() => arrayHelpers.push(defaultNewValue)}
          >
            <Icon name="add" />
            {addButtonLabel}
          </Form.Button>
        </Form.Group>
      </Form.Field>
    );
  };

  render() {
    return (
      <FieldArray
        name={this.props.fieldPath}
        component={this.renderFormField}
      />
    );
  }
}

ArrayField.propTypes = {
  addButtonLabel: PropTypes.string,
  children: PropTypes.func.isRequired,
  defaultNewValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  fieldPath: PropTypes.string.isRequired,
  helpText: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  labelIcon: PropTypes.string,
};

ArrayField.defaultProps = {
  addButtonLabel: 'Add new row',
  helpText: '',
  label: '',
  placeholder: '',
};
