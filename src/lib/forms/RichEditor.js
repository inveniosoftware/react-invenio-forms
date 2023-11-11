// This file is part of React-Invenio-Forms
// Copyright (C) 2022 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React, { Component } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "tinymce/tinymce";
import "tinymce/models/dom/model";
import "tinymce/themes/silver";
import "tinymce/icons/default";
import "tinymce/plugins/table";
import "tinymce/plugins/autoresize";
import "tinymce/plugins/codesample";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import PropTypes from "prop-types";

export class RichEditor extends Component {
  render() {
    const { id, value, disabled, minHeight, onBlur, onChange, onFocus, editorConfig } =
      this.props;
    const config = editorConfig || {
      branding: false,
      menubar: false,
      statusbar: false,
      min_height: minHeight,
      content_style: "body { font-size: 14px; }",
      plugins: ["codesample", "link", "lists", "table", "autoresize"],
      toolbar:
        "blocks | bold italic link codesample blockquote table | bullist numlist | outdent indent | undo redo",
      autoresize_bottom_margin: 20,
      block_formats: "Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3",
      table_advtab: false,
    };

    return (
      <Editor
        initialValue={value}
        init={config}
        id={id}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    );
  }
}

RichEditor.propTypes = {
  value: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  minHeight: PropTypes.number,
  editorConfig: PropTypes.object,
};

RichEditor.defaultProps = {
  minHeight: 250,
  value: "",
  id: undefined,
  disabled: undefined,
  onChange: undefined,
  onBlur: undefined,
  onFocus: undefined,
  editorConfig: undefined,
};
