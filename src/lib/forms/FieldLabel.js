// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

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
  labelIcon: PropTypes.string,
  className: PropTypes.string,
};

FieldLabel.defaultProps = {
  className: 'field-label-class'
}
