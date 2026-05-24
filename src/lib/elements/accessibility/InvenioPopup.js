/*
 * SPDX-FileCopyrightText: 2023 CERN.
 * SPDX-License-Identifier: MIT
 */

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
