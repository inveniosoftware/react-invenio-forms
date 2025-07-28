import React, { Component } from "react";
import PropTypes from "prop-types";
import { FieldLabel } from "../../FieldLabel";
import { SelectField } from "../../SelectField";
import {
  createDynamicOverridableComponent,
  createShowHideComponent,
  fieldCommonProps,
} from "../../../utils";

class _DropdownComponent extends Component {
  serializeOptions = (options) =>
    options?.map((option) => ({
      text: option.title_l10n,
      value: option.id,
      key: option.id,
    }));

  render() {
    const {
      description,
      helpText: helpTextProp,
      placeholder,
      fieldPath,
      label,
      icon,
      labelIcon: labelIconProp,
      options,
      search,
      multiple,
      clearable,
      required,
      disabled,
    } = this.props;

    const helpText = helpTextProp ?? description;
    const labelIcon = labelIconProp ?? icon;

    return (
      <SelectField
        fieldPath={fieldPath}
        label={<FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />}
        options={this.serializeOptions(options)}
        search={search}
        aria-label={label}
        multiple={multiple}
        disabled={disabled}
        placeholder={{
          role: "option",
          content: placeholder,
        }}
        clearable={clearable}
        required={required}
        optimized
        defaultValue={multiple ? [] : ""}
        helpText={helpText}
      />
    );
  }
}

_DropdownComponent.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title_l10n: PropTypes.string.isRequired,
    })
  ).isRequired,
  search: PropTypes.bool,
  multiple: PropTypes.bool,
  clearable: PropTypes.bool,
  /**
   * @deprecated Use `helpText` instead
   */
  description: PropTypes.string,
  /**
   * @deprecated Use `labelIcon` instead
   */
  icon: PropTypes.string,
  ...fieldCommonProps,
};

_DropdownComponent.defaultProps = {
  icon: undefined,
  search: false,
  multiple: false,
  clearable: true,
  description: undefined,
};

export const DropdownComponent = createShowHideComponent(_DropdownComponent);
export const Dropdown = createDynamicOverridableComponent(DropdownComponent);
