import { useFormikContext } from "formik";
import * as React from "react";

export function dynamicParametrize(Component, propsFactory) {
  const ParametrizedComponent = (props) => {
    const { values } = useFormikContext();
    const extraProps = propsFactory({ formValues: values });

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
