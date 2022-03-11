// This file is part of React-Invenio-Forms
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { Field, getIn } from 'formik';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';

export class TextField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      valueUpdated: false,
    };
  }

  handleChange = newValue => {
    this.setState({
      value: newValue,
      valueUpdated: true,
    });
  };

  renderFormField = formikBag => {
    const { fieldPath, error, helpText, ...uiProps } = this.props;
    const { value, valueUpdated } = this.state;

    const formikValue = getIn(formikBag.form.values, fieldPath, '');
    const fieldValue = formikValue && !valueUpdated ? formikValue : value;
    const initialValue = getIn(formikBag.form.initialValues, fieldPath, '');
    const fieldHasErrors = getIn(formikBag.form.errors, fieldPath, null);
    const fieldHasInitialErrors = getIn(formikBag.form.initialErrors, fieldPath, null);

    return (
      <>
        <Form.Input
          id={fieldPath}
          name={fieldPath}
          onChange={e => this.handleChange(e.target.value)}
          onBlur={e => {
            formikBag.form.setFieldValue(fieldPath, fieldValue);
            if (valueUpdated) {
              // reset error onBlur because the value has been changed
              formikBag.form.setFieldError(fieldPath, '');
              formikBag.form.handleBlur(e);
            }
          }}
          value={fieldValue}
          error={
            error ||
            (formikValue === value && fieldHasErrors) ||
            // We check if initialValue changed to display the initialError,
            // otherwise it would be displayed despite updating the field
            (initialValue === value && fieldHasInitialErrors)
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
    const { fieldPath } = this.props;
    return <Field id={fieldPath} name={fieldPath} component={this.renderFormField} />;
  }
}

TextField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  error: PropTypes.any,
  helpText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

TextField.defaultProps = {
  error: undefined,
  helpText: '',
};
