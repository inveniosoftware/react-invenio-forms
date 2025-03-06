// This file is part of React-Invenio-Forms
// Copyright (C) 2022 CERN.
// Copyright (C) 2022 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";
import PropTypes from "prop-types";
import { DiscoverFieldsSection } from "./DiscoverFieldsSection";
import { AccordionField } from "../../AccordionField";
import { loadWidgetsFromConfig } from "../loader";
import { Container } from "semantic-ui-react";

export class CustomFields extends Component {
  constructor(props) {
    super(props);
    this.state = { sections: undefined, discoverFieldsSections: undefined };
  }

  componentDidMount() {
    this.populateConfig();
  }

  populateConfig = async () => {
    const { includesPaths, fieldPathPrefix } = this.props;
    try {
      const { sectionsConfig, discoverFieldsConfig } =
        await this.loadCustomFieldsWidgets();
      const sections = sectionsConfig.map((sectionCfg) => {
        const paths = includesPaths(sectionCfg.fields, fieldPathPrefix);
        return { ...sectionCfg, paths };
      });

      const discoverFieldsSections = discoverFieldsConfig.map((sectionCfg) => {
        const paths = includesPaths(sectionCfg.fields, fieldPathPrefix);
        return { ...sectionCfg, paths };
      });

      this.setState({
        sections: sections,
        discoverFieldsSections: discoverFieldsSections,
      });
    } catch (error) {
      console.error("Couldn't load custom fields widgets.", error);
    }
  };

  async loadCustomFieldsWidgets() {
    const { config, fieldPathPrefix, templateLoaders, record } = this.props;

    const sections = [];
    const discoverFieldsSections = []; // finds sections with discoverable fields
    for (const sectionCfg of config) {
      // Path to end user's folder defining custom fields ui widgets
      const fields = await loadWidgetsFromConfig({
        templateLoaders: templateLoaders,
        fieldPathPrefix: fieldPathPrefix,
        fields: sectionCfg.fields,
        record: record,
      });
      if (sectionCfg.discoverable_fields) {
        discoverFieldsSections.push({
          ...sectionCfg,
          fields: fields,
          fieldsConfig: sectionCfg.fields,
        });
      } else {
        sections.push({ ...sectionCfg, fields });
      }
    }
    return { sectionsConfig: sections, discoverFieldsConfig: discoverFieldsSections };
  }

  render() {
    const { sections, discoverFieldsSections } = this.state;
    const { templateLoaders, record } = this.props;
    return (
      <>
        {sections &&
          sections.map((section) => {
            const {
              fields,
              paths,
              displaySection = true,
              section: sectionName,
              id: sectionId,
            } = section;
            return displaySection ? (
              <AccordionField
                key={`section-${sectionName}`}
                includesPaths={paths}
                label={sectionName}
                active
                id={sectionId}
              >
                {fields}
              </AccordionField>
            ) : (
              <Container key="custom-fields-section">{fields}</Container>
            );
          })}
        {discoverFieldsSections && discoverFieldsSections.length > 0 && (
          <DiscoverFieldsSection
            templateLoaders={templateLoaders}
            sections={discoverFieldsSections}
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
      displaySection: PropTypes.bool,
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
