// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { FastField, Field, getIn } from "formik";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Form } from "semantic-ui-react";
import { FieldLabel } from "./FieldLabel";
import _omit from "lodash/omit";

export class RadioField extends Component {
  /** Radio Formik wrapper Component */

  renderFormField = (formikProps) => {
    /** Radio Formik + Semantic-UI Field Component
     *
     * NOTE: renderFormField is run multiple times
     * TODO: might gain performance by extracting it out as own component and
     *       using class methods
     *
     * field: current Formik field (RadioField instance)
     * form: current Formik form (holds formik state that drives the UI)
     */

    const { checked, fieldPath, label, labelIcon, onChange, value, ...ui } = this.props;

    const handleChange = (event, data) => {
      if (onChange) {
        onChange({ event, data, formikProps });
      } else {
        formikProps.form.setFieldValue(fieldPath, value);
      }
    };

    const uiProps = _omit(ui, ["optimized"]);

    return (
      <Form.Radio
        name={fieldPath}
        label={<FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />}
        value={getIn(formikProps.form.values, fieldPath, "")}
        checked={checked}
        onChange={handleChange}
        className="invenio-radio-field"
        {...uiProps}
      />
    );
  };

  render() {
    const { optimized, fieldPath } = this.props;

    const FormikField = optimized ? FastField : Field;
    return <FormikField name={fieldPath} component={this.renderFormField} />;
  }
}

RadioField.propTypes = {
  checked: PropTypes.bool,
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  optimized: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
};

RadioField.defaultProps = {
  checked: false,
  label: "",
  optimized: false,
  labelIcon: "",
  onChange: undefined,
  value: "",
};
