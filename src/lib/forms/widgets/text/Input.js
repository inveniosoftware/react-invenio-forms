import React, { Component } from "react";
import PropTypes from "prop-types";
import { FieldLabel } from "../../FieldLabel";
import { TextField } from "../../TextField";
import {
  createShowHideComponent,
  createDynamicOverridableComponent,
  fieldCommonProps,
} from "../../../utils/";

class _InputComponent extends Component {
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
      helpText: helpTextProp,
      labelIcon: labelIconProp,
    } = this.props;

    const helpText = helpTextProp ?? description;
    const labelIcon = labelIconProp ?? icon;

    return (
      <TextField
        key={fieldPath}
        fieldPath={fieldPath}
        required={required}
        helpText={helpText}
        disabled={disabled}
        label={<FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />}
        placeholder={placeholder}
        type={type}
      />
    );
  }
}

_InputComponent.propTypes = {
  /**
   * @deprecated Use `helpText` instead
   */
  description: PropTypes.string.isRequired,
  /**
   * @deprecated Use `labelIcon` instead
   */
  icon: PropTypes.string,
  type: PropTypes.string,
  ...fieldCommonProps,
};

_InputComponent.defaultProps = {
  icon: undefined,
  type: "input",
};

export const InputComponent = createShowHideComponent(_InputComponent);
export const Input = createDynamicOverridableComponent(InputComponent);
