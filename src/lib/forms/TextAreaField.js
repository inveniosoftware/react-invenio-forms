// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";
import PropTypes from "prop-types";
import { FastField, Field, getIn } from "formik";
import { Form } from "semantic-ui-react";

import { ErrorLabel } from "./ErrorLabel";

export class TextAreaField extends Component {
  renderFormField = ({ form, ...cmpProps }) => {
    const { fieldPath, ...uiProps } = cmpProps;
    return (
      <Form.Field id={fieldPath} className="invenio-text-area-field">
        <Form.TextArea
          id={fieldPath}
          name={fieldPath}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          value={getIn(form.values, fieldPath, "")}
          {...uiProps}
        />
        <ErrorLabel fieldPath={fieldPath} />
      </Form.Field>
    );
  };

  render() {
    const { optimized, fieldPath, ...props } = this.props;

    const FormikField = optimized ? FastField : Field;

    return (
      <FormikField
        id={fieldPath}
        name={fieldPath}
        component={this.renderFormField}
        fieldPath={fieldPath}
        {...props}
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
