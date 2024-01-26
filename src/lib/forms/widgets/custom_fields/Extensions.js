// This file is part of Invenio-RDM-Records
// Copyright (C) 2020-2023 CERN.
// Copyright (C) 2020-2022 Northwestern University.
//
// Invenio-RDM-Records is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";
import { ListAndFilterCustomFields } from "./ListAndFilterCustomFields";
import { importWidget } from "../loader";

import { Button, Icon, Modal, Divider } from "semantic-ui-react";

import PropTypes from "prop-types";

export class Extensions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      selectedField: undefined,
      selectedFieldTarget: undefined,
      fields: [],
    };
  }
  handleModalOpen = () => {
    this.setState({ modalOpen: true });
  };

  handleModalClosed = () => {
    this.setState({ modalOpen: false });
  };

  handleSelectField = (e, fieldName, field) => {
    const { selectedFieldTarget: previousSelected } = this.state;
    if (previousSelected) {
      previousSelected.classList.toggle("selected-background");
    }
    const newField = {
      field: fieldName,
      props: { ...field },
      ui_widget: field.ui_widget,
    };
    this.setState({
      selectedField: { ...newField },
      selectedFieldTarget: e.currentTarget,
    });
    e.currentTarget.classList.toggle("selected-background");
  };

  handleAddField = async (withClose = false) => {
    const { selectedField } = this.state;
    const { fieldPath, templateLoaders, addFieldCallback } = this.props;
    const field = await importWidget(templateLoaders, {
      ...selectedField,
      fieldPath: `${fieldPath}.${selectedField.field}`,
    });
    const { fields: prevFields } = this.state;
    this.setState({ fields: [...prevFields, field] });
    if (withClose) {
      this.handleModalClosed();
    }
    this.setState({ selectedField: undefined, selectedFieldTarget: undefined });
    addFieldCallback(field);
  };

  render() {
    const {
      fieldPath, // injected by the custom field loader via the `field` config property
      icon,
      label,
      record,
      templateLoaders,
      addFieldCallback,
      sections,
      ...fieldsList
    } = this.props;
    const { modalOpen, fields } = this.state;

    return (
      <>
        <Divider />
        <Button icon labelPosition="left" onClick={this.handleModalOpen}>
          <Icon name="plus" />
          Add field
        </Button>
        <Modal open={modalOpen}>
          <Modal.Header>Add domain specific fields</Modal.Header>
          <ListAndFilterCustomFields
            fieldPath={fieldPath}
            handleSelectField={this.handleSelectField}
            alreadyAddedFields={fields}
            fieldsList={fieldsList}
            sections={sections}
          />
          <Modal.Actions>
            <Button
              onClick={this.handleModalClosed}
              floated="left"
              icon="cancel"
              labelPosition="left"
              content="Cancel"
            />
            <Button icon labelPosition="left" onClick={this.handleAddField}>
              <Icon name="plus" />
              Add field and continue
            </Button>
            <Button icon labelPosition="left" onClick={() => this.handleAddField(true)}>
              <Icon name="plus" />
              Add field and close
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

Extensions.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  record: PropTypes.object.isRequired,
  icon: PropTypes.string,
  label: PropTypes.string,
  templateLoaders: PropTypes.array.isRequired,
  addFieldCallback: PropTypes.func.isRequired,
  sections: PropTypes.array,
};

Extensions.defaultProps = {
  icon: undefined,
  label: undefined,
  sections: undefined,
};
