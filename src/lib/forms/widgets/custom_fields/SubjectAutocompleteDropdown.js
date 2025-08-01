import React, { Component } from "react";
import PropTypes from "prop-types";
import { RemoteSelectField } from "../../RemoteSelectField";
import { Field, getIn } from "formik";
import { FieldLabel } from "../../FieldLabel";

export class SubjectAutocompleteDropdown extends Component {
  serializeSubjects = (subjects) =>
    subjects.map((subject) => {
      const scheme = subject.scheme ? `(${subject.scheme}) ` : "";
      return {
        text: scheme + subject.subject,
        value: subject.id ?? subject.subject,
        key: subject.id ?? subject.subject,
        ...(subject.id ? { id: subject.id } : {}),
        subject: subject.subject,
      };
    });

  prepareSuggest = (searchQuery) => {
    const { limitTo } = this.props;
    return limitTo === "" || limitTo === "all"
      ? searchQuery
      : `${limitTo}:${searchQuery}`;
  };

  render() {
    const {
      fieldPath,
      required,
      multiple,
      placeholder,
      clearable,
      label,
      icon,
      width,
      allowAdditions,
      noQueryMessage,
      disabled,
      ...uiProps
    } = this.props;
    const labelContent = label ? (
      <FieldLabel htmlFor={fieldPath} icon={icon} label={label} />
    ) : (
      <>
        {/* Placeholder label for alignment purposes */}
        <label
          htmlFor={fieldPath}
          className="mobile-hidden"
          aria-label="Placeholder label for alignment purposes"
        >
          &nbsp;
        </label>
      </>
    );

    return (
      <Field name={fieldPath}>
        {({ form: { values } }) => (
          <RemoteSelectField
            {...uiProps}
            clearable={clearable}
            fieldPath={fieldPath}
            initialSuggestions={getIn(values, fieldPath, [])}
            multiple={multiple}
            noQueryMessage={noQueryMessage}
            placeholder={placeholder}
            preSearchChange={this.prepareSuggest}
            required={required}
            serializeSuggestions={this.serializeSubjects}
            serializeAddedValue={(value) => ({
              text: value,
              value: value,
              key: value,
              subject: value,
            })}
            suggestionAPIUrl="/api/subjects"
            onValueChange={({ formikProps }, selectedSuggestions) => {
              formikProps.form.setFieldValue(
                fieldPath,
                selectedSuggestions.map((subject) => ({
                  subject: subject.subject,
                  id: subject.id,
                }))
              );
            }}
            label={labelContent}
            value={getIn(values, fieldPath, []).map((val) => val.id ?? val.subject)}
            allowAdditions={allowAdditions}
            width={width}
            disabled={disabled}
          />
        )}
      </Field>
    );
  }
}

SubjectAutocompleteDropdown.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  limitTo: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.string,
  required: PropTypes.bool,
  multiple: PropTypes.bool,
  clearable: PropTypes.bool,
  placeholder: PropTypes.string,
  width: PropTypes.number,
  allowAdditions: PropTypes.bool,
  noQueryMessage: PropTypes.string,
  disabled: PropTypes.bool,
};

SubjectAutocompleteDropdown.defaultProps = {
  required: false,
  limitTo: "",
  label: "",
  icon: undefined,
  multiple: true,
  clearable: true,
  placeholder: "Search for a subject by name",
  width: undefined,
  noQueryMessage: "Search or create subjects...",
  allowAdditions: true,
  disabled: false,
};
