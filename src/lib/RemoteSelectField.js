// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _uniqBy from 'lodash/uniqBy';
import axios from 'axios';
import { Message } from 'semantic-ui-react';
import { SelectField } from './SelectField';

const DEFAULT_SUGGESTION_SIZE = 20;

const serializeSuggestions = (suggestions) =>
  suggestions.map((item) => ({
    text: item.title,
    value: item.id,
    key: item.id,
  }));

export class RemoteSelectField extends Component {
  constructor(props) {
    super(props);
    const initialSuggestions = props.initialSuggestions
      ? props.serializeSuggestions(props.initialSuggestions)
      : [];
    this.state = {
      isFetching: false,
      suggestions: initialSuggestions,
      selectedSuggestions: initialSuggestions,
      error: false,
      searchQuery: null,
      open: false,
    };
  }

  onSelectValue = (event, { options, value }, callbackFunc) => {
    const selectedSuggestions = options.filter((item) =>
      value.includes(item.value)
    );
    this.setState(
      {
        selectedSuggestions: selectedSuggestions,
        searchQuery: null,
        error: false,
        open: this.props.multiple ? true : false,
      },
      () => callbackFunc(this.state.selectedSuggestions)
    );
  };

  handleAddition = (e, { value }, callbackFunc) => {
    const selectedSuggestions = [
      ...this.state.selectedSuggestions,
      { text: value, value, key: value, name: value },
    ];
    this.setState(
      (prevState) => ({
        selectedSuggestions: selectedSuggestions,
        suggestions: _uniqBy(
          [...prevState.suggestions, ...selectedSuggestions],
          'value'
        ),
      }),
      () => callbackFunc(this.state.selectedSuggestions)
    );
  };

  onSearchChange = _debounce(async (e, { searchQuery }) => {
    const query = this.props.preSearchChange(searchQuery);
    this.setState({ isFetching: true, searchQuery: query });
    try {
      const suggestions = await this.fetchSuggestions(query);
      const serializedSuggestions =
        this.props.serializeSuggestions(suggestions);
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

  fetchSuggestions = async (searchQuery) => {
    const {
      fetchedOptions,
      suggestionAPIUrl,
      suggestionAPIQueryParams,
      suggestionAPIHeaders,
    } = this.props;

    // TODO: remove this part once backend will be implemented
    // for Subjects and Affiliations components
    if (fetchedOptions) {
      const response = {
        data: {
          hits: {
            hits: fetchedOptions.filter((item) =>
              item.title.toLowerCase().includes(searchQuery.toLowerCase())
            ),
          },
        },
      };
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // const random_boolean = Math.random() < 0.5;
          // if (random_boolean) {
          //   resolve(response.data.hits.hits);
          // } else {
          //   reject('Something went wrong');
          // }
          resolve(response.data.hits.hits);
        }, 100);
      });
    }
    return axios
      .get(suggestionAPIUrl, {
        params: {
          suggest: searchQuery,
          size: DEFAULT_SUGGESTION_SIZE,
          ...suggestionAPIQueryParams,
        },
        headers: suggestionAPIHeaders,
      })
      .then((resp) => resp?.data?.hits?.hits);
  };

  getNoResultsMessage = () => {
    if (this.state.isFetching) {
      return this.props.loadingMessage;
    }
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

  onClose = () => {
    this.setState({ open: false });
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
    const {
      fieldPath,
      suggestionAPIUrl,
      suggestionAPIQueryParams,
      serializeSuggestions,
      suggestionAPIHeaders,
      debounceTime,
      noResultsMessage,
      loadingMessage,
      suggestionsErrorMessage,
      noQueryMessage,
      fetchedOptions,
      initialSuggestions,
      preSearchChange,
      onValueChange,
      ...uiProps
    } = this.props;
    const compProps = {
      fieldPath,
      suggestionAPIUrl,
      suggestionAPIQueryParams,
      suggestionAPIHeaders,
      serializeSuggestions,
      debounceTime,
      noResultsMessage,
      loadingMessage,
      suggestionsErrorMessage,
      noQueryMessage,
      fetchedOptions,
      initialSuggestions,
      preSearchChange,
      onValueChange,
    };
    return { compProps, uiProps };
  };

  render() {
    const { compProps, uiProps } = this.getProps();
    return (
      <SelectField
        {...uiProps}
        allowAdditions={this.state.error ? false : uiProps.allowAdditions}
        fieldPath={compProps.fieldPath}
        options={this.state.suggestions}
        noResultsMessage={this.getNoResultsMessage()}
        search
        lazyLoad
        open={this.state.open}
        onClose={this.onClose}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onSearchChange={this.onSearchChange}
        onAddItem={({ event, data, formikProps }) => {
          this.handleAddition(event, data, (selectedSuggestions) => {
            if (compProps.onValueChange) {
              compProps.onValueChange(
                { event, data, formikProps },
                selectedSuggestions
              );
            }
          });
        }}
        onChange={({ event, data, formikProps }) => {
          this.onSelectValue(event, data, (selectedSuggestions) => {
            if (compProps.onValueChange) {
              compProps.onValueChange(
                { event, data, formikProps },
                selectedSuggestions
              );
            } else {
              formikProps.form.setFieldValue(compProps.fieldPath, data.value);
            }
          });
        }}
        loading={this.state.isFetching}
      />
    );
  }
}

RemoteSelectField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  suggestionAPIUrl: PropTypes.string.isRequired,
  suggestionAPIQueryParams: PropTypes.object,
  suggestionAPIHeaders: PropTypes.object,
  serializeSuggestions: PropTypes.func,
  initialSuggestions: PropTypes.arrayOf(PropTypes.object),
  debounceTime: PropTypes.number,
  noResultsMessage: PropTypes.string,
  loadingMessage: PropTypes.string,
  suggestionsErrorMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  noQueryMessage: PropTypes.string,
  fetchedOptions: PropTypes.array, //TODO: remove this after vocabularies implementation
  preSearchChange: PropTypes.func, // Takes a string and returns a string
  onValueChange: PropTypes.func, // Takes the SUI hanf and updated selectedSuggestions
};

RemoteSelectField.defaultProps = {
  debounceTime: 500,
  suggestionAPIQueryParams: {},
  suggestionAPIHeaders: {},
  serializeSuggestions: serializeSuggestions,
  suggestionsErrorMessage: 'Something went wrong...',
  noQueryMessage: 'Search...',
  noResultsMessage: 'No results found.',
  loadingMessage: 'Loading...',
  preSearchChange: (x) => x,
};
