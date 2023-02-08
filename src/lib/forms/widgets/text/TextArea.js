import React, { Component } from "react";
import PropTypes from "prop-types";

import { FieldLabel } from "../../FieldLabel";
import { TextAreaField } from "../../TextAreaField";

export default class TextArea extends Component {
  render() {
    const { fieldPath, required, label, icon, description, rows } = this.props;

    return (
      <>
        <TextAreaField
          key={fieldPath}
          fieldPath={fieldPath}
          required={required}
          label={<FieldLabel htmlFor={fieldPath} icon={icon} label={label} />}
          rows={rows}
        />
        {description && <label className="helptext">{description}</label>}
      </>
    );
  }
}

TextArea.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string,
  required: PropTypes.bool,
  rows: PropTypes.number,
};

TextArea.defaultProps = {
  icon: undefined,
  required: false,
  rows: 3,
};
