import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import React, { Component } from "react";
import { Label, Icon } from "semantic-ui-react";
import { InvenioPopup } from "../elements/accessibility";
import PropTypes from "prop-types";
import { Field } from "formik";

export class FeedbackLabel extends Component {
  getAllErrSubPaths = (obj, prev = "") => {
    const result = [];

    for (let k in obj) {
      let path = prev + (prev ? "." : "") + k;

      // find leaf path of errors
      if (typeof obj[k] == "string" || obj[k].severity !== undefined) {
        result.push(path);
      } else if (typeof obj[k] == "object") {
        result.push(...this.getAllErrSubPaths(obj[k], path));
      }
    }

    return result;
  };

  computeErrors = (errors, initialErrors) => {
    const { fieldPath, injectedError, hasSubfields } = this.props;
    let error;

    if (injectedError) {
      error = injectedError;
    } else {
      error = _get(errors, fieldPath, "") || _get(initialErrors, fieldPath, "");
      if (hasSubfields) {
        // handle nested fields & their errors
        const errorPaths = this.getAllErrSubPaths(error);
        if (!isEmpty(errorPaths)) {
          // we display only first error, there is no good way to display all of them
          // when multiple errors on one field happen
          error = _get(error, errorPaths[0], "");
        }
      }
    }
    const hasSeverity = Object.prototype.hasOwnProperty.call(error, "severity");

    let errorMessage;
    if (hasSeverity) {
      errorMessage = error.message;
    } else if (!hasSeverity && !hasSubfields && typeof error === "object") {
      // this case will be for nested field error,
      // which should not display on the top level of the feedback label
      errorMessage = null;
    } else {
      errorMessage = error;
    }

    return { error: error, errMessage: errorMessage, hasSeverity: hasSeverity };
  };

  renderErrors = ({ form: { errors, initialErrors } }) => {
    const { fieldPath, pointing } = this.props;
    const { error, errMessage, hasSeverity } = this.computeErrors(
      errors,
      initialErrors
    );
    if (errMessage === null) {
      return null;
    }
    const isError = !hasSeverity || error.severity === "error";
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
        {errMessage}
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
  hasSubfields: PropTypes.bool,
};

FeedbackLabel.defaultProps = {
  injectedError: undefined,
  pointing: "left",
  fieldPath: undefined,
  hasSubfields: false,
};
