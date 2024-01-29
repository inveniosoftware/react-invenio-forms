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
    const { existingFields } = props;
    this.state = {
      modalOpen: false,
      selectedField: undefined,
      selectedFieldTarget: undefined,
      addFields: [],
      existingFields: [...existingFields],
      loading: false,
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
    e.currentTarget.classList.toggle("selected-background");
    const newField = {
      field: fieldName,
      props: { ...field },
      ui_widget: field.ui_widget,
    };
    this.setState({
      selectedField: { ...newField },
      selectedFieldTarget: e.currentTarget,
    });
  };

  handleAddField = async (withClose = false) => {
    const {
      selectedField,
      addFields: prevFields,
      selectedFieldTarget,
      existingFields: prevExisting,
    } = this.state;
    const { fieldPath, templateLoaders, addFieldCallback } = this.props;
    this.setState({ loading: true });
    const field = await importWidget(templateLoaders, {
      ...selectedField,
      fieldPath: `${fieldPath}.${selectedField.field}`,
    });

    const performCallback = (selectedFieldTarget) => {
      const { addFields } = this.state;

      if (withClose) {
        addFieldCallback(addFields);
        this.setState({ addFields: [], existingFields: [] });
        this.handleModalClosed();
      }
    };
    selectedFieldTarget.classList.toggle("selected-background");
    this.setState(
      {
        addFields: [...prevFields, field],
        existingFields: [...prevExisting, field.key],
        selectedField: undefined,
        selectedFieldTarget: undefined,
        loading: false,
      },
      () => performCallback(selectedFieldTarget)
    );
  };

  handleCancel = () => {
    const { addFields } = this.state;
    const { addFieldCallback } = this.props;
    addFieldCallback(addFields);
    this.setState({ addFields: [] });
    this.handleModalClosed();
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
      existingFields: selected,
      ...fieldsList
    } = this.props;
    const { modalOpen, existingFields, loading } = this.state;
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
            alreadyAddedFields={existingFields}
            fieldsList={fieldsList}
            sections={sections}
          />
          <Modal.Actions>
            <Button
              onClick={this.handleCancel}
              floated="left"
              icon="cancel"
              labelPosition="left"
              content="Cancel"
            />
            <Button
              icon
              labelPosition="left"
              onClick={() => this.handleAddField(false)}
              disabled={loading}
              loading={loading}
            >
              <Icon name="plus" />
              Add field and continue
            </Button>
            <Button
              icon
              labelPosition="left"
              onClick={() => this.handleAddField(true)}
              disabled={loading}
              loading={loading}
            >
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
  existingFields: PropTypes.array.isRequired,
};

Extensions.defaultProps = {
  icon: undefined,
  label: undefined,
  sections: undefined,
};
