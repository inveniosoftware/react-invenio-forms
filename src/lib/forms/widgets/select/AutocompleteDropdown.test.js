/*
 * SPDX-FileCopyrightText: 2026 Dhairya Jangir
 * SPDX-License-Identifier: MIT
 */

import { Formik } from "formik";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { AutocompleteDropdown } from "./AutocompleteDropdown";

it.each([false, true])(
  "renders the required label on the search input when multiple=%s",
  (multiple) => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const root = createRoot(div);
    const fieldPath = "custom_fields.test:ResearchTheme";

    try {
      act(() =>
        root.render(
          <Formik initialValues={{ custom_fields: {} }} onSubmit={() => {}}>
            <AutocompleteDropdown
              autocompleteFrom="/api/vocabularies/research-themes"
              fieldPath={fieldPath}
              label="Research theme"
              labelIcon="pencil"
              multiple={multiple}
              placeholder="Select a theme"
              required
            />
          </Formik>
        )
      );

      const field = div.querySelector(".required.field");
      const label = field.querySelector(":scope > label");
      const searchInput = field.querySelector("input.search");
      expect(label).toHaveTextContent("Research theme");
      expect(label).toHaveClass("invenio-field-label");
      expect(label.querySelector(".pencil.icon")).toBeInTheDocument();
      expect(searchInput).toHaveAttribute("id", fieldPath);
      expect(label.control).toBe(searchInput);
      expect(div.querySelectorAll("label")).toHaveLength(1);
    } finally {
      act(() => root.unmount());
      div.remove();
    }
  }
);
