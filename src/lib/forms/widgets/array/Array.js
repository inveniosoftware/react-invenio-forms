import React, { Component } from "react";
import PropTypes from "prop-types";

import { FieldLabel } from "../../FieldLabel";
import { ArrayField } from "../../ArrayField";

export default class Array extends Component {
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
    } = this.props;

    return (
      <ArrayField
        key={fieldPath}
        fieldPath={fieldPath}
        required={required}
        helpText={description}
        disabled={disabled}
        label={<FieldLabel htmlFor={fieldPath} icon={icon} label={label} />}
        addButtonLabel={addButtonLabel}
        defaultNewValue={defaultNewValue}
        className={className}
      >
        {children}
      </ArrayField>
    );
  }
}

Array.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.func.isRequired,
  addButtonLabel: PropTypes.string.isRequired,
  defaultNewValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  className: PropTypes.string,
};

Array.defaultProps = {
  icon: undefined,
  required: false,
  disabled: false,
  className: "",
};
