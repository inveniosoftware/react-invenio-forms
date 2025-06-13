// This file is part of React-Invenio-Forms
// Copyright (C) 2020-2025 CERN.
// Copyright (C) 2020 Northwestern University.
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field, FastField } from "formik";
import { Accordion, Container, Icon, Label } from "semantic-ui-react";
import _omit from "lodash/omit";

class AccordionError extends Component {
  constructor(props) {
    super(props);

    this.state = { errors: undefined };
  }

  componentDidMount() {
    const { formProps, hasError } = this.props;
    const subfieldErrors = this.getSubfieldErrors(formProps);
    const categorizedErrors = this.categorizeErrors(subfieldErrors);
    hasError(categorizedErrors);
    this.setState({ errors: categorizedErrors });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      formProps: {
        form: { errors, initialErrors },
      },
      formProps,
      hasError,
    } = this.props;
    if (
      prevProps.formProps.form.errors !== errors ||
      prevProps.formProps.form.initialErrors !== initialErrors
    ) {
      const subfieldErrors = this.getSubfieldErrors(formProps);
      const categorizedErrors = this.categorizeErrors(subfieldErrors);
      hasError(categorizedErrors);
      this.setState({ errors: categorizedErrors });
    }
  }

  findErrorObjects(obj) {
    const results = [];

    function traverse(current) {
      if (typeof current !== "object" || current === null) {
        return;
      }

      if ("message" in current && "severity" in current) {
        results.push(current);
      }

      Object.keys(current).forEach((key) => {
        traverse(current[key]);
      });
    }

    traverse(obj);
    return results;
  }

  getSubfieldErrors = (props) => {
    const { includesPaths } = this.props;
    const {
      form: { errors, initialErrors },
    } = props;
    const subfieldErrors = [];
    for (const fieldPath of includesPaths) {
      const err = _get(errors, fieldPath) || _get(initialErrors, fieldPath);
      if (err) {
        if (typeof err == "object") {
          const errs = this.findErrorObjects(err);
          subfieldErrors.push(...errs);
        } else {
          subfieldErrors.push(err);
        }
      }
    }
    return subfieldErrors;
  };
  categorizeErrors = (errors) => {
    const categories = { info: [], warning: [], error: [] };
    for (const err of errors) {
      if (!Object.prototype.hasOwnProperty.call(err, "severity")) {
        categories.error.push(err);
      } else {
        categories[`${err.severity}`].push(err);
      }
    }
    return categories;
  };
  render() {
    const { errors } = this.state;
    if (errors === undefined) {
      return null;
    }
    return Object.entries(errors).map(
      ([severity, messages]) =>
        !isEmpty(messages) && (
          <Label
            key={severity}
            size="tiny"
            circular
            className={`accordion-label ${severity}`}
          >
            {messages.length} {severity}
            {messages.length > 1 ? "s" : ""}
          </Label>
        )
    );
  }
}

AccordionError.propTypes = {
  formProps: PropTypes.array.isRequired,
  includesPaths: PropTypes.array.isRequired,
  hasError: PropTypes.func.isRequired,
};

export class AccordionField extends Component {
  constructor(props) {
    super(props);
    const { active } = this.props;
    this.state = { hasError: false, activeIndex: active ? 0 : -1 };
  }

  handleTitleClick = (e, { index }) => {
    const { activeIndex } = this.state;
    this.setState({ activeIndex: activeIndex === index ? -1 : index });
  };

  hasError = (categorizedErrors) => {
    const hasError = categorizedErrors.error.length > 0;
    this.setState({ hasError: hasError });
  };

  renderAccordion = (props) => {
    const { label, children, includesPaths } = this.props;
    const { hasError, activeIndex } = this.state;
    const uiProps = _omit(this.props, ["optimized", "includesPaths"]);

    // Determine if the accordion should show an "error" state
    const errorClass = hasError ? "error" : "";

    return (
      <Accordion
        inverted
        className={`invenio-accordion-field ${errorClass} secondary`}
        {...uiProps}
      >
        {/* Accordion Title with Error Summary */}
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={this.handleTitleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              this.handleTitleClick(e, { index: 0 });
            }
          }}
          tabIndex={0}
        >
          {label}
          <AccordionError
            hasError={this.hasError}
            formProps={props}
            includesPaths={includesPaths}
          />
          {/* Toggle Icon */}
          <Icon name={activeIndex === 0 ? "angle down" : "angle right"} />
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <Container>{children}</Container>
        </Accordion.Content>
      </Accordion>
    );
  };

  render() {
    const { optimized } = this.props;
    const FormikField = optimized ? FastField : Field;
    return <FormikField name="" component={this.renderAccordion} />;
  }
}

AccordionField.propTypes = {
  active: PropTypes.bool,
  includesPaths: PropTypes.array,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  optimized: PropTypes.bool,
  children: PropTypes.node,
  ui: PropTypes.object,
  severityChecks: PropTypes.object,
};

AccordionField.defaultProps = {
  active: true,
  includesPaths: [],
  label: "",
  optimized: false,
  children: null,
  ui: null,
  severityChecks: null,
};
