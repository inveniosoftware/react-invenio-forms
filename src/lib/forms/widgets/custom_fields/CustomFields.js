// This file is part of React-Invenio-Forms
// Copyright (C) 2022 CERN.
// Copyright (C) 2022 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";
import PropTypes from "prop-types";
import { AccordionField } from "../../AccordionField";
import { loadWidgetsFromConfig } from "../loader";

export class CustomFields extends Component {
  state = { sections: [] };

  componentDidMount() {
    const { includesPaths, fieldPathPrefix } = this.props;
    // use of `Promise.then()` as eslint is giving an error when calling setState() directly
    // in the componentDidMount() method
    this.loadCustomFieldsWidgets()
      .then((sections) => {
        sections = sections.map((sectionCfg) => {
          const paths = includesPaths(sectionCfg.fields, fieldPathPrefix);
          return { ...sectionCfg, paths };
        });
        this.setState({ sections });
      })
      .catch((error) => {
        console.error("Couldn't load custom fields widgets.", error);
      });
  }

  async loadCustomFieldsWidgets() {
    const { config, fieldPathPrefix, templateLoader } = this.props;

    const sections = [];
    for (const sectionCfg of config) {
      // Path to end user's folder defining custom fields ui widgets
      const fields = await loadWidgetsFromConfig({
        templateLoader: templateLoader,
        fieldPathPrefix: fieldPathPrefix,
        fields: sectionCfg.fields,
      });
      sections.push({ ...sectionCfg, fields });
    }
    return sections;
  }

  render() {
    const { sections } = this.state;
    return (
      <>
        {sections.map(({ section, fields, paths }) => (
          <AccordionField key={section} includesPaths={paths} label={section} active>
            {fields}
          </AccordionField>
        ))}
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
  templateLoader: PropTypes.func.isRequired,
  fieldPathPrefix: PropTypes.string.isRequired,
  includesPaths: PropTypes.func,
};

CustomFields.defaultProps = {
  includesPaths: (fields) => fields.map((field) => field.key),
};
