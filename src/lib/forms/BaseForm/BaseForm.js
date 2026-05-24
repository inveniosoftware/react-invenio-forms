/*
 * SPDX-FileCopyrightText: 2020 CERN.
 * SPDX-FileCopyrightText: 2020 Northwestern University.
 * SPDX-License-Identifier: MIT
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import { Form } from "semantic-ui-react";

export class BaseForm extends Component {
  render() {
    const { formik, onSubmit, children } = this.props;
    return (
      <Formik onSubmit={onSubmit} {...formik}>
        <Form>{children}</Form>
      </Formik>
    );
  }
}

BaseForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
  formik: PropTypes.shape({
    initialValues: PropTypes.object.isRequired,
    validationSchema: PropTypes.object,
    validate: PropTypes.func,
  }),
};

BaseForm.defaultProps = {
  formik: undefined,
};
