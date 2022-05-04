// This file is part of InvenioRDM
// Copyright (C) 2022 CERN.
//
// Invenio RDM Records is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import PropTypes from "prop-types";
import React, { Component } from "react";
import { Image as SUIImage, Ref } from "semantic-ui-react";
import axios from "axios";

/**
 * Primary UI Image component providing a fallback url if src one is not
 * able to be resolved. This is a thin layer on top of the <img> element.
 */
export class Image extends Component {
  async componentDidMount() {
    const { fallbackSrc, loadFallbackFirst, src } = this.props;
    if (loadFallbackFirst) {
      try {
        await axios.get(src);
        this.setSrc(this.myRef.current, src);
      } catch (error) {
        // Fallback image is already loaded
        console.warn(`
        '${src}' couldn't be resolved. '${fallbackSrc}' will be used instead.`);
      }
    }
  }
  myRef = React.createRef();

  setSrc = (currentTarget, src) => {
    if (currentTarget.nodeName !== "IMG") {
      // Item.Image is wrapping the <img> in a div element
      const img = currentTarget.querySelector("img");
      if (!img) {
        throw Error("No img tag found");
      }
      currentTarget = img;
    }
    currentTarget.src = src;
  };

  render() {
    const { alt, className, src, fallbackSrc, loadFallbackFirst, ...UIprops } =
      this.props;
    const loadingClass = !loadFallbackFirst ? `${className} placeholder` : className;
    const url = loadFallbackFirst ? fallbackSrc : src;
    return (
      <Ref innerRef={this.myRef}>
        <SUIImage
          className={loadingClass}
          alt={alt}
          src={url}
          {...(!loadFallbackFirst && {
            onError: ({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              this.setSrc(currentTarget, fallbackSrc);
            },
            onLoad: () => {
              // Control the loader via ref to make it immediately invisible
              if (!loadFallbackFirst) {
                this.myRef.current.classList.remove("placeholder");
              }
            },
          })}
          {...UIprops}
        />
      </Ref>
    );
  }
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  fallbackSrc: PropTypes.string,
  className: PropTypes.string,
  alt: PropTypes.string,
  loadFallbackFirst: PropTypes.bool,
};

Image.defaultProps = {
  className: "",
  alt: "No image found",
  fallbackSrc: "/static/images/square-placeholder.png",
  loadFallbackFirst: false,
};
