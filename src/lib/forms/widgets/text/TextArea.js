import React, { Component } from "react";
import PropTypes from "prop-types";
import { FieldLabel } from "../../FieldLabel";
import { TextAreaField } from "../../TextAreaField";
import {
  fieldCommonProps,
  showHideOverridableWithDynamicId,
} from "../../fieldComponents";

class TextAreaComponent extends Component {
  render() {
    const {
      fieldPath,
      required,
      label,
      icon,
      description,
      rows,
      disabled,
      helpText: helpTextProp,
      labelIcon: labelIconProp,
    } = this.props;

    const helpText = helpTextProp ?? description;
    const labelIcon = labelIconProp ?? icon;

    return (
      <>
        <TextAreaField
          key={fieldPath}
          fieldPath={fieldPath}
          required={required}
          disabled={disabled}
          rows={rows}
          label={<FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />}
        />
        {helpText && <label className="helptext">{helpText}</label>}
      </>
    );
  }
}

TextAreaComponent.propTypes = {
  rows: PropTypes.number,
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

TextAreaComponent.defaultProps = {
  icon: undefined,
  rows: 3,
};

export const TextArea = showHideOverridableWithDynamicId(TextAreaComponent);
