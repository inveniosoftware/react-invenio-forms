import _isEmpty from "lodash/isEmpty";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Divider } from "semantic-ui-react";
import { AccordionField } from "../../AccordionField";
import { FieldLabel } from "../../FieldLabel";
import { Extensions } from "./Extensions";

export class ComposeFields extends Component {
  constructor(props) {
    super(props);
    const { composeSections, record } = props;
    const filled = Object.keys(record.custom_fields).map(
      (key) => `custom_fields.${key}`
    );
    this.state = { sections: composeSections, tempFields: [], recordFields: filled };
    this.fieldsCfg = this.getFieldsConfig(composeSections);
    this.sectionsList = composeSections.map((section) => section.section);
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
    const { record } = this.props;
    const { tempFields, recordFields } = this.state;
    const filledFields = [];
    if (!record.custom_fields) {
      return [];
    }
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

  render() {
    const { templateLoaders, record } = this.props;
    const { sections, tempFields, recordFields } = this.state;
    const existingFields = [
      ...Object.entries(tempFields).map(([key, value]) => value.key),
      ...recordFields,
    ];

    return (
      <AccordionField key="compose fields" label="Domain specific fields" active>
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
        <Extensions
          fieldPath="custom_fields"
          {...this.fieldsCfg}
          templateLoaders={templateLoaders}
          addFieldCallback={this.addFieldCallback}
          sections={this.sectionsList}
          record={record}
          existingFields={existingFields}
        />
      </AccordionField>
    );
  }
}

ComposeFields.propTypes = {
  templateLoaders: PropTypes.array.isRequired,
  composeSections: PropTypes.array.isRequired,
  record: PropTypes.object.isRequired,
};
