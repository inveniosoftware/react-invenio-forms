// This file is part of React-Invenio-Forms
// Copyright (C) 2026 CERN.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Label } from "semantic-ui-react";
import { humanReadableBytes } from "../utils/humanReadableBytes";

export class FilesList extends Component {
  render() {
    const { files, onFileDelete } = this.props;

    return files?.map((file) => (
      <Label
        key={file.file_id}
        className="no-text-decoration mr-5 mt-5"
        icon="file"
        content={`${file.original_filename} (${humanReadableBytes(
          parseInt(file.size, 10),
          true
        )})`}
        as="a"
        href={file.links.download_html}
        onRemove={
          onFileDelete
            ? (event) => {
                // Stopping the click event from downloading the file.
                event.preventDefault();
                onFileDelete(file);
              }
            : undefined
        }
      />
    ));
  }
}

FilesList.propTypes = {
  files: PropTypes.array,
  onFileDelete: PropTypes.func,
};

FilesList.defaultProps = {
  files: undefined,
  onFileDelete: undefined,
};
