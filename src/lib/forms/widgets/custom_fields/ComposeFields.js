import React, { Component } from "react";
import PropTypes from "prop-types";
import { Divider } from "semantic-ui-react";
import { AccordionField } from "../../AccordionField";
import { FieldLabel } from "../../FieldLabel";
import { Extensions } from "./Extensions";

export class ComposeFields extends Component {
  constructor(props) {
    super(props);
    const { composeSections } = this.props;

    this.state = { sections: composeSections, tempFields: [] };
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
    const { tempFields } = this.state;
    const filledFields = [];
    for (const field of sectionFields) {
      if (
        Object.keys(record.custom_fields).includes(
          field.key.replace("custom_fields.", "")
        ) ||
        tempFields.includes(field)
      ) {
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

  addFieldCallback = (field) => {
    const { sections: prevSections, tempFields: prevTempFields } = this.state;
    const sections = [...prevSections];
    const sectionToUpdate = this.getSectionOfField(field);
    for (const section of sections) {
      if (section.section === sectionToUpdate) {
        section["fields"] = [...section.fields, field];
      }
    }
    this.setState({ sections: [...sections], tempFields: [...prevTempFields, field] });
  };

  render() {
    const { templateLoaders, record } = this.props;
    const { sections } = this.state;

    const fields = this.getFieldsConfig(sections);
    return (
      <AccordionField key="compose fields" label="Domain specific fields" active>
        {sections.map(({ fields, paths, ...sectionConfig }) => (
          <div key={sectionConfig.section} className="rel-mb-2">
            <FieldLabel
              htmlFor={sectionConfig.section}
              icon={sectionConfig.icon}
              label={sectionConfig.section}
            />
            <Divider fitted className="rel-mb-1" />
            <div className="rel-ml-1">{this.getFieldsWithValues(fields)}</div>
          </div>
        ))}
        <Extensions
          fieldPath="custom_fields"
          {...fields}
          templateLoaders={templateLoaders}
          addFieldCallback={this.addFieldCallback}
          record={record}
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
