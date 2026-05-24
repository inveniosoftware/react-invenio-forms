/*
 * SPDX-FileCopyrightText: 2020 CERN.
 * SPDX-FileCopyrightText: 2020 Northwestern University.
 * SPDX-FileCopyrightText: 2021 Graz University of Technology.
 * SPDX-License-Identifier: MIT
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Icon } from "semantic-ui-react";

export class FieldLabel extends Component {
  render() {
    const { htmlFor, icon, label, className } = this.props;
    return (
      <label htmlFor={htmlFor} className={className}>
        {icon ? <Icon name={icon} /> : null}
        {label}
      </label>
    );
  }
}

FieldLabel.propTypes = {
  htmlFor: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  icon: PropTypes.string,
  className: PropTypes.string,
};

FieldLabel.defaultProps = {
  className: "field-label-class invenio-field-label",
  icon: "",
  htmlFor: undefined,
  label: undefined,
};
