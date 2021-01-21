// This file is part of React-Invenio-Forms
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FastField, Field, getIn } from 'formik';
import { Form } from 'semantic-ui-react';

export class TextField extends Component {
  renderFormField = (formikBag) => {
    const { fieldPath, optimized, error, ...uiProps } = this.props;
    return (
      <Form.Input
        id={fieldPath}
        name={fieldPath}
        onChange={formikBag.form.handleChange}
        onBlur={formikBag.form.handleBlur}
        value={getIn(formikBag.form.values, fieldPath, '')}
        error={error || getIn(formikBag.form.errors, fieldPath, null)}
        {...uiProps}
      />
    );
  };

  render() {
    const FormikField = this.props.optimized ? FastField : Field;

    return (
      <FormikField
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
};

TextField.defaultProps = {
  optimized: false,
};
