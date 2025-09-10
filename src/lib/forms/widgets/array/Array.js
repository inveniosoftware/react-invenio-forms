import React, { Component } from "react";
import PropTypes from "prop-types";
import { FieldLabel } from "../../FieldLabel";
import { ArrayField } from "../../ArrayField";
import {
  fieldCommonProps,
  showHideOverridableWithDynamicId,
} from "../../fieldComponents";

class ArrayComponent extends Component {
  render() {
    const {
      fieldPath,
      required,
      label,
      icon,
      description,
      disabled,
      children,
      addButtonLabel,
      defaultNewValue,
      className,
      helpText: helpTextProp,
      labelIcon: labelIconProp,
    } = this.props;

    const helpText = helpTextProp ?? description;
    const labelIcon = labelIconProp ?? icon;

    return (
      <ArrayField
        key={fieldPath}
        fieldPath={fieldPath}
        required={required}
        helpText={helpText}
        disabled={disabled}
        label={<FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />}
        addButtonLabel={addButtonLabel}
        defaultNewValue={defaultNewValue}
        className={className}
      >
        {children}
      </ArrayField>
    );
  }
}

ArrayComponent.propTypes = {
  children: PropTypes.func.isRequired,
  addButtonLabel: PropTypes.string.isRequired,
  defaultNewValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  className: PropTypes.string,
  /**
   * @deprecated Use `labelIcon` instead
   */
  icon: PropTypes.string,
  /**
   * @deprecated Use `helpText` instead
   */
  description: PropTypes.string.isRequired,
  ...fieldCommonProps,
};

ArrayComponent.defaultProps = {
  className: "",
  icon: undefined,
};

export const Array = showHideOverridableWithDynamicId(ArrayComponent);
