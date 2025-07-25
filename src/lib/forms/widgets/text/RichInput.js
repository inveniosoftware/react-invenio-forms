import React, { Component } from "react";
import PropTypes from "prop-types";
import { FieldLabel } from "../../FieldLabel";
import { RichInputField } from "../../RichInputField";
import {
  createDynamicOverridableComponent,
  createShowHideComponent,
  fieldCommonProps,
} from "../../../utils";

class _RichInputComponent extends Component {
  render() {
    const {
      fieldPath,
      required,
      label,
      icon,
      description,
      editorConfig,
      disabled,
      helpText: helpTextProp,
      labelIcon: labelIconProp,
    } = this.props;

    const helpText = helpTextProp ?? description;
    const labelIcon = labelIconProp ?? icon;

    return (
      <>
        <RichInputField
          key={fieldPath}
          fieldPath={fieldPath}
          required={required}
          disabled={disabled}
          editorConfig={editorConfig}
          label={<FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />}
        />
        {helpText && <label className="helptext">{helpText}</label>}
      </>
    );
  }
}

_RichInputComponent.propTypes = {
  editorConfig: PropTypes.object,
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

_RichInputComponent.defaultProps = {
  icon: undefined,
  editorConfig: {},
};

export const RichInputComponent = createShowHideComponent(_RichInputComponent);
export const RichInput = createDynamicOverridableComponent(RichInputComponent);
