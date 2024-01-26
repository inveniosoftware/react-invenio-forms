// This file is part of Invenio-RDM-Records
// Copyright (C) 2020-2023 CERN.
// Copyright (C) 2020-2022 Northwestern University.
//
// Invenio-RDM-Records is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";
import { importWidget } from "../loader";

import {
  Button,
  Icon,
  Modal,
  Item,
  Divider,
  Label,
  Grid,
  Segment,
} from "semantic-ui-react";

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
    addFieldCallback(field);
    console.log(`${fieldPath}.${selectedField.field}`);
  };

  render() {
    const {
      fieldPath, // injected by the custom field loader via the `field` config property
      icon,
      label,
      record,
      templateLoaders,
      addFieldCallback,
      ...fieldsList
    } = this.props;
    const { modalOpen, fields } = this.state;
    console.warn(fieldsList, "---------------%%%%%%%%%%%%%%%%%%");

    return (
      <>
        <Divider />
        <Button icon labelPosition="left" onClick={this.handleModalOpen}>
          <Icon name="plus" />
          Add field
        </Button>
        <Modal open={modalOpen}>
          <Modal.Header>Add domain specific fields</Modal.Header>
          <Segment as={Modal.Content} attached="bottom ml-0">
            test
          </Segment>
          <Modal.Content scrolling>
            <Item.Group divided relaxed>
              {Object.entries(fieldsList).map(([key, value]) => {
                const names = key.split(":");
                const isDisabled = fields
                  .map((field) => field.key)
                  .includes(`${fieldPath}.${key}`);

                return (
                  <Item
                    key={key}
                    className={
                      isDisabled ? "pr-10 pl-10 disabled" : "clickable pr-10 pl-10"
                    }
                    fieldName={key}
                    field={fieldsList[key]}
                    onClick={(e) =>
                      !isDisabled ? this.handleSelectField(e, key, value) : {}
                    }
                  >
                    <Item.Content>
                      <Item.Header className={isDisabled ? "text-muted mb-5" : "mb-5"}>
                        {value.label}
                      </Item.Header>
                      <Item.Description>
                        <Grid>
                          <Grid.Column width={12}>{value.note}</Grid.Column>
                        </Grid>
                      </Item.Description>
                      <Item.Extra>
                        <Label>
                          <Icon name={value.section.icon} />
                          {value.section.section}: {names[0]}
                        </Label>
                        {value.multiple_values === true && (
                          <Label basic>
                            <Icon name="list ol" /> Multiple value field
                          </Label>
                        )}
                        {value.type === "text" && (
                          <Label basic>
                            <Icon name="text cursor" /> Text field
                          </Label>
                        )}
                      </Item.Extra>
                    </Item.Content>
                  </Item>
                );
              })}
            </Item.Group>
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={this.handleModalClosed}
              floated="left"
              icon="cancel"
              labelPosition="left"
              content="Cancel"
            />
            <Button icon labelPosition="left">
              <Icon name="plus" />
              Add field and continue
            </Button>
            <Button onClick={() => this.handleAddField(true)}>
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
};

Extensions.defaultProps = {
  icon: undefined,
  label: undefined,
};
