import _isEmpty from "lodash/isEmpty";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Divider } from "semantic-ui-react";
import { AccordionField } from "../../AccordionField";
import { FieldLabel } from "../../FieldLabel";
import { AddDiscoverableFieldsModal } from "./AddDiscoverableFieldsModal";
import isEmpty from "lodash/isEmpty";

export class DiscoverFieldsSection extends Component {
  constructor(props) {
    super(props);
    const { sections, record } = props; // sections = fields grouping, usually by domain
    console.warn(props);
    let filled = [];
    if (record && !isEmpty(record.custom_fields)) {
      filled = Object.keys(record.custom_fields).map((key) => `custom_fields.${key}`);
    }

    this.state = { sections: sections, tempFields: [], recordFields: filled };
    this.fieldsCfg = this.getFieldsConfig(sections);
    this.sectionsList = sections.map((section) => section.section);
  }

  getFieldsConfig = (sectionCfg) => {
    const cfg = {};
    for (const section of sectionCfg) {
      for (const fieldCfg of section.fieldsConfig) {
        const { field, props, ui_widget, ...otherCfg } = fieldCfg;
        cfg[field] = { ui_widget: ui_widget, section: section, ...props, ...otherCfg };
      }
    }

    return cfg;
  };

  getFieldsWithValues = (sectionFields) => {
    const { tempFields, recordFields } = this.state;
    const filledFields = [];
    for (const field of sectionFields) {
      if (recordFields.includes(field.key) || tempFields.includes(field)) {
        filledFields.push(field);
      }
    }
    return filledFields;
  };

  getSectionOfField = (field) => {
    const { sections } = this.state;
    for (const section of sections) {
      if (section.fields.map((field) => field.key).includes(field.key)) {
        return section.section;
      }
    }
  };

  addFieldCallback = (fields) => {
    const { sections: prevSections, tempFields: prevTempFields } = this.state;

    const sections = [...prevSections];
    for (const field of fields) {
      const sectionToUpdate = this.getSectionOfField(field);
      for (const section of sections) {
        if (section.section === sectionToUpdate) {
          section["fields"] = [...section.fields, field].sort((a, b) =>
            a.key.localeCompare(b.key)
          );
        }
      }
    }
    this.setState({
      sections: [...sections],
      tempFields: [...prevTempFields, ...fields],
    });
  };

  removeFieldCallback = (field) => {
    const { sections: prevSections, tempFields: prevTempFields } = this.state;
    const sections = [...prevSections];
    let tempFields = [...prevTempFields];
    const sectionToUpdate = this.getSectionOfField(field);
    for (const section of sections) {
      if (section.section === sectionToUpdate) {
        section["fields"] = section.fields.filter((n) => field.key !== n.key);
        tempFields = tempFields.filter((n) => field.key !== n.key);
      }
    }
    this.setState({
      sections: [...sections],
      tempFields: [...tempFields],
    });
  };

  render() {
    const { templateLoaders, record } = this.props;
    const { sections, tempFields, recordFields } = this.state;
    const existingFields = [
      ...Object.entries(tempFields).map(([key, value]) => value.key),
      ...recordFields,
    ];
    const tempFieldsPaths = tempFields.map((item) => item.key);

    return (
      <AccordionField
        key="discover-fields"
        includesPaths={tempFieldsPaths}
        label="Domain specific fields"
        active
        id="domain-specific-fields-section"
      >
        {sections.map(({ fields, paths, ...sectionConfig }) => {
          const recordCustomFields = this.getFieldsWithValues(fields);
          if (_isEmpty(recordCustomFields)) {
            return undefined;
          }
          return (
            <div key={sectionConfig.section} className="rel-mb-2">
              <FieldLabel
                htmlFor={sectionConfig.section}
                icon={sectionConfig.icon}
                label={sectionConfig.section}
              />
              <Divider fitted className="rel-mb-1" />
              <div className="rel-ml-1">{recordCustomFields}</div>
            </div>
          );
        })}
        <AddDiscoverableFieldsModal
          fieldPath="custom_fields"
          {...this.fieldsCfg}
          templateLoaders={templateLoaders}
          addFieldCallback={this.addFieldCallback}
          removeFieldCallback={this.removeFieldCallback}
          sections={this.sectionsList}
          record={record}
          existingFields={existingFields}
        />
      </AccordionField>
    );
  }
}

DiscoverFieldsSection.propTypes = {
  templateLoaders: PropTypes.array.isRequired,
  sections: PropTypes.array.isRequired,
  record: PropTypes.object.isRequired,
};
