// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import PropTypes from "prop-types";
import React from "react";
import { Form, Label } from "semantic-ui-react";
import { FieldLabel } from "../../FieldLabel";
import { RadioField } from "../../RadioField";

import { useField } from "formik";
import {
  fieldCommonProps,
  showHideOverridableWithDynamicId,
} from "../../fieldComponents";

function BooleanCheckboxComponent({
  description,
  icon,
  falseLabel,
  fieldPath,
  label,
  trueLabel,
  required,
  helpText: helpTextProp,
  labelIcon: labelIconProp,
  optimized,
}) {
  const helpText = helpTextProp ?? description;
  const labelIcon = labelIconProp ?? icon;

  // eslint-disable-next-line no-unused-vars
  const [_, meta] = useField(fieldPath);
  return (
    <>
      <Form.Group inline className="mb-0">
        <Form.Field required={required}>
          <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
        </Form.Field>
        <RadioField
          fieldPath={fieldPath}
          label={trueLabel}
          checked={meta.value === true}
          value
          optimized={optimized}
        />
        <RadioField
          fieldPath={fieldPath}
          label={falseLabel}
          checked={meta.value === false}
          value={false}
          optimized={optimized}
        />
        {meta.error && (
          <Form.Field required={required} className="error">
            <Label pointing="left" prompt>
              {meta.error}
            </Label>
          </Form.Field>
        )}
      </Form.Group>
      {helpText && <label className="helptext">{helpText}</label>}
    </>
  );
}

BooleanCheckboxComponent.propTypes = {
  trueLabel: PropTypes.string.isRequired,
  falseLabel: PropTypes.string.isRequired,
  /**
   * @deprecated Use `helpText` instead
   */
  description: PropTypes.string.isRequired,
  /**
   * @deprecated Use `labelIcon` instead
   */
  icon: PropTypes.string,
  optimized: PropTypes.bool,
  ...fieldCommonProps,
};

BooleanCheckboxComponent.defaultProps = {
  icon: undefined,
  optimized: true,
};

export const BooleanCheckbox = showHideOverridableWithDynamicId(
  BooleanCheckboxComponent
);
