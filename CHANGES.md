# Changes

Version 0.10.24 (released 2023-08-23)

- upgrade "yup" dependency to be compatible with invenio-app-rdm v9
- include all in-between fixes and updates

Version 0.10.15 (released 2022-09-01)

- widgets: extract template loading as a prop. '@templates' is not working when
  publishing the library as it should be injected from the user of the library.

Version 0.10.13 (released 2022-09-01)

- form: add widgets folder. It includes basic types components derived from the core
  form fields.

Version 0.10.12 (released 2022-07-12)

- fields: remove mock data from RemoteSelectField

Version 0.10.11 (released 2022-07-01)

- Sidebar: introduce responsive props
- Logs: cleanup console errors

Version 0.10.10 (released 2022-06-15)

- Image: add fallback class name

Version 0.10.9 (released 2022-06-08)

- fix new element addition in RemoteSelectField

Version 0.10.8 (released 2022-05-11)

- Adds `onChange` prop to `TextField` to subscribe to text field value changes.
- Fixes a props warning on Accordion.

Version 0.10.7 (released 2022-05-06)

- Improve `elements.Image` component to support loading and prioritizing fallbackSrc
  image load first.
- Fix AccordionField error state to dependend on children fieldPaths

Version 0.10.6 (released 2022-04-26)

- Accessibility improvements

Version 0.10.5 (released 2022-04-12)

- Adds a new cmp for a responsive sidebar

Version 0.10.4 (released 2022-03-29)

- Integrates latest eslint-invenio-config
- Adds withCancel utility func
- Error cmps: pass uiProps

Version 0.10.3 (released 2022-03-25)

- Image: add default fallback
- forms: refactor AccordionField

Version 0.10.2 (released 2022-03-18)

- Image: replace img with SUI component
- forms: refactor array button field theming

Version 0.10.1 (released 2022-03-14)

- TextField: resets form errors onBlur to remove any previous error.

Version 0.9.5 (released 2022-02-18)

- Remove div element from Image component

Version 0.9.4 (released 2022-02-17)

- Restructring the library to 2 main subforlders:

  `forms`: This is where all the formik aware components are living. These components can be used in forms where formik is used to build them.
  `elements`: This is where all general-purpose reusable components are living. No context is assumed apart from react.

  The purpose of this PR is to centralize common components in one library. The name of the library might change in the future due to its name specificity but this work is a step towards the direction of a common component repository.

Version 0.9.3 (released 2022-02-11)

- Upgrades semantic-ui-react.
- Relax dependencies requirements patch versions.

Version 0.9.2 (released 2022-01-13)

- ArrayField: Use injected `__key` as stable array item key.

Version 0.9.1 (released 2021-12-03)

- Pass the `search` property down to RemoteSelectField

Version 0.8.7 (released 2021-07-20)

- Improve error display

Version 0.8.6 (released 2021-07-20)

- Improve RichInputField (error-able, require-able)

Version 0.8.5 (released 2021-07-19)

- Security bump of peerDependency axios to 0.21.1

Version 0.8.4 (released 2021-07-09)

- Expose added value serialization in the RemoteSelectField

Version 0.8.3 (released 2021-07-09)

- Add onValueChange property in the RemoteSelectField

Version 0.8.2 (released 2021-06-29)

- Add preSearchChange prop on RemoteSelectField to
  customize searchQuery sent to backend.

Version 0.7.0 (released 2021-03-26)

Version 0.6.2 (released 2021-02-17)

- Remove BaseForm Container

Version 0.6.1 (released 2021-02-10)

- Add `className` prop to FieldLabel component

Version 0.6.0 (released 2021-02-03)

Version 0.5.5 (released 2021-01-29)

- Adds `suggestionAPIHeaders` into RemoteSelectField
- Fixed RichInputField bottom margin

Version 0.5.4 (released 2021-01-28)

- Adds help text in ArrayField
- Adds Toggle component

Version 0.5.3 (released 2021-01-26)

- Fixes TextField double form field layer

Version 0.5.2 (released 2021-01-25)

- Revert right alignment in arrayField add button

Version 0.5.1 (released 2021-01-25)

- ArrayField add button
  - Use default SUI color
  - Right align

Version 0.5.0 (released 2021-01-22)

- Refactor `Accordion` component to use `Segment`

Version 0.4.5 (released 2020-12-11)

Version 0.4.4 (released 2020-12-10)

Version 0.4.3 (released 2020-12-09)

Version 0.4.2 (released 2020-12-09)

Version 0.4.1 (released 2020-12-08)

Version 0.4.0 (released 2020-12-07)

Version 0.3.2 (released 2020-06-01)

Version 0.3.1 (released 2020-05-29)

- Refactors `SelectField`

Version 0.3.0 (released 2020-05-25)

- Adds prettier config
- Moves docs and website folder under common docs folder
- Adds `RadioField` component

Version 0.2.1 (released 2020-05-20)

- Changes travis npm api key

Version 0.2.0 (released 2020-05-20)

- Refactors rollup.config.
- Updates `package.json` information and dependencies.

Version 0.1.0 (released 2020-05-20)

- Initial public release.
