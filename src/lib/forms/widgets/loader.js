import React from "react";

/** Import function to load widget either from a specific path or local widgets
 *
 * The user defined path to import widget is of the format `@templates/<templatePath>`.
 * Note that the `@template` alias should be a correctly resolving path and it's the
 * user of this function that has to ensure that. The value is hardcoded here as the
 * dynamic import cannot rely on purely a dynamic path i.e a variable.
 */
export async function importWidget(
  templatePath,
  { ui_widget: UIWidget, fieldPath, props }
) {
  let component = null;
  try {
    // First look into the prefixed path for the component i.e check if user defined them
    const module = await import(`@templates/${templatePath}/${UIWidget}.js`);
    component = module.default ?? module[UIWidget];
  } catch (error) {
    try {
      // If not then look into widgets folder for the component
      const module = await import("./index");
      component = module.default ?? module[UIWidget];
    } catch (error) {
      console.error(`Failed to import default component ${UIWidget}.js`);
    }
  }
  if (component) {
    return React.createElement(component, {
      ...props,
      key: fieldPath,
      fieldPath: fieldPath,
    });
  }
}

/**
 * @param config: Configuration to load widgets
 *
 * Example configuration
 *
 * {
 *  fieldPathPrefix: "mynamespace" or empty,
 *  templatePath: "my_folder",
 *  fields: [{
 *    ui_widget: "MyWidget",
 *    field: "field_id",
 *    props: {
 *      label: "My label"
 *    }
 *  }]
 * }
 *
 * @returns array fields: resolved react components
 *
 * Example return
 *
 * [
 *  <Input fieldPath={'mynamespace.field_id'} label={label} />,
 *  ...
 * ]
 *
 */
export async function loadWidgetsFromConfig({ templatePath, fieldPathPrefix, fields }) {
  const importWidgetsFromFolder = (templateFolder, fieldPathPrefix, fieldsConfig) => {
    const tplPromises = [];
    fieldsConfig.forEach((fieldCfg) => {
      tplPromises.push(
        importWidget(templateFolder, {
          ...fieldCfg,
          fieldPath: fieldPathPrefix
            ? `${fieldPathPrefix}.${fieldCfg.field}`
            : fieldCfg.field,
        })
      );
    });
    return Promise.all(tplPromises);
  };
  const _fields = await importWidgetsFromFolder(templatePath, fieldPathPrefix, fields);
  return [..._fields];
}
