import PropTypes from "prop-types";
import { FieldLabel } from "../../FieldLabel";
import { RichInputField } from "../../RichInputField";
import {
  fieldCommonProps,
  showHideOverridableWithDynamicId,
} from "../../fieldComponents";

function RichInputComponent(props) {
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
    optimized,
  } = props;

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

RichInputComponent.propTypes = {
  editorConfig: PropTypes.object,
  /**
   * @deprecated Use `labelIcon` instead
   */
  icon: PropTypes.string,
  /**
   * @deprecated Use `helpText` instead
   */
  description: PropTypes.string.isRequired,
  optimized: PropTypes.bool,
  ...fieldCommonProps,
};

RichInputComponent.defaultProps = {
  icon: undefined,
  editorConfig: {},
  optimized: true,
};

export const RichInput = showHideOverridableWithDynamicId(RichInputComponent);
