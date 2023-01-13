import React, { Component } from "react";
import { Form } from "semantic-ui-react";
import { DateTimeInput } from "semantic-ui-calendar-react";
import PropTypes from "prop-types";

export default class DateTimePicker extends Component {
  constructor(props) {
    super(props);

    const now = new Date();
    this.state = {
      dateTime: `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`,
    };
  }

  handleChange = ({ name, value }) => {
    console.log("NAME:", name, "\nVALUE:", value);
  };

  render() {
    const { dateTime } = this.state;
    console.log("\n\n\nDATE TIME:", dateTime);
    const {
      fieldPath,
      required,
      label,
      icon,
      placeholder,
      description,
      disabled,
      type,
    } = this.props;

    return (
      <Form>
        <DateTimeInput
          fieldPath={fieldPath}
          // inline
          disableMinute
          name={fieldPath}
          value={dateTime}
          iconPosition="left"
          onChange={this.handleChange}
          duration={200}
          animation="none"
          label={label}
          placeholder={placeholder}
          icon={icon}
          required={required}
          type={type}
          disabled={disabled}
        />
        {description && <label className="helptext">{description}</label>}
      </Form>
    );
  }
}

DateTimePicker.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  icon: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string,
};

DateTimePicker.defaultProps = {
  placeholder: "Select date and time",
  icon: "calendar",
  required: false,
  disabled: false,
  type: "input",
};
