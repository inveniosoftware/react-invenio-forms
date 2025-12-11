// This file is part of React-Invenio-Forms
// Copyright (C) 2022 CERN.
// Copyright (C) 2020 Northwestern University.
// Copyright (C) 2024 KTH Royal Institute of Technology.
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
import "tinymce/plugins/code";
import "tinymce/plugins/codesample";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/preview";
import PropTypes from "prop-types";

// Make content inside the editor look identical to how we will render it across the site.
// TinyMCE runs within an iframe, so we cannot style it with page-wide CSS styles as normal.
//
// TinyMCE overrides blockquotes with custom styles, so we need to use !important to override
// the overrides in a consistent and reliable way.
// https://github.com/tinymce/tinymce-dist/blob/8d7491f2ee341c201b68cc7c3701d54703edd474/skins/content/tinymce-5/content.css#L61-L70
const editorContentStyle = (disabled) => `
body {
  font-size: 14px;
  ${disabled ? "opacity: 0.5; " : ""}
}

blockquote  {
  margin-left: 0.5rem !important;
  padding-left: 1rem !important;
  color: #757575;
  border-left: 4px solid #C5C5C5 !important;
}

blockquote > blockquote {
  margin-left: 0 !important;
}
`;

export class RichEditor extends Component {
  render() {
    const {
      id,
      initialValue,
      disabled,
      minHeight,
      onBlur,
      onChange,
      onFocus,
      editorConfig,
      inputValue,
      onEditorChange,
      onInit,
    } = this.props;
    const config = {
      branding: false,
      menubar: false,
      statusbar: false,
      min_height: minHeight,
      content_style: editorContentStyle(disabled),
      plugins: [
        "autoresize",
        "code",
        "codesample",
        "image",
        "link",
        "lists",
        "table",
        "wordcount",
        "preview",
      ],
      contextmenu: false,
      toolbar:
        "blocks | bold italic link codesample blockquote image table | bullist numlist | outdent indent | wordcount | undo redo | code | custom_preview",
      autoresize_bottom_margin: 20,
      block_formats: "Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3",
      table_advtab: false,
      convert_urls: false,
      setup: (editor) => {
        editor.ui.registry.addButton("custom_preview", {
          text: "√x",
          tooltip: "Preview math equations",
          context: "any",
          onAction: () => {
            editor.execCommand("mcePreview");
            const dialog = document.querySelector(".tox-dialog");
            if (dialog) {
              const iframe = dialog.querySelector("iframe");
              // Handle iframe load to render MathJax by passing the iframe document body to MathJax.typesetPromise
              iframe.onload = () => {
                window.MathJax?.typesetPromise([iframe.contentDocument.body]);
              };
            }
          },
        });
      },
      ...editorConfig,
    };

    return (
      <Editor
        initialValue={initialValue}
        value={inputValue}
        init={config}
        id={id}
        disabled={disabled}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={onChange}
        onEditorChange={onEditorChange}
        onInit={onInit}
      />
    );
  }
}

RichEditor.propTypes = {
  initialValue: PropTypes.string,
  inputValue: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onEditorChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onInit: PropTypes.func,
  minHeight: PropTypes.number,
  editorConfig: PropTypes.object,
};

RichEditor.defaultProps = {
  minHeight: 250,
  initialValue: "",
  inputValue: "",
  id: undefined,
  disabled: undefined,
  onChange: undefined,
  onEditorChange: undefined,
  onBlur: undefined,
  onFocus: undefined,
  onInit: undefined,
  editorConfig: undefined,
};
