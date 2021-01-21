// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FastField, Field, getIn } from 'formik';
import { RadioField } from './RadioField';

export class ToggleField extends Component {
  /** Radio toggle Formik wrapper Component */

  renderFormField = (formikProps) => {
    /** Radio toggle Formik + Semantic-UI Field Component
     *
     * NOTE: renderFormField is run multiple times
     * TODO: might gain performance by extracting it out as own component and
     *       using class methods
     *
     * formikProps: current Formik props (ToggleField instance)
     */

    const {
      onValue,
      offValue,
      onLabel,
      offLabel,
      fieldPath,
      onChange,
      optimized,
      ...uiProps
    } = this.props;
    const [checked, setChecked] = useState(
      getIn(formikProps.form.values, fieldPath) === onValue
    );
    const handleChange = () => {
      setChecked((prevChecked) => {
        return !prevChecked;
      });
    };

    useEffect(() => {
      if (checked) {
        formikProps.form.setFieldValue(fieldPath, onValue);
      } else {
        formikProps.form.setFieldValue(fieldPath, offValue);
      }
      if (onChange) {
        onChange({ checked });
      }
    }, [checked]);

    return (
      <RadioField
        {...uiProps}
        toggle
        fieldPath={fieldPath}
        checked={checked}
        label={checked ? onLabel : offLabel}
        onChange={handleChange}
      />
    );
  };

  render() {
    const FormikField = this.props.optimized ? FastField : Field;
    return (
      <FormikField
        name={this.props.fieldPath}
        component={this.renderFormField}
      />
    );
  }
}

ToggleField.propTypes = {
  onValue: PropTypes.string.isRequired,
  offValue: PropTypes.string.isRequired,
  onLabel: PropTypes.string.isRequired,
  offLabel: PropTypes.string.isRequired,
  fieldPath: PropTypes.string.isRequired,
  optimized: PropTypes.bool,
};

ToggleField.defaultProps = {
  optimized: true,
};
