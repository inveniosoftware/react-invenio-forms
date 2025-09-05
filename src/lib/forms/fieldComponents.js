// This file is part of React-Invenio-Forms
// Copyright (C) 2025 CERN.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { useFormikContext } from "formik";
import * as React from "react";

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
