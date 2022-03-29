// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label } from 'semantic-ui-react';
import { Field } from 'formik';
import _get from 'lodash/get';

export class ErrorLabel extends Component {
  renderFormField = ({ form: { errors, initialErrors } }) => {
    const { fieldPath, ...uiProps } = this.props;
    const error = _get(errors, fieldPath, '') || _get(initialErrors, fieldPath, '');
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
