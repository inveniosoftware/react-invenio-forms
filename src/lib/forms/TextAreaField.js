// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FastField, Field, getIn } from 'formik';
import { Form } from 'semantic-ui-react';

import { ErrorLabel } from './ErrorLabel';

export class TextAreaField extends Component {
  renderFormField = (formikBag) => {
    const { fieldPath, optimized, ...uiProps } = this.props;
    return (
      <Form.Field id={fieldPath}>
        <Form.TextArea
          id={fieldPath}
          name={fieldPath}
          onChange={formikBag.form.handleChange}
          onBlur={formikBag.form.handleBlur}
          value={getIn(formikBag.form.values, fieldPath, '')}
          {...uiProps}
        ></Form.TextArea>
        <ErrorLabel fieldPath={fieldPath} />
      </Form.Field>
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

TextAreaField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  optimized: PropTypes.bool,
};

TextAreaField.defaultProps = {
  optimized: false,
};
