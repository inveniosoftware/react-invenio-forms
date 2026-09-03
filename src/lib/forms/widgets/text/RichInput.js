/*
 * SPDX-FileCopyrightText: 2022-2025 CERN.
 * SPDX-License-Identifier: MIT
 */

import { Component } from "react";
import PropTypes from "prop-types";
import { FieldLabel } from "../../FieldLabel";
import { RichInputField } from "../../RichInputField";
import {
  fieldCommonProps,
  showHideOverridableWithDynamicId,
} from "../../fieldComponents";

const defaultEditorConfig = {};

class RichInputComponent extends Component {
  render() {
    const {
      fieldPath,
      required,
      label,
      icon,
      description,
      editorConfig = defaultEditorConfig,
      disabled,
      helpText: helpTextProp,
      labelIcon: labelIconProp,
      optimized = true,
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
          optimized={optimized}
        />
        {helpText && <label className="helptext">{helpText}</label>}
      </>
    );
  }
}

RichInputComponent.propTypes = {
  editorConfig: PropTypes.object,
  /**
   * @deprecated Use `labelIcon` instead
   */
  icon: PropTypes.string,
  /**
   * @deprecated Use `helpText` instead
   */
  description: PropTypes.string,
  optimized: PropTypes.bool,
  ...fieldCommonProps,
};

export const RichInput = showHideOverridableWithDynamicId(RichInputComponent);
