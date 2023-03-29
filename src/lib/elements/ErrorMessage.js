// This file is part of React-Invenio-Forms
// Copyright (C) 2023 CERN.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { Message, Icon } from "semantic-ui-react";
import PropTypes from "prop-types";
import React, { Component } from "react";
import _isEmpty from "lodash/isEmpty";

const FieldErrorList = ({ fieldErrors }) => {
  return (
    <Message.List>
      {fieldErrors.map((error) => {
        return (
          <Message.Item key={error}>
            {/* when there is no field Marshmallow returns _schema */}
            {error.field !== "_schema" && <strong>{error.field}: </strong>}
            {error.messages.length === 1 ? (
              error.messages[0]
            ) : (
              <Message.List>
                {error.messages.map((message) => (
                  <Message.Item key={message}>{message}</Message.Item>
                ))}
              </Message.List>
            )}
          </Message.Item>
        );
      })}
    </Message.List>
  );
};

FieldErrorList.propTypes = {
  fieldErrors: PropTypes.array.isRequired,
};

/**
 * General component for error messages.
 * Handles:
 *   - simple error messages: provide custom header, and content - response message of received error;
 *   - complex error messages: provide list or received errors.
 * Icon and other ui props are supported.
 */
export class ErrorMessage extends Component {
  render() {
    const { header, errors, content, icon, ...uiProps } = this.props;

    return (
      <Message icon {...uiProps}>
        {icon && <Icon name={icon} />}
        <Message.Content role="alert">
          {header && <Message.Header>{header}</Message.Header>}
          {content}
          {!_isEmpty(errors) && <FieldErrorList fieldErrors={errors} />}
        </Message.Content>
      </Message>
    );
  }
}

ErrorMessage.propTypes = {
  /**
   * The list of errors (In case of multiple errors. ex: form validation result).
   */
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string,
      messages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    })
  ),
  /**
   * Custom error header.
   */
  header: PropTypes.string,
  uiProps: PropTypes.object,
  /**
   * Single error message (ex: http error response message).
   */
  content: PropTypes.string,
  icon: PropTypes.string,
};

ErrorMessage.defaultProps = {
  errors: undefined,
  header: undefined,
  uiProps: undefined,
  icon: undefined,
  content: undefined,
};
