/*
 * SPDX-FileCopyrightText: 2020 CERN.
 * SPDX-FileCopyrightText: 2020 Northwestern University.
 * SPDX-License-Identifier: MIT
 */

import { Field } from "formik";
import _get from "lodash/get";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Label } from "semantic-ui-react";

export class ErrorLabel extends Component {
  renderFormField = ({ form: { errors, initialErrors } }) => {
    const { fieldPath, ...uiProps } = this.props;
    const error = _get(errors, fieldPath, "") || _get(initialErrors, fieldPath, "");
    return error ? <Label pointing prompt content={error} {...uiProps} /> : null;
  };

  render() {
    const { fieldPath } = this.props;
    return (
      <Field className="invenio-error-label-field" name={fieldPath}>
        {this.renderFormField}
      </Field>
    );
  }
}

ErrorLabel.propTypes = {
  fieldPath: PropTypes.string.isRequired,
};
