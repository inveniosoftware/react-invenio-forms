// This file is part of React-Invenio-Forms
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FastField, Field, getIn } from 'formik';
import { RadioField } from './RadioField';

export class ToggleField extends Component {
  /** Radio toggle Formik wrapper Component */

  renderFormField = formikProps => {
    /** Radio toggle Formik + Semantic-UI Field Component
     *
     * NOTE: renderFormField is run multiple times
     * TODO: might gain performance by extracting it out as own component and
     *       using class methods
     *
     * formikProps: current Formik props (ToggleField instance)
     */

    const { onValue, offValue, onLabel, offLabel, fieldPath, onChange, ...uiProps } = this.props;

    const isChecked = getIn(formikProps.form.values, fieldPath) === onValue;
    const handleChange = () => {
      if (isChecked) {
        formikProps.form.setFieldValue(fieldPath, offValue);
      } else {
        formikProps.form.setFieldValue(fieldPath, onValue);
      }
      if (onChange) {
        onChange({ checked: !isChecked });
      }
    };

    return (
      <RadioField
        {...uiProps}
        className="invenio-toggle-field"
        toggle
        fieldPath={fieldPath}
        checked={getIn(formikProps.form.values, fieldPath) === onValue}
        label={getIn(formikProps.form.values, fieldPath) === onValue ? onLabel : offLabel}
        onChange={handleChange}
      />
    );
  };

  render() {
    const { optimized, fieldPath } = this.props;
    const FormikField = optimized ? FastField : Field;
    return <FormikField name={fieldPath} component={this.renderFormField} />;
  }
}

ToggleField.propTypes = {
  onValue: PropTypes.string.isRequired,
  offValue: PropTypes.string.isRequired,
  onLabel: PropTypes.string.isRequired,
  offLabel: PropTypes.string.isRequired,
  fieldPath: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  optimized: PropTypes.bool,
};

ToggleField.defaultProps = {
  onChange: undefined,
  optimized: true,
};
