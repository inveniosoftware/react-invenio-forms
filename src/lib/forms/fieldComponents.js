// This file is part of React-Invenio-Forms
// Copyright (C) 2025 CERN.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { useFormikContext } from "formik";
import React from "react";
import PropTypes from "prop-types";
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

/**
 * Creates a component that de-renders when the `hidden` prop is `true`.
 * All props passed to the `ShowHideComponent` are forwarded to the child component except the `hidden` prop.
 *
 * @param Component - The child component
 * @param {string=} id - An optional OverridableID for debugging purposes
 */
const showHideComponent = (Component, id) => {
  const ShowHideComponent = ({ hidden, ...props }) => {
    if (props.disabled && props.required) {
      throw new Error(`Cannot make field component ${id} both required and disabled`);
    }
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

/**
 * Creates an overridable component with show/hide functionality based on the `hidden` prop.
 * All high-level fields in the deposit form are exported through this function, and this
 * is the only version of the component that should be exported.
 *
 * @param {string} id - The Overridable ID to use
 * @param Child - The unexported child component
 */
export const showHideOverridable = (id, Child) => {
  const Component = showHideComponent(Child);
  Component.propTypes = Child.propTypes;
  return Overridable.component(id, Component);
};

/**
 * Create a component whos Overridable ID is defined via a prop at runtime rather than pre-assigned.
 * This is necessary for custom fields, where Python will inject the Overridable ID from the user's
 * configuration, allowing features like `parametrize` to be applied also to custom fields.
 */
export const showHideOverridableWithDynamicId = (Widget) => {
  const ShowHideWidget = showHideComponent(Widget);
  const Component = ({ id, ...props }) => {
    if (id === undefined) return <ShowHideWidget {...props} />;

    return (
      <Overridable id={id} {...props}>
        <ShowHideWidget {...props} />
      </Overridable>
    );
  };

  Component.propTypes = { ...Widget.propTypes, id: PropTypes.string };
  Component.defaultProps = { ...Widget.defaultProps, id: undefined };
  Component.displayName = `DynamicOverridable(${Widget.displayName || Widget.name})`;
  return Component;
};

/**
 * Override the parameters of a component (similarly to `parametrize`) using certain available
 * context variables.
 *
 * Currently, the following arguments are passed into the `propsFactory` function:
 *   - `existingProps`: the props originally passed into the component before the override
 *   - `formValues`: an object of the values in the Formik form state
 *
 * The `propsFactory` function should return an object of the props to be used for overriding the
 * specified `Component`
 *
 * This function is adapted from `react-overridable`: https://github.com/indico/react-overridable/blob/d1ecfbec9993a461717824259900eec82d59f1e0/src/overridable.js#L7-L33
 *
 * @param Component - the React component to override the parameters, as in `parametrize` from react-overridable.
 * @param {function} propsFactory - function returning the props to override the component with
 */
export function parametrizeWithFormContext(Component, propsFactory) {
  const ParametrizedComponent = (props) => {
    const { values } = useFormikContext();
    const extraProps = propsFactory({ existingProps: props, formValues: values });

    // Store the original component in an attribute
    if (Component.originalComponent) {
      Component = Component.originalComponent;
    }

    // overrideProps override props if there is a name collision
    const { children, ...attrProps } = { ...props, ...extraProps };
    return React.createElement(Component, attrProps, children);
  };

  const name = Component.displayName || Component.name;
  ParametrizedComponent.displayName = `Parametrized(${name})`;
  return ParametrizedComponent;
}
