// This file is part of React-Invenio-Forms
// Copyright (C) 2022-2025 CERN.
// Copyright (C) 2022 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import PropTypes from "prop-types";
import React from "react";
import Overridable from "react-overridable";

// Props used for fields that are mandatory for all records
export const mandatoryFieldCommonProps = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  helpText: PropTypes.string,
  placeholder: PropTypes.string,
};

// Also includes props that allow not including a field in the form, which are not applicable
// to mandatory fields.
export const fieldCommonProps = {
  ...mandatoryFieldCommonProps,
  hidden: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

export const createCommonDepositFieldComponent = (id, Child) => {
  const Component = ({ hidden, ...props }) => {
    if (props.disabled && props.required) {
      throw new Error(`Cannot make field component ${id} both required and disabled`);
    }

    if (props.hidden) return null;
    return <Child {...props} />;
  };

  Component.propTypes = Child.propTypes;
  return Overridable.component(id, Component);
};

export const createShowHideComponent = (Component) => {
  const ShowHideComponent = ({ hidden, ...props }) => {
    if (hidden) return null;
    return <Component {...props} />;
  };

  ShowHideComponent.displayName = `ShowHide(${
    Component.displayName || Component.name
  })`;
  ShowHideComponent.propTypes = { ...Component.propTypes };
  ShowHideComponent.defaultProps = { ...Component.defaultProps };
  return ShowHideComponent;
};

export const createDynamicOverridableWidget = (Widget) => {
  const Component = ({ id, ...props }) => {
    if (id === undefined) return <Widget {...props} />;

    return (
      <Overridable id={id} {...props}>
        <Widget {...props} />
      </Overridable>
    );
  };

  Component.propTypes = { ...Widget.propTypes, id: PropTypes.string };
  Component.defaultProps = { ...Widget.defaultProps, id: undefined };
  Component.displayName = `DynamicOverridable(${Widget.displayName || Widget.name})`;
  return Component;
};
