// This file is part of InvenioRDM
// Copyright (C) 2022 CERN.
//
// Invenio RDM Records is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Primary UI Image component providing a fallback url if src one is not
 * able to be resolved. This is a thin layer on top of the <img> element.
 */
export class Image extends Component {
  render() {
    const { alt, src, fallbackSrc, className } = this.props;
    return (
      <img
        className={className}
        alt={alt}
        src={src}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = fallbackSrc;
        }}
      />
    );
  }
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  fallbackSrc: PropTypes.string.isRequired,
  className: PropTypes.string,
  alt: PropTypes.string,
};

Image.defaultProps = {
  className: '',
  alt: 'No image found',
};
