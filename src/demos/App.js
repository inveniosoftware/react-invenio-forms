// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from "react";

import PropTypes from "prop-types";
import * as Yup from "yup";
import { Header, Message, Container } from "semantic-ui-react";

import { TextField, BaseForm } from "../lib/forms";

const CurrentRecord = (props) => {
  const { record } = props;
  return (
    <Message>
      <Message.Header>Submitted record</Message.Header>
      <pre>{JSON.stringify(record)}</pre>
    </Message>
  );
};

CurrentRecord.propTypes = {
  record: PropTypes.object,
};

CurrentRecord.defaultProps = {
  record: undefined,
};

class RecordPreviewer extends Component {
  render() {
    const { record } = this.props;
    return <CurrentRecord record={record} />;
  }
}

RecordPreviewer.propTypes = {
  record: PropTypes.object,
};

RecordPreviewer.defaultProps = {
  record: undefined,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: {},
    };
  }

  initialValues = {
    title: "",
    year: "",
  };

  MyFormSchema = Yup.object().shape({
    title: Yup.string().min(10).required(),
  });

  validate = (values) => {
    const errors = {};

    if (!values.title) {
      errors.title = "Required";
    }
    return errors;
  };

  onSubmit = (values) => {
    this.setState({ record: values });
  };

  onError = (error) => {
    console.log("Server Error", error);
  };

  render() {
    const { record } = this.state;
    return (
      <Container>
        <BaseForm
          onSubmit={this.onSubmit}
          onError={this.onError}
          formik={{
            initialValues: this.initialValues,
            validationSchema: this.MyFormSchema,
            // Custom validation function
            // validate: this.validate,
          }}
        >
          <Header textAlign="center">My Form</Header>
          <TextField
            fieldPath="title"
            placeholder="Enter a new title"
            label="Title"
            fluid
            required
          />
          <RecordPreviewer record={record} />
        </BaseForm>
      </Container>
    );
  }
}

export default App;
