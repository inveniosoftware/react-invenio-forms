/*
 * SPDX-FileCopyrightText: 2026 Dhairya Jangir.
 * SPDX-License-Identifier: MIT
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { Formik } from "formik";
import { AccordionField } from "./AccordionField";

const values = { alternate_identifiers: [{ scheme: "doi", identifier: "" }] };

function renderAccordion(errors) {
  return render(
    <Formik initialValues={values} initialErrors={errors} onSubmit={() => {}}>
      {({ setErrors }) => (
        <>
          <AccordionField
            label="Alternate identifiers"
            includesPaths={["alternate_identifiers"]}
          />
          <button
            type="button"
            onClick={() =>
              setErrors({ alternate_identifiers: [{ identifier: "Required" }] })
            }
          >
            Save draft
          </button>
          <button type="button" onClick={() => setErrors({})}>
            Clear errors
          </button>
        </>
      )}
    </Formik>
  );
}

test("direct string error appears in the accordion summary", () => {
  renderAccordion({ alternate_identifiers: "Required" });
  expect(screen.queryByText("1 error")).not.toBeNull();
});

test("structured nested warning retains its severity", () => {
  renderAccordion({
    alternate_identifiers: [{ identifier: { message: "Review", severity: "warning" } }],
  });
  expect(screen.queryByText("1 warning")).not.toBeNull();
  expect(screen.queryByText(/\d+ error/)).toBeNull();
});

test("nested plain Formik validation error appears in the accordion summary", () => {
  renderAccordion({ alternate_identifiers: [{ identifier: "Required" }] });
  expect(screen.queryByText("1 error")).not.toBeNull();
});

test("summary appears when a draft reports a nested validation error and clears on repair", () => {
  renderAccordion({});
  expect(screen.queryByText("1 error")).toBeNull();

  const accordion = screen
    .getByText("Alternate identifiers")
    .closest(".invenio-accordion-field");

  fireEvent.click(screen.getByText("Save draft"));
  expect(screen.queryByText("1 error")).not.toBeNull();
  expect(accordion.classList.contains("error")).toBe(true);

  fireEvent.click(screen.getByText("Clear errors"));
  expect(screen.queryByText("1 error")).toBeNull();
  expect(accordion.classList.contains("error")).toBe(false);
});
