// This file is part of React-Invenio-Forms
// Copyright (C) 2022 CERN.
// Copyright (C) 2022 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";
import PropTypes from "prop-types";
import { ComposeFields } from "./ComposeFields";
import { AccordionField } from "../../AccordionField";
import { loadWidgetsFromConfig } from "../loader";

export class CustomFields extends Component {
  constructor(props) {
    super(props);
    this.state = { sections: undefined, composeSections: undefined };
  }

  componentDidMount() {
    this.populateConfig();
  }

  populateConfig = async () => {
    const { includesPaths, fieldPathPrefix } = this.props;
    try {
      const { sectionsConfig, composeSectionConfig } =
        await this.loadCustomFieldsWidgets();
      const sections = sectionsConfig.map((sectionCfg) => {
        const paths = includesPaths(sectionCfg.fields, fieldPathPrefix);
        return { ...sectionCfg, paths };
      });

      const composeSections = composeSectionConfig.map((sectionCfg) => {
        const paths = includesPaths(sectionCfg.fields, fieldPathPrefix);
        return { ...sectionCfg, paths };
      });

      this.setState({ sections: sections, composeSections: composeSections });
    } catch (error) {
      console.error("Couldn't load custom fields widgets.", error);
    }
  };

  async loadCustomFieldsWidgets() {
    const { config, fieldPathPrefix, templateLoaders, record } = this.props;

    const sections = [];
    const composeFieldSections = [];
    for (const sectionCfg of config) {
      // Path to end user's folder defining custom fields ui widgets
      const fields = await loadWidgetsFromConfig({
        templateLoaders: templateLoaders,
        fieldPathPrefix: fieldPathPrefix,
        fields: sectionCfg.fields,
        record: record,
      });
      if (sectionCfg.compose_fields) {
        composeFieldSections.push({
          ...sectionCfg,
          fields: fields,
          fieldsConfig: sectionCfg.fields,
        });
      } else {
        sections.push({ ...sectionCfg, fields });
      }
    }
    return { sectionsConfig: sections, composeSectionConfig: composeFieldSections };
  }

  render() {
    const { sections, composeSections } = this.state;
    const { templateLoaders, record } = this.props;
    return (
      <>
        {sections &&
          sections.map(({ fields, paths, ...sectionConfig }) => (
            <AccordionField
              key={sectionConfig.section}
              includesPaths={paths}
              label={sectionConfig.section}
              active
            >
              {fields}
            </AccordionField>
          ))}
        {composeSections && composeSections && (
          <ComposeFields
            templateLoaders={templateLoaders}
            composeSections={composeSections}
            record={record}
          />
        )}
      </>
    );
  }
}

CustomFields.propTypes = {
  config: PropTypes.arrayOf(
    PropTypes.shape({
      section: PropTypes.string.isRequired,
      fields: PropTypes.arrayOf(
        PropTypes.shape({
          field: PropTypes.string.isRequired,
          ui_widget: PropTypes.string.isRequired,
          props: PropTypes.object,
        })
      ),
    })
  ).isRequired,
  templateLoaders: PropTypes.array.isRequired,
  fieldPathPrefix: PropTypes.string.isRequired,
  includesPaths: PropTypes.func,
  record: PropTypes.object.isRequired,
};

CustomFields.defaultProps = {
  includesPaths: (fields) => fields.map((field) => field.key),
};
