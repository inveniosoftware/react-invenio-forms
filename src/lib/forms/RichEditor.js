// This file is part of React-Invenio-Forms
// Copyright (C) 2022-2026 CERN.
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
import { Button, Message } from "semantic-ui-react";
import { FilesList } from "./FilesList";

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

/**
 * Component providing rich text editor support and optional files support.
 *
 * @param {object} props
 * @param {array} props.files The list of files, each file is expected to provide the properties `file_id`, `key`, `original_filename`, `size`, `links.download_html`.
 * @param {func} props.onFilesChange The function to call when the list of files changed.
 * @param {func} props.onFileUpload The function to call when uploading a file.
 * @param {func} props.onFileDelete The function to call when deleting a file from the list.
 * @returns {JSX.Element}
 */
export class RichEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileErrors: [],
    };

    this.editorRef = React.createRef();
    this.editorDialogRef = React.createRef();
  }

  addToFileErrors = (filename, error) => {
    this.setState((prevState) => ({
      fileErrors: [
        ...prevState.fileErrors,
        { filename: filename, message: error.response.data.message },
      ],
    }));
  };

  onFileUploadEditor = async (filename, payload, options) => {
    const { onFileUpload, onFilesChange, files } = this.props;

    const json = await onFileUpload(filename, payload, options);
    // Convert the response format when uploading a file,
    // to the same response format as when retrieving an entity with files.
    onFilesChange([
      ...files,
      {
        file_id: json.data.id,
        key: json.data.key,
        original_filename: json.data.metadata.original_filename,
        size: json.data.size,
        mimetype: json.data.mimetype,
        links: {
          download_html: json.data.links.download_html,
        },
      },
    ]);
    return json;
  };

  onFileDeleteEditor = async (file) => {
    const { onFileDelete, onFilesChange, files } = this.props;

    try {
      if (onFileDelete) {
        await onFileDelete(file);
      }
      onFilesChange(files.filter((fileFromList) => fileFromList.key !== file.key));
    } catch (error) {
      this.addToFileErrors(file.original_filename, error);
    }
  };

  /**
   * This function is called when a user drag-n-drops an image onto the editor text area.
   */
  imagesUploadHandler = async (blobInfo, progress) => {
    const filename = blobInfo.filename();
    const payload = blobInfo.blob();

    try {
      const json = await this.onFileUploadEditor(filename, payload, {
        onUploadProgress: ({ loaded, total }) =>
          progress(Math.round((loaded / total) * 100)),
      });
      progress(100);
      return new URL(json.data.links.download_html).pathname;
    } catch (error) {
      this.addToFileErrors(filename, error);
      throw error;
    }
  };

  /**
   * This function is called when a a user clicks on the upload icons
   * in the Link and Image popup dialogs.
   */
  filePickerCallback = (callback, value, meta) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");

    // If the file picker is called from the Image dialog, only allow to upload images (allow everything from the Link dialog).
    if (meta.filetype === "image") {
      if (this.editorRef.current) {
        // List of image extensions documented in:
        // https://www.tiny.cloud/docs/tinymce/latest/image/#images_file_types

        // We could accept "image/*", but then we would let users upload and inline SVG files from the image upload dialog,
        // but this would not work since we are forbidding the rendering of inline SVG for security reasons
        // (see MIMETYPE_PLAINTEXT in invenio_files_rest).
        const imagesFileTypes = this.editorRef.current.options.get("images_file_types");
        const inputAccept = imagesFileTypes
          .split(",")
          .map((imageExtension) => "." + imageExtension)
          .join(", ");
        input.setAttribute("accept", inputAccept);
      }
    }

    input.onchange = (event) => {
      const file = event.target.files[0];
      const filename = file.name;

      if (this.editorRef.current) {
        // This progress state is visible when uploading via the attach button,
        // but it is hidden behind the Link and Image popup dialogs when using them.
        this.editorRef.current.setProgressState(true);
      }

      // Progress state visible when uploading via the the Link and Image popup dialogs.
      // Taken from: https://github.com/tinymce/tinymce/issues/5133
      if (this.editorDialogRef.current) {
        this.editorDialogRef.current.block("Uploading file...");
      }

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const json = await this.onFileUploadEditor(filename, reader.result);

          if (this.editorRef.current) {
            this.editorRef.current.setProgressState(false);
          }
          if (this.editorDialogRef.current) {
            this.editorDialogRef.current.unblock();
          }

          const locationRelative = new URL(json.data.links.download_html).pathname;
          if (meta.filetype === "file") {
            callback(locationRelative, { text: json.data.metadata.original_filename });
          } else if (meta.filetype === "image") {
            callback(locationRelative, {
              alt: `Description of ${json.data.metadata.original_filename}`,
            });
          } else {
            // This should not happen, since `file_picker_types` is set to only support `file` and `image`.
            callback(locationRelative);
          }
        } catch (error) {
          this.addToFileErrors(filename, error);
          if (this.editorRef.current) {
            this.editorRef.current.setProgressState(false);
          }
          if (this.editorDialogRef.current) {
            this.editorDialogRef.current.unblock();
          }
        }
      };
      reader.readAsArrayBuffer(file);
    };
    input.click();
  };

  /**
   * This function is called when a a user clicks on the attach files toolbar button,
   * or on the attach files button next to the files list.
   */
  onAttachFiles = () => {
    this.filePickerCallback(() => {}, "", "file");
  };

  mapToEditorLinkList = (files) => {
    return files.map((file) => ({
      title: file.original_filename,
      value: new URL(file.links.download_html).pathname,
    }));
  };

  getImageList = () => {
    const { files } = this.props;

    if (this.editorRef.current) {
      // List of image extensions documented in:
      // https://www.tiny.cloud/docs/tinymce/latest/image/#images_file_types
      const imagesFileTypes = this.editorRef.current.options.get("images_file_types");
      const imagesExtensions = imagesFileTypes.split(",");

      const images = files.filter((file) => {
        const filename = file.original_filename;
        const extension = filename.slice(filename.lastIndexOf(".") + 1).toLowerCase();
        return imagesExtensions.includes(extension);
      });

      return this.mapToEditorLinkList(images);
    } else {
      return this.mapToEditorLinkList(files);
    }
  };

  getLinkList = () => {
    const { files } = this.props;
    return this.mapToEditorLinkList(files);
  };

  registerCustomPreviewButton = (editor) => {
    const customPreviewTitle = "Preview math equations";
    editor.ui.registry.addButton("custom_preview", {
      text: "√x",
      tooltip: customPreviewTitle,
      context: "any",
      onAction: () => {
        editor.execCommand("mcePreview");
        const dialog = document.querySelector(".tox-dialog");
        if (dialog) {
          // Change the title
          const title = dialog.querySelector(".tox-dialog__title");
          if (title) {
            title.textContent = customPreviewTitle; // Your custom title
          }
          const iframe = dialog.querySelector("iframe");
          // Handle iframe load to render MathJax by passing the iframe document body to MathJax.typesetPromise
          iframe.onload = () => {
            window.MathJax?.typesetPromise([iframe.contentDocument.body]);
          };
        }
      },
    });
  };

  registerAttachButton = (editor) => {
    editor.ui.registry.addButton("attach", {
      icon: "upload",
      tooltip: "Attach files",
      onAction: () => this.onAttachFiles(),
    });
  };

  render() {
    const localRefEditorDialogRef = this.editorDialogRef;

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
      files,
      onInit,
    } = this.props;
    const { fileErrors } = this.state;
    const attachFilesEnabled = files !== undefined;
    let config = {
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
      toolbar: `blocks | bold italic codesample blockquote table | bullist numlist | outdent indent | link image ${
        attachFilesEnabled ? "attach " : " "
      }| wordcount | undo redo | code | custom_preview`,
      autoresize_bottom_margin: 20,
      block_formats: "Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3",
      table_advtab: false,
      convert_urls: false,
      setup: (editor) => {
        this.registerCustomPreviewButton(editor);
        if (attachFilesEnabled) {
          this.registerAttachButton(editor);
          editor.on("OpenWindow", function (eventDetails) {
            localRefEditorDialogRef.current = eventDetails.dialog;
          });
        }
      },
      ...editorConfig,
    };

    if (attachFilesEnabled) {
      config = {
        ...config,
        // No need for TinyMCE to generate unique filenames since we delegate this responsibility to the backend.
        images_reuse_filename: true,
        // This function is called when a user drag-n-drops an image onto the editor text area.
        images_upload_handler: this.imagesUploadHandler,
        // We do not implement the file picker type `media` since we do not enable the Media plugin/button.
        file_picker_types: "file image",
        // This function is called when a a user clicks on the upload icons
        // in the Link and Image popup dialogs.
        file_picker_callback: this.filePickerCallback,
        // Pre-filled link list in the Image popup dialog.
        image_list: (success) => {
          success(this.getImageList());
        },
        // Pre-filled link list in the Link popup dialog.
        link_list: (success) => {
          success(this.getLinkList());
        },
        // Disabling the separated image upload tab in the Image dialog,
        // since it is a bit redundant with the little upload icon next to the filename.
        image_uploadtab: false,
      };
    }

    return (
      <>
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
          onInit={(event, editor) => {
            this.editorRef.current = editor;
            onInit && onInit(event, editor);
          }}
        />
        {attachFilesEnabled && (
          <>
            {fileErrors.length > 0 && (
              <Message negative>
                <ul>
                  {fileErrors?.map((fileError, index) => (
                    // We always add errors to the end of the list,
                    // so the elements rendered at a specific index do not change.
                    // eslint-disable-next-line react/no-array-index-key
                    <li key={index}>
                      {fileError.filename}: {fileError.message}
                    </li>
                  ))}
                </ul>
              </Message>
            )}
            <FilesList files={files} onFileDelete={this.onFileDeleteEditor} />
            <div>
              <Button
                basic
                size="small"
                compact
                icon="attach"
                content="Attach files"
                className="mt-5"
                onClick={() => this.onAttachFiles()}
              />
            </div>
          </>
        )}
      </>
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
  files: PropTypes.array,
  onFilesChange: PropTypes.func,
  onFileUpload: PropTypes.func,
  onFileDelete: PropTypes.func,
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
  files: undefined,
  onFilesChange: undefined,
  onFileUpload: undefined,
  onFileDelete: undefined,
};
