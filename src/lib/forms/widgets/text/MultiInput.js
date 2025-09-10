import React, { useState } from "react";
import PropTypes from "prop-types";
import { useFormikContext, getIn } from "formik";
import { FieldLabel } from "../../FieldLabel";
import { SelectField } from "../../SelectField";
import {
  fieldCommonProps,
  showHideOverridableWithDynamicId,
} from "../../fieldComponents";

function MultiInputComponent({
  additionLabel,
  description,
  placeholder,
  fieldPath,
  label,
  icon,
  required,
  disabled,
  helpText: helpTextProp,
  labelIcon: labelIconProp,
  optimized,
  ...uiProps
}) {
  const [options, setOptions] = useState([]);
  const { values } = useFormikContext();
  const serializeValues = (values) =>
    values?.map((item) => ({
      text: item,
      key: item,
      value: item,
    }));

  const helpText = helpTextProp ?? description;
  const labelIcon = labelIconProp ?? icon;

  return (
    <>
      <SelectField
        fieldPath={fieldPath}
        label={<FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />}
        options={serializeValues(getIn(values, fieldPath, []))}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        search
        multiple
        clearable
        optimized={optimized}
        defaultValue={[]}
        noResultsMessage={placeholder} // show the placeholder to instruct user how to add new values
        additionLabel={additionLabel}
        onChange={({ data, formikProps }) => {
          setOptions(serializeValues(data.value));
          formikProps.form.setFieldValue(fieldPath, data.value);
        }}
        allowAdditions
        onAddItem={({ data }) => {
          setOptions([{ text: data.value, value: data.value }, ...options]);
        }}
        icon={null} // remove the dropdown caret icon to avoid confusion
        {...uiProps}
      />
      {helpText && <label className="helptext">{helpText}</label>}
    </>
  );
}

MultiInputComponent.propTypes = {
  /**
   * @deprecated Use `helpText` instead
   */
  description: PropTypes.string.isRequired,
  additionLabel: PropTypes.string,
  /**
   * @deprecated Use `labelIcon` instead
   */
  icon: PropTypes.string,
  optimized: PropTypes.bool,
  ...fieldCommonProps,
};

MultiInputComponent.defaultProps = {
  additionLabel: undefined,
  icon: undefined,
  optimized: true,
};

export const MultiInput = showHideOverridableWithDynamicId(MultiInputComponent);
