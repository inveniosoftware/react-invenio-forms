import React, { Component } from "react";
import PropTypes from "prop-types";

import { FieldLabel } from "../../FieldLabel";
import { RichInputField } from "../../RichInputField";

export default class RichInput extends Component {
  render() {
    const { fieldPath, required, label, icon, description, editorConfig } = this.props;
    return (
      <>
        <RichInputField
          key={fieldPath}
          fieldPath={fieldPath}
          required={required}
          editorConfig={editorConfig}
          label={<FieldLabel htmlFor={fieldPath} icon={icon} label={label} />}
        />
        {description && <label className="helptext">{description}</label>}
      </>
    );
  }
}

RichInput.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  editorConfig: PropTypes.object,
  icon: PropTypes.string,
  required: PropTypes.bool,
};

RichInput.defaultProps = {
  icon: undefined,
  editorConfig: {},
  required: false,
};
