/*
 * SPDX-FileCopyrightText: 2020 CERN.
 * SPDX-FileCopyrightText: 2020-2021 Northwestern University.
 * SPDX-License-Identifier: MIT
 */

import axios from "axios";
import _debounce from "lodash/debounce";
import _isEqual from "lodash/isEqual";
import PropTypes from "prop-types";
import queryString from "query-string";
import { Component } from "react";
import { Message } from "semantic-ui-react";
import { SelectField } from "./SelectField";
import { withCancel } from "../api";
import { mergeOptions, createOption } from "../utils";

const DEFAULT_SUGGESTION_SIZE = 20;
const EMPTY_INITIAL_SUGGESTIONS = [];
const EMPTY_SUGGESTION_API_QUERY_PARAMS = {};
const EMPTY_SUGGESTION_API_HEADERS = {};
const PRE_SEARCH_CHANGE_IDENTITY = (x) => x;

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
      debounceTime = 500,
      initialSuggestions = EMPTY_INITIAL_SUGGESTIONS,
      serializeSuggestions: serialize = serializeSuggestions,
    } = props;
    const serializedInitialSuggestions = initialSuggestions
      ? serialize(initialSuggestions)
      : [];
    this.state = {
      isFetching: false,
      suggestions: serializedInitialSuggestions,
      addedSuggestions: [],
      selectedSuggestions: serializedInitialSuggestions,
      error: false,
      searchQuery: null,
      open: false,
    };
    this.onSearchChange = _debounce(async (e, { searchQuery }) => {
      this.cancellableAction && this.cancellableAction.cancel();
      await this.executeSearch(searchQuery);
    }, debounceTime);
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
        addedSuggestions: mergeOptions(prevState.addedSuggestions, [
          selectedSuggestion,
        ]),
        suggestions: mergeOptions(prevState.suggestions, [selectedSuggestion]),
        searchQuery: null,
      }),
      () => callbackFunc(newSelectedSuggestions)
    );
    await this.searchIfNoSuggestions(newSelectedSuggestions); // Reset search query to empty string after addition
  };

  executeSearch = async (searchQuery) => {
    const {
      preSearchChange = PRE_SEARCH_CHANGE_IDENTITY,
      serializeSuggestions: serialize = serializeSuggestions,
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

      const serializedSuggestions = serialize(suggestions);
      this.setState((prevState) => ({
        suggestions: mergeOptions(
          mergeOptions(prevState.selectedSuggestions, prevState.addedSuggestions),
          serializedSuggestions
        ),
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
      suggestionAPIQueryParams = EMPTY_SUGGESTION_API_QUERY_PARAMS,
      suggestionAPIHeaders = EMPTY_SUGGESTION_API_HEADERS,
      searchQueryParamName = "suggest",
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
      loadingMessage = "Loading...",
      suggestionsErrorMessage = "Something went wrong...",
      noQueryMessage = "Search...",
      noResultsMessage = "No results found.",
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
      suggestionAPIQueryParams = EMPTY_SUGGESTION_API_QUERY_PARAMS,
      serializeSuggestions: serialize = serializeSuggestions,
      serializeAddedValue,
      suggestionAPIHeaders = EMPTY_SUGGESTION_API_HEADERS,
      debounceTime = 500,
      searchQueryParamName = "suggest",
      noResultsMessage = "No results found.",
      loadingMessage = "Loading...",
      suggestionsErrorMessage = "Something went wrong...",
      noQueryMessage = "Search...",
      initialSuggestions = EMPTY_INITIAL_SUGGESTIONS,
      preSearchChange = PRE_SEARCH_CHANGE_IDENTITY,
      onValueChange,
      search = true,
      isFocused = false,
      searchOnFocus,
      ...uiProps
    } = this.props;
    const compProps = {
      fieldPath,
      suggestionAPIUrl,
      suggestionAPIQueryParams,
      suggestionAPIHeaders,
      serializeSuggestions: serialize,
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
