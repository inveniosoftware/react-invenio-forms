import React, { Component } from "react";
import PropTypes from "prop-types";
import { FieldLabel } from "../../FieldLabel";
import { TextField } from "../../TextField";
import {
  fieldCommonProps,
  showHideOverridableWithDynamicId,
} from "../../fieldComponents";

export class InputComponent extends Component {
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

InputComponent.propTypes = {
  /**
   * @deprecated Use `helpText` instead
   */
  description: PropTypes.string,
  /**
   * @deprecated Use `labelIcon` instead
   */
  icon: PropTypes.string,
  type: PropTypes.string,
  ...fieldCommonProps,
};

InputComponent.defaultProps = {
  icon: undefined,
  description: undefined,
  type: "input",
};

export const Input = showHideOverridableWithDynamicId(InputComponent);
