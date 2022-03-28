// This file is part of InvenioRDM
// Copyright (C) 2022 CERN.
//
// Invenio RDM Records is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import PropTypes from "prop-types";
import React, { Component } from "react";
import { Image as SUIImage } from "semantic-ui-react";

/**
 * Primary UI Image component providing a fallback url if src one is not
 * able to be resolved. This is a thin layer on top of the <img> element.
 */
export class Image extends Component {
  render() {
    const { alt, src, fallbackSrc, className, ...UIprops } = this.props;
    return (
      <SUIImage
        className={className}
        alt={alt}
        src={src}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = fallbackSrc;
        }}
        {...UIprops}
      />
    );
  }
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  fallbackSrc: PropTypes.string,
  className: PropTypes.string,
  alt: PropTypes.string,
};

Image.defaultProps = {
  className: "",
  alt: "No image found",
  fallbackSrc: "/static/images/square-placeholder.png",
};
