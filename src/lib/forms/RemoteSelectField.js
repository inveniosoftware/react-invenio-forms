// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import axios from "axios";
import _debounce from "lodash/debounce";
import _isEqual from "lodash/isEqual";
import PropTypes from "prop-types";
import queryString from "query-string";
import React, { Component } from "react";
import { Message } from "semantic-ui-react";
import { SelectField } from "./SelectField";
import { withCancel } from "../api";
import { mergeOptions, createOption } from "../utils";

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
    const {
      initialSuggestions: _initialSuggestions = [],
      serializeSuggestions: _serializeSuggestions = serializeSuggestions,
    } = props;
    const initialSuggestions = _initialSuggestions
      ? _serializeSuggestions(_initialSuggestions)
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

  componentWillUnmount() {
    this.cancellableAction && this.cancellableAction.cancel();
  }

  onSelectValue = async (event, { options, value, ...otherData }, callbackFunc) => {
    const { multiple = false } = this.props;
    const newSelectedSuggestions = options.filter((item) => {
      if (multiple) {
        // "value" is an array so check if it includes the option's value
        return value.includes(item.value);
      } else {
        // "value" is a string so we just compare directly
        return item.value === value;
      }
    });

    this.setState(
      {
        selectedSuggestions: newSelectedSuggestions,
        searchQuery: null,
        error: false,
        open: !!multiple,
      },
      () => callbackFunc(newSelectedSuggestions)
    );
    await this.searchIfNoSuggestions(newSelectedSuggestions); // Reset search query to empty string after selection
  };

  handleAddition = async (e, { value }, callbackFunc) => {
    const { serializeAddedValue } = this.props;
    const { selectedSuggestions } = this.state;
    const selectedSuggestion = serializeAddedValue
      ? serializeAddedValue(value)
      : { ...createOption(value), name: value };

    const newSelectedSuggestions = [...selectedSuggestions, selectedSuggestion];

    this.setState(
      (prevState) => ({
        selectedSuggestions: newSelectedSuggestions,
        suggestions: mergeOptions(prevState.suggestions, newSelectedSuggestions),
        searchQuery: null,
      }),
      () => callbackFunc(newSelectedSuggestions)
    );
    await this.searchIfNoSuggestions(newSelectedSuggestions); // Reset search query to empty string after addition
  };

  onSearchChange = _debounce(
    async (e, { searchQuery }) => {
      this.cancellableAction && this.cancellableAction.cancel();
      await this.executeSearch(searchQuery);
    },
    // eslint-disable-next-line react/destructuring-assignment
    this.props.debounceTime ?? 500
  ); // can't destructure as prop variable is used outside the inner function

  executeSearch = async (searchQuery) => {
    const {
      preSearchChange = (x) => x,
      serializeSuggestions: _serializeSuggestions = serializeSuggestions,
    } = this.props;
    const query = preSearchChange(searchQuery);
    // If there is no query change, then display prevState suggestions
    const { searchQuery: prevSearchQuery } = this.state;
    if (prevSearchQuery === query) {
      return;
    }
    this.setState({ isFetching: true, searchQuery: query });
    try {
      const suggestions = await this.fetchSuggestions(query);

      const serializedSuggestions = _serializeSuggestions(suggestions);
      this.setState((prevState) => ({
        suggestions: mergeOptions(prevState.selectedSuggestions, serializedSuggestions),
        isFetching: false,
        error: false,
        open: true,
      }));
    } catch (e) {
      console.error(e);
      this.setState({
        error: true,
        isFetching: false,
      });
    }
  };

  searchIfNoSuggestions = async (newSelectedSuggestions) => {
    // If all the suggestions from the search query are selected, fetch all suggestions via API
    const { suggestions } = this.state;
    if (_isEqual(newSelectedSuggestions, suggestions)) {
      await this.executeSearch("");
    }
  };

  fetchSuggestions = async (searchQuery) => {
    const {
      suggestionAPIUrl,
      suggestionAPIQueryParams,
      suggestionAPIHeaders,
      searchQueryParamName,
    } = this.props;

    this.cancellableAction = withCancel(
      axios.get(suggestionAPIUrl, {
        params: {
          [searchQueryParamName]: searchQuery,
          size: DEFAULT_SUGGESTION_SIZE,
          ...suggestionAPIQueryParams,
        },
        headers: suggestionAPIHeaders,
        // There is a bug in axios that prevents brackets from being encoded,
        // remove the paramsSerializer when fixed.
        // https://github.com/axios/axios/issues/3316
        paramsSerializer: (params) =>
          queryString.stringify(params, { arrayFormat: "repeat" }),
      })
    );

    try {
      const response = await this.cancellableAction.promise;
      return response?.data?.hits?.hits;
    } catch (e) {
      console.error(e);
    }
  };

  getNoResultsMessage = () => {
    const {
      loadingMessage,
      suggestionsErrorMessage,
      noQueryMessage,
      noResultsMessage,
    } = this.props;
    const { isFetching, error, searchQuery } = this.state;
    if (isFetching) {
      return loadingMessage;
    }
    if (error) {
      return <Message negative size="mini" content={suggestionsErrorMessage} />;
    }
    if (!searchQuery) {
      return noQueryMessage;
    }
    return noResultsMessage;
  };

  onClose = () => {
    this.setState({ open: false });
  };

  onBlur = () => {
    const { searchOnFocus = false } = this.props;
    this.setState((prevState) => ({
      open: false,
      error: false,
      searchQuery: searchOnFocus ? prevState.searchQuery : null,
      suggestions: searchOnFocus
        ? prevState.suggestions
        : prevState.selectedSuggestions,
    }));
  };

  onFocus = async () => {
    this.setState({ open: true });
    const { searchOnFocus = false } = this.props;
    if (searchOnFocus) {
      const { searchQuery } = this.state;
      await this.executeSearch(searchQuery || "");
    }
  };

  getProps = () => {
    const {
      fieldPath,
      suggestionAPIUrl,
      suggestionAPIQueryParams = {},
      serializeSuggestions: _serializeSuggestions = serializeSuggestions,
      serializeAddedValue,
      suggestionAPIHeaders = {},
      debounceTime = 500,
      searchQueryParamName = "suggest",
      noResultsMessage = "No results found.",
      loadingMessage = "Loading...",
      suggestionsErrorMessage = "Something went wrong...",
      noQueryMessage = "Search...",
      initialSuggestions = [],
      preSearchChange = (x) => x,
      onValueChange,
      search = true,
      isFocused = false,
      multiple = false,
      searchOnFocus = false,
      ...uiProps
    } = this.props;
    const compProps = {
      fieldPath,
      suggestionAPIUrl,
      suggestionAPIQueryParams,
      suggestionAPIHeaders,
      serializeSuggestions: _serializeSuggestions,
      serializeAddedValue,
      debounceTime,
      searchQueryParamName,
      noResultsMessage,
      loadingMessage,
      suggestionsErrorMessage,
      noQueryMessage,
      initialSuggestions,
      preSearchChange,
      onValueChange,
      search,
      isFocused,
    };
    return { compProps, uiProps };
  };

  render() {
    const { compProps, uiProps } = this.getProps();
    const { error, suggestions, open, isFetching } = this.state;
    return (
      <SelectField
        {...uiProps}
        allowAdditions={error ? false : uiProps.allowAdditions}
        fieldPath={compProps.fieldPath}
        options={suggestions}
        noResultsMessage={this.getNoResultsMessage()}
        search={compProps.search}
        searchInput={{
          id: compProps.fieldPath,
          autoFocus: compProps.isFocused,
        }}
        lazyLoad
        open={open}
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
        loading={isFetching}
        className="invenio-remote-select-field"
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
  serializeAddedValue: PropTypes.func,
  initialSuggestions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.object,
  ]),
  debounceTime: PropTypes.number,
  noResultsMessage: PropTypes.string,
  loadingMessage: PropTypes.string,
  suggestionsErrorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  noQueryMessage: PropTypes.string,
  searchQueryParamName: PropTypes.string,
  preSearchChange: PropTypes.func, // Takes a string and returns a string
  onValueChange: PropTypes.func, // Takes the SUI hanf and updated selectedSuggestions
  search: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  multiple: PropTypes.bool,
  isFocused: PropTypes.bool,
  searchOnFocus: PropTypes.bool,
};
