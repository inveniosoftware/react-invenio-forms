// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

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
