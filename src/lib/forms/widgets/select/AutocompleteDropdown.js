import React, { Component } from "react";
import PropTypes from "prop-types";

import _get from "lodash/get";
import _isArray from "lodash/isArray";
import { Field } from "formik";
import { FieldLabel } from "../../FieldLabel";
import { RemoteSelectField } from "../../RemoteSelectField";

export default class AutocompleteDropdown extends Component {
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
      autocomleteFrom,
      autocompleteFromAccepttHeader,
    } = this.props;
    return (
      <>
        <FieldLabel htmlFor={fieldPath} icon={icon} label={label} />
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
                suggestionAPIUrl={autocomleteFrom}
                suggestionAPIHeaders={{
                  Accept: autocompleteFromAccepttHeader,
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
        {description && <label className="helptext">{description}</label>}
      </>
    );
  }
}

AutocompleteDropdown.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  autocomleteFrom: PropTypes.string.isRequired,
  autocompleteFromAccepttHeader: PropTypes.string,
  icon: PropTypes.string,
  clearable: PropTypes.bool,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
};

AutocompleteDropdown.defaultProps = {
  icon: undefined,
  autocompleteFromAccepttHeader: "application/vnd.inveniordm.v1+json",
  clearable: false,
  multiple: false,
  required: false,
};
