import React, { Component } from 'react';

import * as Yup from 'yup';
import { Header, Message, Container } from 'semantic-ui-react';

import { TextField, BaseForm } from '../lib/core';

const CurrentRecord = (props) => (
  <Message>
    <Message.Header>Submitted record</Message.Header>
    <pre>{JSON.stringify(props.record)}</pre>
  </Message>
);

class RecordPreviewer extends Component {
  render() {
    return <CurrentRecord record={this.props.record} />;
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: {},
    };
  }

  initialValues = {
    title: '',
    year: '',
  };

  MyFormSchema = Yup.object().shape({
    title: Yup.string().min(10).required(),
  });

  validate = (values) => {
    const errors = {};

    if (!values.title) {
      errors.title = 'Required';
    }
    return errors;
  };

  onSubmit = (values) => {
    this.setState({ record: values });
  };

  onError = (error) => {
    console.log('Server Error', error);
  };

  render() {
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
          <RecordPreviewer record={this.state.record} />
        </BaseForm>
      </Container>
    );
  }
}

export default App;
