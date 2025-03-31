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

export default function BooleanCheckbox({
  description,
  icon,
  falseLabel,
  fieldPath,
  label,
  trueLabel,
  required,
}) {
  // eslint-disable-next-line no-unused-vars
  const [_, meta] = useField(fieldPath);
  return (
    <>
      <Form.Group inline className="mb-0">
        <Form.Field required={required}>
          <FieldLabel htmlFor={fieldPath} icon={icon} label={label} />
        </Form.Field>
        <RadioField
          fieldPath={fieldPath}
          label={trueLabel}
          checked={meta.value === true}
          value
          optimized
        />
        <RadioField
          fieldPath={fieldPath}
          label={falseLabel}
          checked={meta.value === false}
          value={false}
          optimized
        />
        {meta.error && (
          <Form.Field required={required} className="error">
            <Label pointing="left" prompt>
              {meta.error}
            </Label>
          </Form.Field>
        )}
      </Form.Group>
      {description && <label className="helptext">{description}</label>}
    </>
  );
}

BooleanCheckbox.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  trueLabel: PropTypes.string.isRequired,
  falseLabel: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string,
  required: PropTypes.bool,
};

BooleanCheckbox.defaultProps = {
  icon: undefined,
  required: false,
};
