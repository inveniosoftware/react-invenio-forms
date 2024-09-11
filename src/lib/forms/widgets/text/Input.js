import React, { Component } from "react";
import PropTypes from "prop-types";

import { FieldLabel } from "../../FieldLabel";
import { TextField } from "../../TextField";

export default class Input extends Component {
  render() {
    const {
      fieldPath,
      required,
      label,
      icon,
      placeholder,
      description,
      disabled,
      type,
      value,
    } = this.props;

    return (
      <TextField
        key={fieldPath}
        fieldPath={fieldPath}
        required={required}
        helpText={description}
        disabled={disabled}
        label={<FieldLabel htmlFor={fieldPath} icon={icon} label={label} />}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    );
  }
}

Input.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.any,
};

Input.defaultProps = {
  icon: undefined,
  required: false,
  disabled: false,
  type: "input",
  value: undefined,
};
