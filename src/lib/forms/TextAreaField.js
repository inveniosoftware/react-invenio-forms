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
  renderFormField = formikBag => {
    const { fieldPath, ...uiProps } = this.props;
    return (
      <Form.Field id={fieldPath} className="invenio-text-area-field">
        <Form.TextArea
          id={fieldPath}
          name={fieldPath}
          onChange={formikBag.form.handleChange}
          onBlur={formikBag.form.handleBlur}
          value={getIn(formikBag.form.values, fieldPath, '')}
          {...uiProps}
        />
        <ErrorLabel fieldPath={fieldPath} />
      </Form.Field>
    );
  };

  render() {
    const { optimized, fieldPath } = this.props;

    const FormikField = optimized ? FastField : Field;

    return <FormikField id={fieldPath} name={fieldPath} component={this.renderFormField} />;
  }
}

TextAreaField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  optimized: PropTypes.bool,
};

TextAreaField.defaultProps = {
  optimized: false,
};
