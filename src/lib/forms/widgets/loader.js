import React from "react";

/** Import function to load widget either from a specific path or local widgets
 *
 * The user defined path to import widget is of the format `@templates/<templatePath>`.
 * Note that the `@template` alias should be a correctly resolving path and it's the
 * user of this function that has to ensure that. The value is hardcoded here as the
 * dynamic import cannot rely on purely a dynamic path i.e a variable.
 */
export async function importWidget(
  templateLoaders,
  { ui_widget: UIWidget, fieldPath, record, props },
  createElement = true
) {
  let component = undefined;
  // Try import widget from user's defined templateLoaders
  for (const loader of templateLoaders) {
    try {
      const module = await loader(UIWidget);
      component = module.default ?? module[UIWidget];
      // Component was found, stop looking.
      if (component) {
        break;
      }
    } catch (error) {
      // If the component failed to load from a loader, try other loaders first.
      continue;
    }
  }

  // Loading failed, log it and throw an error.
  if (component === undefined) {
    console.error(`Failed to import default component ${UIWidget}.js`);
    throw Error("Component not found in any loader");
  }
  if (createElement) {
    return React.createElement(component, {
      ...props,
      record: record,
      key: fieldPath,
      fieldPath: fieldPath,
    });
  } else {
    return component;
  }
}

/**
 * @param config: Configuration to load widgets
 *
 * Example configuration
 *
 * {
 *  fieldPathPrefix: "mynamespace" or empty,
 *  templateLoader: UIWidget => import(`my_folder/${UIWidget}.js`),
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
export async function loadWidgetsFromConfig({
  templateLoaders,
  fieldPathPrefix,
  fields,
  record,
}) {
  const importWidgetsFromFolder = (templateFolder, fieldPathPrefix, fieldsConfig) => {
    const tplPromises = [];
    fieldsConfig.forEach((fieldCfg) => {
      tplPromises.push(
        importWidget(templateFolder, {
          ...fieldCfg,
          fieldPath: fieldPathPrefix
            ? `${fieldPathPrefix}.${fieldCfg.field}`
            : fieldCfg.field,
          record,
        })
      );
    });
    return Promise.all(tplPromises);
  };
  const _fields = await importWidgetsFromFolder(
    templateLoaders,
    fieldPathPrefix,
    fields
  );
  return [..._fields];
}
