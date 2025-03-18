// This file is part of React-Invenio-Forms
// Copyright (C) 2023 CERN.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Popup } from "semantic-ui-react";

export class InvenioPopup extends Component {
  render() {
    const {
      popupId,
      size,
      trigger,
      content,
      position,
      inverted,
      ariaLabel,
      hoverable,
    } = this.props;

    return (
      <Popup
        id={popupId}
        size={size}
        position={position}
        inverted={inverted}
        hoverable={hoverable}
        on={["hover", "focus"]}
        trigger={React.cloneElement(trigger, {
          "role": "button",
          "tabIndex": 0,
          "aria-label": ariaLabel,
        })}
        content={
          <p role="tooltip" aria-live="polite">
            {content}
          </p>
        }
      />
    );
  }
}

InvenioPopup.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  trigger: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  popupId: PropTypes.string.isRequired,
  inverted: PropTypes.bool,
  hoverable: PropTypes.bool,
  position: PropTypes.string,
  size: PropTypes.string,
};

InvenioPopup.defaultProps = {
  inverted: false,
  position: "top left",
  size: "small",
  hoverable: true,
};
