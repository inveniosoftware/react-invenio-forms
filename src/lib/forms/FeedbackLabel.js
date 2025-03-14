import React, { Component } from "react";
import { Label, Icon } from "semantic-ui-react";
import { flattenAndCategorizeErrors } from "../utils";
import { InvenioPopup } from "../elements/accessibility";
import PropTypes from "prop-types";

export class FeedbackLabel extends Component {
  render() {
    const { errorMessage } = this.props;
    if (!errorMessage) return null;

    const { flattenedErrors, severityChecks } =
      flattenAndCategorizeErrors(errorMessage);

    let errorText = "";
    let severityLevel = "";
    let severityMessage = "";

    if (flattenedErrors) {
      const errorKey = Object.keys(flattenedErrors)[0];
      errorText = flattenedErrors[errorKey];
    }

    if (severityChecks) {
      const severityKey = Object.keys(severityChecks)[0];
      const severityData = severityChecks[severityKey];
      if (severityData) {
        severityLevel = severityData.severity;
        severityMessage = severityData.message;
      }
    }

    if (errorMessage.message && errorMessage.severity) {
      severityLevel = errorMessage.severity;
      severityMessage = errorMessage.message;
    }

    const prompt = !severityLevel && !!errorText;

    return (
      <Label pointing="left" className={severityLevel} prompt={prompt}>
        {severityMessage && (
          <InvenioPopup
            trigger={<Icon name="info circle" />}
            content={
              <a target="_blank" href="_">
                {severityMessage}
              </a>
            }
            position="top center"
            hoverable
          />
        )}
        {errorText || severityMessage}
      </Label>
    );
  }
}

FeedbackLabel.propTypes = {
  errorMessage: PropTypes.array,
};

FeedbackLabel.defaultProps = {
  errorMessage: undefined,
};
