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
import _get from "lodash/get";

export class AccordionField extends Component {
  hasError = (errors, initialValues = undefined, values = undefined) => {
    const { includesPaths } = this.props;
    for (const errorPath in errors) {
      for (const subPath in errors[errorPath]) {
        const path = `${errorPath}.${subPath}`;
        if (
          _get(initialValues, path, "") === _get(values, path, "") &&
          includesPaths.includes(path)
        ) {
          return true;
        }
      }
    }
    return false;
  };

  flattenErrors = (errors) => {
    let flattened = {};

    const recurse = (obj, path = "") => {
      if (Array.isArray(obj)) {
        // For arrays, treat each item individually, appending the index to the path
        obj.forEach((item, index) => {
          recurse(item, `${path}[${index}]`);
        });
      } else if (typeof obj === "object" && obj !== null) {
        // If it's an object, recursively traverse it
        for (const key in obj) {
          const newPath = path ? `${path}.${key}` : key;
          recurse(obj[key], newPath);
        }
      } else {
        // If it's a value, save the path and value
        flattened[path] = obj;
      }
    };

    recurse(errors);
    return flattened;
  };

  countErrors = (errors, includePaths) => {
    const flattenedErrors = this.flattenErrors(errors);
    let count = 0;

    // Count matching paths from includePaths
    for (const path in flattenedErrors) {
      if (includePaths.some((includePath) => path.startsWith(includePath))) {
        count++;
      }
    }

    return count;
  };

  renderAccordion = (props) => {
    const {
      form: { errors, status, initialErrors, initialValues, values },
    } = props;
    const { includesPaths, label, children, active } = this.props;

    const uiProps = _omit(this.props, ["optimized", "includesPaths"]);
    const hasError =
      this.hasError(errors, initialValues, values) || this.hasError(initialErrors);

    const errorCount =
      this.countErrors(errors, includesPaths) ||
      this.countErrors(initialErrors, includesPaths);
    const errorClass = hasError ? "error secondary" : "";
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
          {errorCount > 0 && (
            <Label size="tiny" circular negative className="error-label">
              {errorCount} {errorCount === 1 ? "error" : "errors"}
            </Label>
          )}
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
};

AccordionField.defaultProps = {
  active: true,
  includesPaths: [],
  label: "",
  optimized: false,
  children: null,
  ui: null,
};
