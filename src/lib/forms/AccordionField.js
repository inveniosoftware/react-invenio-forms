// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { Field, FastField } from "formik";
import { Accordion, Container, Icon, Label } from "semantic-ui-react";
import _omit from "lodash/omit";
import { flattenAndCategorizeErrors } from "../utils";

export class AccordionField extends Component {
  hasError(errors, includesPaths) {
    return Object.keys(errors).some((errorPath) =>
      includesPaths.some((path) => errorPath.startsWith(path))
    );
  }

  getErrorSummary = (errors, includePaths, severityChecks) => {
    const count = {};

    // Count generic errors
    for (const path in errors.flattenedErrors) {
      if (includePaths.some((includePath) => path.startsWith(includePath))) {
        count["error"] = (count["error"] || 0) + 1;
      }
    }

    // Count severity-based errors
    for (const key in errors.severityChecks) {
      const severity = errors.severityChecks[key]?.severity;
      const path = key;

      if (
        severity &&
        includePaths.some((includePath) => path.startsWith(includePath))
      ) {
        count[severity] = (count[severity] || 0) + 1;
      }
    }

    // Format output to display labels
    const formattedCount = {};
    for (const [severity, num] of Object.entries(count)) {
      const label =
        severityChecks?.[severity]?.label ||
        severity.charAt(0).toUpperCase() + severity.slice(1);
      formattedCount[severity] = `${num} ${label}${num === 1 ? "" : "s"}`;
    }

    return formattedCount;
  };

  renderAccordion = (props) => {
    const {
      form: { errors, initialErrors },
    } = props;
    const { includesPaths, label, children, active, severityChecks } = this.props;

    const uiProps = _omit(this.props, ["optimized", "includesPaths"]);
    const currentErrors = { ...initialErrors, ...errors };
    const categorizedErrors = flattenAndCategorizeErrors(currentErrors);

    const errorClass = this.hasError(categorizedErrors.flattenedErrors, includesPaths)
      ? "error secondary"
      : "";
    const errorSummary = this.getErrorSummary(
      categorizedErrors,
      includesPaths,
      severityChecks
    );

    const [activeIndex, setActiveIndex] = useState(active ? 0 : -1);

    const handleTitleClick = (e, { index }) => {
      setActiveIndex(activeIndex === index ? -1 : index);
    };

    return (
      <Accordion
        inverted
        className={`invenio-accordion-field ${errorClass}`}
        {...uiProps}
      >
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={handleTitleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleTitleClick(e, { index: 0 });
            }
          }}
          tabIndex={0}
        >
          {label}
          {Object.entries(errorSummary).map(([severity, text]) => (
            <Label
              key={severity}
              size="tiny"
              circular
              className={`accordion-label ${severity}`}
            >
              {text}
            </Label>
          ))}
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
