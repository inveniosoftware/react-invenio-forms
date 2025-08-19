// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
// Copyright (C) 2020 Northwestern University.
// Copyright (C) 2024 KTH Royal Institute of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { FastField, Field, getIn } from "formik";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { RichEditor } from "./RichEditor";
import { ErrorLabel } from "./ErrorLabel";
import { Form } from "semantic-ui-react";

export class RichInputField extends Component {
  renderFormField = (formikBag) => {
    const { fieldPath, label, required, className, editor, editorConfig, disabled } =
      this.props;

    const value = getIn(formikBag.form.values, fieldPath, "");
    const initialValue = getIn(formikBag.form.initialValues, fieldPath, "");
    const error =
      getIn(formikBag.form.errors, fieldPath, false) ||
      // We check if initialValue changed to display the initialError,
      // otherwise it would be displayed despite updating the field
      (initialValue === value && getIn(formikBag.form.initialErrors, fieldPath, false));

    return (
      <Form.Field
        id={fieldPath}
        required={required}
        error={error}
        className={className}
        disabled={disabled}
      >
        {React.isValidElement(label) ? (
          label
        ) : (
          <label htmlFor={fieldPath}>{label}</label>
        )}
        {editor ? (
          editor
        ) : (
          <RichEditor
            initialValue={initialValue}
            inputValue={() => value} // () =>  To avoid re-rendering
            optimized
            editorConfig={editorConfig}
            onBlur={(event, editor) => {
              formikBag.form.setFieldValue(fieldPath, editor.getContent());
              formikBag.form.setFieldTouched(fieldPath, true);
            }}
            disabled={disabled}
          />
        )}
        <ErrorLabel fieldPath={fieldPath} />
      </Form.Field>
    );
  };

  render() {
    const { optimized, fieldPath } = this.props;
    const FormikField = optimized ? FastField : Field;

    return (
      <FormikField id={fieldPath} name={fieldPath} component={this.renderFormField} />
    );
  }
}

RichInputField.propTypes = {
  className: PropTypes.string,
  editor: PropTypes.elementType,
  fieldPath: PropTypes.string.isRequired,
  optimized: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  required: PropTypes.bool,
  editorConfig: PropTypes.object,
  disabled: PropTypes.bool,
};

RichInputField.defaultProps = {
  className: "invenio-rich-input-field",
  optimized: false,
  required: false,
  label: "",
  editor: undefined,
  editorConfig: undefined,
  disabled: false,
};
