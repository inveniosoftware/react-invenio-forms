// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, FastField } from 'formik';
import { Accordion, Container } from 'semantic-ui-react';

export class AccordionField extends Component {
  hasError(errors) {
    const { fieldPath } = this.props;
    if (fieldPath in errors) {
      return true;
    }
    for (const errorPath in errors) {
      if (errorPath.startsWith(fieldPath)) {
        return true;
      }
    }
    return false;
  }

  renderAccordion = props => {
    const {
      form: { errors, status },
    } = props;

    // eslint-disable-next-line no-unused-vars
    const { label, children, active, fieldPath, ...ui } = this.props;

    const hasError = status ? this.hasError(status) : this.hasError(errors);
    const panels = [
      {
        key: `panel-${label}`,
        title: {
          content: label,
          icon: 'angle right',
        },
        content: {
          content: <Container>{children}</Container>,
        },
      },
    ];

    const errorClass = hasError ? 'error secondary' : '';

    return (
      <Accordion
        defaultActiveIndex={active ? 0 : null}
        panels={panels}
        inverted
        className={`invenio-accordion-field ${errorClass}`}
        {...ui}
      />
    );
  };

  render() {
    const { optimized, fieldPath } = this.props;

    const FormikField = optimized ? FastField : Field;
    return <FormikField name={fieldPath} component={this.renderAccordion} />;
  }
}

AccordionField.propTypes = {
  active: PropTypes.bool,
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  optimized: PropTypes.bool,
  children: PropTypes.node,
  ui: PropTypes.object,
};

AccordionField.defaultProps = {
  active: false,
  label: '',
  optimized: false,
  children: null,
  ui: null,
};
