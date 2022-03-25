// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';
import { Field } from 'formik';

export class ErrorMessage extends Component {
  renderFormField = ({ form: { errors } }) => {
    const { fieldPath } = this.props;
    return errors[fieldPath] ? <Message negative content={errors[fieldPath]} /> : null;
  };

  render() {
    const { fieldPath } = this.props;
    return (
      <Field className="invenio-error-message-field" name={fieldPath}>
        {this.renderFormField}
      </Field>
    );
  }
}

ErrorMessage.propTypes = {
  fieldPath: PropTypes.string.isRequired,
};
