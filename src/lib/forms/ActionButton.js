// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { Button } from 'semantic-ui-react';

export class ActionButton extends Component {
  render() {
    const { name, content, isDisabled, onClick, children, ...uiProps } = this.props;
    return (
      <Field>
        {({ form: formik }) => (
          <Button
            disabled={isDisabled ? isDisabled(formik) : false}
            name={name}
            content={content}
            className="invenio-action-button"
            type="button"
            {...uiProps} // able to override above props
            onClick={e => onClick(e, formik)}
          >
            {children ? children(formik) : null}
          </Button>
        )}
      </Field>
    );
  }
}

ActionButton.propTypes = {
  name: PropTypes.string,
  content: PropTypes.string,
  isDisabled: PropTypes.func,
  children: PropTypes.any,
  onClick: PropTypes.func,
};

ActionButton.defaultProps = {
  name: '',
  content: '',
  isDisabled: undefined,
  children: undefined,
  onClick: undefined,
};
