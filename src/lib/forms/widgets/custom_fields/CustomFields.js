// This file is part of React-Invenio-Forms
// Copyright (C) 2022 CERN.
// Copyright (C) 2022 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";
import PropTypes from "prop-types";
import { default as DiscoverFieldsSection } from "./DiscoverFieldsSection";
import { AccordionField } from "../../AccordionField";
import { importWidget, loadWidgetsFromConfig } from "../loader";
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
      const sections = await Promise.all(
        sectionsConfig.map(async (sectionCfg) => {
          const paths = includesPaths(sectionCfg.fields, fieldPathPrefix);
          const widget = await this.loadSectionWidget(sectionCfg);
          return { ...sectionCfg, paths, widget };
        })
      ).then((values) => values);

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

  async loadSectionWidget(sectionCfg) {
    const { templateLoaders, record, includesPaths, fieldPathPrefix } = this.props;
    const paths = includesPaths(sectionCfg.fields, fieldPathPrefix);
    if (sectionCfg.ui_widget) {
      return await importWidget(
        templateLoaders,
        {
          ...sectionCfg,
          fieldPath: undefined,
          record,
          props: {
            includesPaths: paths,
            children: sectionCfg,
          },
        },
        false
      );
    }
  }

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
    const { templateLoaders, record, severityChecks } = this.props;

    return (
      <>
        {sections &&
          sections.map((section) => {
            const {
              fields,
              paths,
              displaySection = true,
              section: sectionName,
              widget,
              id: sectionId,
            } = section;
            const active = section.active !== undefined ? section.active : true;
            const Element = widget !== undefined ? widget : AccordionField;
            return displaySection ? (
              <Element
                key={`section-${sectionName}`}
                includesPaths={paths}
                severityChecks={severityChecks}
                label={sectionName}
                active={active}
                id={sectionId}
              >
                {fields}
              </Element>
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
      ui_widget: PropTypes.string,
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
  severityChecks: PropTypes.object,
  record: PropTypes.object.isRequired,
};

CustomFields.defaultProps = {
  includesPaths: (fields) => fields.map((field) => field.key),
  severityChecks: null,
};
