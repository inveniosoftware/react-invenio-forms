/*
 * SPDX-FileCopyrightText: 2022 CERN.
 * SPDX-License-Identifier: MIT
 */

import PropTypes from "prop-types";
import { Component, createRef } from "react";
import { Image as SUIImage } from "semantic-ui-react";
import axios from "axios";

const FALLBACK_SRC = "/static/images/square-placeholder.png";

/**
 * Primary UI Image component providing a fallback url if src one is not
 * able to be resolved. This is a thin layer on top of the <img> element.
 */
export class Image extends Component {
  async componentDidMount() {
    const { fallbackSrc = FALLBACK_SRC, loadFallbackFirst = false, src } = this.props;
    if (loadFallbackFirst && src) {
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
  componentDidUpdate(prevProps) {
    const { src, fallbackSrc } = this.props;
    if (prevProps.src !== src || prevProps.fallbackSrc !== fallbackSrc) {
      this.fallbackApplied = false;
    }
  }

  myRef = createRef();

  setSrc = (currentTarget, src, isFallback = false) => {
    if (isFallback) {
      if (!currentTarget.classList.contains("fallback_image")) {
        currentTarget.className += " fallback_image";
      }
    } else {
      if (currentTarget.classList.contains("fallback_image")) {
        currentTarget.classList.remove("fallback_image");
      }
    }
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
    const {
      alt = "No image found",
      className = "",
      src,
      fallbackSrc = FALLBACK_SRC,
      loadFallbackFirst = false,
      ...UIprops
    } = this.props;
    const hasChildren = UIprops.children != null || UIprops.content != null;
    if (!src && !hasChildren) {
      // Nothing to load, so render the fallback directly instead of an empty <img>.
      // Skipped when the caller provides its own <img> as children/content.
      if (!fallbackSrc) {
        return null;
      }
      return (
        <SUIImage
          ref={this.myRef}
          className={`${className} fallback_image`}
          alt={alt}
          src={fallbackSrc}
          {...UIprops}
        />
      );
    }
    const loadingClass = !loadFallbackFirst
      ? `${className} placeholder`
      : `${className} fallback_image`;
    const url = loadFallbackFirst ? fallbackSrc : src;
    return (
      <SUIImage
        ref={this.myRef}
        className={loadingClass}
        alt={alt}
        src={url}
        {...(!loadFallbackFirst && {
          // Capture phase: load/error don't bubble, so this also catches the
          // <img> when SUIImage wraps it in a div. `currentTarget` is the element
          // carrying the classes (the wrapper div, or the img itself).
          onErrorCapture: ({ currentTarget }) => {
            if (this.fallbackApplied) return; // prevents looping
            this.fallbackApplied = true;
            this.setSrc(currentTarget, fallbackSrc, true);
          },
          onLoadCapture: ({ currentTarget }) => {
            currentTarget.classList.remove("placeholder");
          },
        })}
        {...UIprops}
      />
    );
  }
}

Image.propTypes = {
  src: PropTypes.string,
  fallbackSrc: PropTypes.string,
  className: PropTypes.string,
  alt: PropTypes.string,
  loadFallbackFirst: PropTypes.bool,
};
