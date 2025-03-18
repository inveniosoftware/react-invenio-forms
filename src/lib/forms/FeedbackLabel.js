import React, { Component } from "react";
import { Label, Icon } from "semantic-ui-react";
import { flattenAndCategorizeErrors } from "../utils";
import { InvenioPopup } from "../elements/accessibility";
import PropTypes from "prop-types";

export class FeedbackLabel extends Component {
  constructor(props) {
    super(props);

    const { errorMessage } = props;
    const { flattenedErrors = {}, severityChecks = {} } =
      flattenAndCategorizeErrors(errorMessage);

    // Get the first error and severity data, defaulting to empty values if not present
    const errorText = Object.values(flattenedErrors)[0] || "";
    const severityData = Object.values(severityChecks)[0] || {};

    // Destructure severityData, ensuring default values for missing keys
    const severityLevel = severityData?.severity || "";
    const severityMessage = severityData?.message || "";
    const severityDescription = severityData?.description || "";

    this.state = {
      errorText,
      severityInfo: { severityLevel, severityMessage, severityDescription },
      prompt: !severityLevel && !!errorText,
    };
  }

  render() {
    const { errorText, severityInfo, prompt } = this.state;

    // Return null if neither errorText nor severityMessage exists
    if (!errorText && !severityInfo.severityMessage) {
      return null;
    }
    const hasSeverity =
      severityInfo.severityMessage && severityInfo.severityDescription;
    return (
      <Label pointing="left" className={severityInfo.severityLevel} prompt={prompt}>
        {/* Display severity message with a popup if it exists */}
        {hasSeverity && (
          <InvenioPopup
            trigger={<Icon name="info circle" />}
            content={severityInfo.severityDescription}
            position="top center"
            hoverable
          />
        )}
        {/* Display either the error text or the severity message */}
        {errorText || severityInfo.severityMessage}
      </Label>
    );
  }
}

FeedbackLabel.propTypes = {
  errorMessage: PropTypes.object,
};

FeedbackLabel.defaultProps = {
  errorMessage: undefined,
};
