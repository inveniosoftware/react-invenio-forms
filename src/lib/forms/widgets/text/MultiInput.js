import React, { useState } from "react";
import PropTypes from "prop-types";
import { useFormikContext, getIn } from "formik";

import { FieldLabel } from "../../FieldLabel";
import { SelectField } from "../../SelectField";

export default function MultiInput({
  additionLabel,
  description,
  placeholder,
  fieldPath,
  label,
  icon,
  required,
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

  return (
    <>
      <SelectField
        fieldPath={fieldPath}
        label={<FieldLabel htmlFor={fieldPath} icon={icon} label={label} />}
        options={serializeValues(getIn(values, fieldPath, []))}
        placeholder={placeholder}
        required={required}
        search
        multiple
        clearable
        optimized
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
      {description && <label className="helptext">{description}</label>}
    </>
  );
}

MultiInput.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  additionLabel: PropTypes.string,
  icon: PropTypes.string,
  required: PropTypes.bool,
};

MultiInput.defaultProps = {
  additionLabel: undefined,
  icon: undefined,
  required: false,
};
