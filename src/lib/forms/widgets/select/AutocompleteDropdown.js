import React, { Component } from "react";
import PropTypes from "prop-types";

import _get from "lodash/get";
import _isArray from "lodash/isArray";
import { Field } from "formik";
import { FieldLabel } from "../../FieldLabel";
import { RemoteSelectField } from "../../RemoteSelectField";
import {
  createDynamicOverridableComponent,
  createShowHideComponent,
  fieldCommonProps,
} from "../../../utils";

class _AutocompleteDropdownComponent extends Component {
  render() {
    const {
      description,
      fieldPath,
      required,
      label,
      icon,
      clearable,
      placeholder,
      multiple,
      autocompleteFrom,
      autocompleteFromAcceptHeader,
      helpText: helpTextProp,
      labelIcon: labelIconProp,
    } = this.props;

    const helpText = helpTextProp ?? description;
    const labelIcon = labelIconProp ?? icon;

    return (
      <>
        <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
        <Field name={fieldPath}>
          {({ form: { values } }) => {
            return (
              <RemoteSelectField
                clearable={clearable}
                required={required}
                fieldPath={fieldPath}
                multiple={multiple}
                noQueryMessage={placeholder}
                placeholder={placeholder}
                suggestionAPIUrl={autocompleteFrom}
                suggestionAPIHeaders={{
                  Accept: autocompleteFromAcceptHeader,
                }}
                serializeSuggestions={(suggestions) => {
                  return _isArray(suggestions)
                    ? suggestions.map((item) => ({
                        text: item.title_l10n,
                        value: item.id,
                        key: item.id,
                      }))
                    : [
                        {
                          text: suggestions.title_l10n,
                          value: suggestions.id,
                          key: suggestions.id,
                        },
                      ];
                }}
                initialSuggestions={_get(values, `ui.${fieldPath}`, [])}
              />
            );
          }}
        </Field>
        {helpText && <label className="helptext">{helpText}</label>}
      </>
    );
  }
}

_AutocompleteDropdownComponent.propTypes = {
  placeholder: PropTypes.string.isRequired,
  autocompleteFrom: PropTypes.string.isRequired,
  autocompleteFromAcceptHeader: PropTypes.string,
  clearable: PropTypes.bool,
  multiple: PropTypes.bool,
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

_AutocompleteDropdownComponent.defaultProps = {
  autocompleteFromAcceptHeader: "application/vnd.inveniordm.v1+json",
  clearable: false,
  multiple: false,
  icon: undefined,
  description: undefined,
};

export const AutocompleteDropdownComponent = createShowHideComponent(
  _AutocompleteDropdownComponent
);
export const AutocompleteDropdown = createDynamicOverridableComponent(
  AutocompleteDropdownComponent
);
