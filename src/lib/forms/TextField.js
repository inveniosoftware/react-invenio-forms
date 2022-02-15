// This file is part of React-Invenio-Forms
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, getIn } from 'formik';
import { Form } from 'semantic-ui-react';

export class TextField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      valueUpdated: false,
    };
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
      valueUpdated: true,
    });
  };

  renderFormField = (formikBag) => {
    const { fieldPath, optimized, error, helpText, ...uiProps } = this.props;
    const { value, valueUpdated } = this.state;
    const formikValue = getIn(formikBag.form.values, fieldPath, '');
    const initialValue = getIn(formikBag.form.initialValues, fieldPath, '');

    return (
      <>
        <Form.Input
          id={fieldPath}
          name={fieldPath}
          onChange={this.handleChange}
          onBlur={(e) => {
            formikBag.form.setFieldValue(
              fieldPath,
              formikValue && !valueUpdated ? formikValue : value
            );
            formikBag.form.handleBlur(e);
          }}
          value={formikValue && !valueUpdated ? formikValue : value}
          error={
            error ||
            (formikValue === value &&
              getIn(formikBag.form.errors, fieldPath, null)) ||
            // We check if initialValue changed to display the initialError,
            // otherwise it would be displayed despite updating the field
            (initialValue === value &&
              getIn(formikBag.form.initialErrors, fieldPath, null))
          }
          {...uiProps}
        />
        <label className="helptext">{helpText}</label>
      </>
    );
  };

  render() {
    /*
     * TextField manages the value internally using the components
     * state instead of formik's state to avoid slowness.
     * Do not change to FastField or this won't work!
     */
    return (
      <Field
        id={this.props.fieldPath}
        name={this.props.fieldPath}
        component={this.renderFormField}
      />
    );
  }
}

TextField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  optimized: PropTypes.bool,
  width: PropTypes.number,
  helpText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

TextField.defaultProps = {
  optimized: false,
  helpText: '',
};
