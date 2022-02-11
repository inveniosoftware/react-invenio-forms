// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import { FastField, Field, getIn } from 'formik';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import { ErrorLabel } from './ErrorLabel';

export class RichInputField extends Component {
  renderFormField = (formikBag) => {
    const { editorConfig, fieldPath, label, required } = this.props;
    const value = getIn(formikBag.form.values, fieldPath, '');
    const initialValue = getIn(formikBag.form.initialValues, fieldPath, '');
    const error =
      getIn(formikBag.form.errors, fieldPath, false) ||
      // We check if initialValue changed to display the initialError,
      // otherwise it would be displayed despite updating the field
      (initialValue === value &&
        getIn(formikBag.form.initialErrors, fieldPath, false));
    return (
      <Form.Field id={fieldPath} required={required} error={error}>
        {React.isValidElement(label) ? (
          label
        ) : (
          <label htmlFor={fieldPath}>{label}</label>
        )}
        <CKEditor
          editor={ClassicEditor}
          config={editorConfig}
          data={value}
          onBlur={(event, editor) => {
            formikBag.form.setFieldValue(fieldPath, editor.getData());
            formikBag.form.setFieldTouched(fieldPath, true);
          }}
        />
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

RichInputField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  optimized: PropTypes.bool,
  editorConfig: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

RichInputField.defaultProps = {
  optimized: false,
  editorConfig: {},
};
