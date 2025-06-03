import _get from "lodash/get";
import React, { Component } from "react";
import { Label, Icon } from "semantic-ui-react";
import { InvenioPopup } from "../elements/accessibility";
import PropTypes from "prop-types";
import { Field } from "formik";

export class FeedbackLabel extends Component {
  renderErrors = ({ form: { errors, initialErrors } }) => {
    const { fieldPath, pointing, injectedError } = this.props;
    let error;
    if (injectedError) {
      error = injectedError;
    } else {
      error = _get(errors, fieldPath, "") || _get(initialErrors, fieldPath, "");
    }
    const hasSeverity = Object.prototype.hasOwnProperty.call(error, "severity");
    let errorMessage;
    if (hasSeverity) {
      errorMessage = error.message;
    } else {
      errorMessage = error;
    }
    const isError = errorMessage || error.severity === "error";
    const icon = isError ? "times circle" : "info circle";
    return (
      <Label pointing={pointing} className={isError ? "prompt" : error.severity}>
        {hasSeverity && (
          <InvenioPopup
            popupId={`invenio-form-feedback-error-${fieldPath}`}
            ariaLabel="Form field feedback error"
            trigger={<Icon name={icon} />}
            // Rule descriptions can contain HTML to link to a page with more details about the rule.
            // This field is sanitized in the backend with SanitizedHTML.
            content={<span dangerouslySetInnerHTML={{ __html: error.description }} />}
            position="top center"
            hoverable
          />
        )}
        {/* Display either the error text or the severity message */}
        {errorMessage}
      </Label>
    );
  };

  render() {
    const { fieldPath } = this.props;

    return (
      <Field className="invenio-error-label-field" name={fieldPath}>
        {this.renderErrors}
      </Field>
    );
  }
}

FeedbackLabel.propTypes = {
  injectedError: PropTypes.oneOf([PropTypes.object, PropTypes.string]),
  pointing: PropTypes.oneOf(["left", "above"]),
  fieldPath: PropTypes.string,
};

FeedbackLabel.defaultProps = {
  injectedError: undefined,
  pointing: "left",
  fieldPath: undefined,
};
