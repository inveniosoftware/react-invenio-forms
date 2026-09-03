/*
 * SPDX-FileCopyrightText: 2020 CERN.
 * SPDX-FileCopyrightText: 2020 Northwestern University.
 * SPDX-License-Identifier: MIT
 */

import { Component } from "react";
import PropTypes from "prop-types";
import { Field, getIn, FastField } from "formik";
import { Form } from "semantic-ui-react";

export class GroupField extends Component {
  hasGroupErrors = (errors) => {
    const { fieldPath = "" } = this.props;
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
    const {
      action = undefined,
      basic = false,
      border = false,
      children = undefined,
      fieldPath = "",
      ...uiProps
    } = props;
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
    const {
      optimized = false,
      fieldPath = "",
      border = false,
      action = undefined,
      basic = false,
      children = undefined,
      ...uiProps
    } = this.props;

    const FormikField = optimized ? FastField : Field;
    return (
      <FormikField
        name={fieldPath}
        component={this.renderFormField}
        fieldPath={fieldPath}
        className="invenio-group-field"
        border={border}
        action={action}
        basic={basic}
        {...uiProps}
      >
        {children}
      </FormikField>
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
