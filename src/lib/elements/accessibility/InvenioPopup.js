/*
 * SPDX-FileCopyrightText: 2023 CERN.
 * SPDX-License-Identifier: MIT
 */

import { Component, cloneElement } from "react";
import PropTypes from "prop-types";
import { Popup } from "semantic-ui-react";

export class InvenioPopup extends Component {
  render() {
    const {
      popupId,
      size = "small",
      trigger,
      content,
      position = "top left",
      inverted = false,
      ariaLabel,
      hoverable = true,
    } = this.props;

    return (
      <Popup
        id={popupId}
        size={size}
        position={position}
        inverted={inverted}
        hoverable={hoverable}
        on={["hover", "focus"]}
        trigger={cloneElement(trigger, {
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
