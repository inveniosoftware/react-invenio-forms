// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from "react";
import PropTypes from "prop-types";
import { Field, getIn, FastField } from "formik";
import { Form } from "semantic-ui-react";

export class GroupField extends React.Component {
  hasGroupErrors = (errors) => {
    const { fieldPath } = this.props;
    for (const field in errors) {
      if (field.startsWith(fieldPath)) {
        return true;
      }
    }
    return false;
  };

  renderBasicField = (action, classNames, children) => {
    return (
      <div className={classNames.join(" ")}>
        {action && <div className="group-action">{action}</div>}
        {children}
      </div>
    );
  };

  renderFormField = (props) => {
    const { action, basic, border, children, fieldPath, ...uiProps } = props;
    const errors = getIn(props, "form.errors");
    const classNames = ["form-group"];
    if (border) {
      classNames.push("border");
    }
    if (fieldPath && this.hasGroupErrors(errors)) {
      classNames.push("error");
    }

    if (basic) {
      return this.renderBasicField(action, classNames, children);
    }

    return (
      <Form.Group className={classNames.join(" ")} {...uiProps}>
        {action && <div className="group-action">{action}</div>}
        {children}
      </Form.Group>
    );
  };

  render() {
    const { optimized, fieldPath, ...uiProps } = this.props;

    const FormikField = optimized ? FastField : Field;
    return (
      <FormikField
        name={fieldPath}
        component={this.renderFormField}
        fieldPath={fieldPath}
        className="invenio-group-field"
        {...uiProps}
      />
    );
  }
}

GroupField.propTypes = {
  border: PropTypes.bool,
  fieldPath: PropTypes.string,
  optimized: PropTypes.bool,
  action: PropTypes.any,
  basic: PropTypes.bool,
  children: PropTypes.any,
};

GroupField.defaultProps = {
  border: false,
  fieldPath: "",
  optimized: false,
  action: undefined,
  basic: false,
  children: undefined,
};
