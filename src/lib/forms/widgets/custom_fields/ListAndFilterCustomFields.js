import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  Grid,
  Icon,
  Input,
  Item,
  Label,
  List,
  Modal,
  Segment,
} from "semantic-ui-react";

export class ListAndFilterCustomFields extends Component {
  constructor(props) {
    super(props);
    const { fieldsList } = props;
    this.state = { filteredFieldsList: fieldsList };
  }

  resetFilter = () => {
    const { fieldsList } = this.props;
    this.setState({ filteredFieldsList: fieldsList });
  };
  handleSearch = (e, { value }) => {
    const { fieldsList } = this.props;
    if (value) {
      const filteredResults = Object.fromEntries(
        Object.entries(fieldsList).filter(([key, val]) => {
          return val.label.toLowerCase().includes(value.toLowerCase());
        })
      );

      this.setState({ filteredFieldsList: filteredResults });
    } else {
      this.resetFilter();
    }
  };

  handleDomainFilter = (e, { value }) => {
    const { fieldsList } = this.props;
    if (value) {
      const filteredResults = Object.fromEntries(
        Object.entries(fieldsList).filter(([key, val]) => val.section.section === value)
      );

      this.setState({ filteredFieldsList: filteredResults });
    } else {
      this.resetFilter();
    }
  };

  render() {
    const { filteredFieldsList } = this.state;
    const { alreadyAddedFields, fieldPath, handleSelectField, sections } = this.props;
    const dropdownOptions = sections.map((section) => ({
      key: section,
      text: section,
      value: section,
    }));

    return (
      <>
        <Segment as={Modal.Content} attached="bottom ml-0">
          <Grid>
            <Grid.Column width={10}>
              <Input
                fluid
                icon="search"
                placeholder="Search..."
                onChange={this.handleSearch}
              />
            </Grid.Column>
            <Grid.Column width={6}>
              <span className="flex align-items-center">
                in:{" "}
                <Dropdown
                  className="ml-5"
                  fluid
                  inline
                  clearable
                  selection
                  placeholder="All domains"
                  options={dropdownOptions}
                  onChange={this.handleDomainFilter}
                />
              </span>
            </Grid.Column>
          </Grid>
        </Segment>
        <Modal.Content scrolling>
          <Item.Group divided relaxed>
            {Object.entries(filteredFieldsList).map(([key, value]) => {
              const names = key.split(":");

              const isDisabled = alreadyAddedFields
                .map((field) => field.key)
                .includes(`${fieldPath}.${key}`);

              return (
                <Item
                  key={key}
                  className={
                    isDisabled ? "pr-10 pl-10 disabled" : "clickable pr-10 pl-10"
                  }
                  fieldName={key}
                  field={filteredFieldsList[key]}
                  onClick={(e) => (!isDisabled ? handleSelectField(e, key, value) : {})}
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
            })}{" "}
          </Item.Group>
        </Modal.Content>
      </>
    );
  }
}

ListAndFilterCustomFields.propTypes = {
  alreadyAddedFields: PropTypes.array.isRequired,
  fieldsList: PropTypes.array.isRequired,
  fieldPath: PropTypes.string.isRequired,
  handleSelectField: PropTypes.func.isRequired,
  sections: PropTypes.array,
};

ListAndFilterCustomFields.defaultProps = {
  sections: undefined,
};
