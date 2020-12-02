// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _uniqBy from 'lodash/uniqBy';
import _pickBy from 'lodash/pickBy';
import axios from 'axios';
import { Message } from 'semantic-ui-react';
import { SelectField } from './SelectField';

const fetchOptions = () => [
  { title: 'Danish', id: 'dan' },
  { title: 'English', id: 'eng' },
  { title: 'French', id: 'fra' },
  { title: 'German', id: 'deu' },
  { title: 'Greek', id: 'ell' },
  { title: 'Italian', id: 'ita' },
  { title: 'Spanish', id: 'spa' },
];

const serializeSuggestions = (suggestions) =>
  suggestions.map((item) => ({
    text: item.title,
    value: item.id,
    key: item.id,
  }));

export class RemoteSelectField extends Component {
  state = {
    isFetching: false,
    suggestions: [],
    selectedSuggestions: [],
    error: false,
    searchQuery: null,
    open: false,
  };

  onSelectValue = (event, { options, value, ...rest }) => {
    const selectedSuggestions = options.filter((item) =>
      value.includes(item.value)
    );
    this.setState({
      selectedSuggestions: selectedSuggestions,
      searchQuery: null,
      error: false,
    });
  };

  onSearchChange = _debounce(async (e, { searchQuery }) => {
    this.setState({ isFetching: true, searchQuery });
    try {
      const suggestions = await this.fetchSuggestions(searchQuery);
      const serializedSuggestions = this.props.serializeSuggestions(
        suggestions
      );

      this.setState((prevState) => ({
        suggestions: _uniqBy(
          [...prevState.selectedSuggestions, ...serializedSuggestions],
          'value'
        ),
        isFetching: false,
        error: false,
        open: true,
      }));
    } catch (e) {
      this.setState({
        error: true,
        isFetching: false,
      });
    }
  }, this.props.debounceTime);

  fetchSuggestions = (searchQuery) => {
    // TODO: replace when REST api is integrated
    // const resp = await axios.get(this.props.suggestionAPIUrl, { params: { q: searchQuery } });
    // return resp.data.hits.hits

    const response = {
      data: {
        hits: {
          hits: fetchOptions().filter((item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        },
      },
    };
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const random_boolean = Math.random() < 0.5;
        if (random_boolean) {
          resolve(response.data.hits.hits);
        } else {
          reject('Something went wrong');
        }
      }, 100);
    });
  };

  getNoResultsMessage = () => {
    if (this.state.error) {
      return (
        <Message
          negative
          size="mini"
          content={this.props.suggestionsErrorMessage}
        ></Message>
      );
    }
    if (!this.state.searchQuery) {
      return this.props.noQueryMessage;
    }
    return this.props.noResultsMessage;
  };

  onBlur = () => {
    this.setState((prevState) => ({
      open: false,
      error: false,
      searchQuery: null,
      suggestions: [...prevState.selectedSuggestions],
    }));
  };

  onFocus = () => {
    this.setState({ open: true });
  };

  getProps = () => {
    const uiProps = _pickBy(this.props, (value, key) => {
      return !RemoteSelectField.propTypes[key];
    });
    const compProps = _pickBy(this.props, (value, key) => {
      return RemoteSelectField.propTypes[key];
    });
    return { compProps, uiProps };
  };

  render() {
    const { compProps, uiProps } = this.getProps();
    return (
      <SelectField
        {...uiProps}
        fieldPath={compProps.fieldPath}
        options={this.state.suggestions}
        noResultsMessage={this.getNoResultsMessage()}
        search
        lazyLoad
        open={this.state.open}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onSearchChange={this.onSearchChange}
        onChange={({ event, data, formikProps }) => {
          this.onSelectValue(event, data);
          formikProps.form.setFieldValue(compProps.fieldPath, data.value);
        }}
        loading={this.state.isFetching}
      />
    );
  }
}

RemoteSelectField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  suggestionAPIUrl: PropTypes.string.isRequired,
  serializeSuggestions: PropTypes.func,
  debounceTime: PropTypes.number,
  noResultsMessage: PropTypes.string,
  suggestionsErrorMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  noQueryMessage: PropTypes.string,
};

RemoteSelectField.defaultProps = {
  debounceTime: 500,
  serializeSuggestions: serializeSuggestions,
  suggestionsErrorMessage: 'Something went wrong...',
  noQueryMessage: 'Search...',
  noResultsMessage: 'No results found.',
};
