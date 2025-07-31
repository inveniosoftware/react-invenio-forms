# Changes

Version 4.10.1 (release 2025-07-31)

- RemoteSelectField: Show default search results after selection/addition
- fix(subjects-dropdown): add subject as key if id is missing
- fix: rely on CSS for accordion icon rotation

Version 4.10.0 (release 2025-06-18)

- CustomFields: pass severityChecks
- AccordionField: use severityChecks label instead of severity key
- AccordionField: correct accordion labels for deeply nested errors
- FeedbackLabel: add missing pointing values

Version 4.9.1 (release 2025-06-10)

- feedback label: fix nested errors display

Version 4.9.0 (release 2025-06-05)

- FeedbackLabel: adapt to use with formik
- feedback: add feedback label to select field
- fix: refactor filter logic in ListAndFilterCustomFields component


Version 4.8.2 (release 2025-04-03)

- fix: refactor filter logic in ListAndFilterCustomFields component
- fix: eslint warnings
- chore: update dependencies

Version 4.8.1 (release 2025-03-28)

- forms: FeedbackLabel: fix new prop not displayed due to state usage

Version 4.8.0 (release 2025-03-28)

- forms: add support for new error format to TextField
- accordion field: fix detection of errors with new format
- forms: show icon and tooltip for new error format with severity error
- editor: Add word count plugin to RichEditor toolbar
    - This is useful when the input field has a character limit, allowing users to see the current character count.
    - Related to https://github.com/inveniosoftware/invenio-requests/pull/391

Version 4.7.0 (release 2025-03-26)

- forms: FeedbackLabel: display unescaped description (sanitized HTML)
- custom_fields: add support for ui section widget
    - allow to rename DiscoverFieldsSection label

Version 4.6.1 (release 2025-03-21)

- utils: updated string error handling in flattenAndCategorizeErrors

Version 4.6.0 (release 2025-03-18)

- forms: add error count label in accordion and add FeedbackLabel

Version 4.5.3 (release 2025-03-10)

- custom fields:  replace cancel with close btn in modals (ux improvement)

Version 4.5.2 (release 2025-01-15)

- affiliations: update value property to use id
- subjects: updated subject serialization

Version 4.5.1 (release 2024-11-29)

- affiliations: fix generated dropdown values

Version 4.5.0 (release 2024-11-27)

- affiliations: render organization acronym in subheader
- affiliations: fix serialization values
- RemoteSelectField: fix handling of multiple value selection
- affiliations: exporting helper functions

Version 4.4.0 (released 2024-11-14)

- deps: adds react-overridable
- forms: bugfix on RemoteSelectField
- contrib: make AffiliationsSuggestions overridable

Version 4.3.1 (released 2024-11-11)

- contrib: fix affiliations selection display

Version 4.3.0 (released 2024-10-10)

- deps: bump axios major version

Version 4.2.1 (released 2024-09-27)

- contrib: add affiliation suggestion component

Version 4.2.0 (released 2024-09-26) (yanked)

- contrib: add affiliation suggestion component
- fields: propagate initial value to widgets (avoids setting explicitly by formik props)
- yanked: initial values props is interfering with formik internal state in already existing forms

Version 4.1.0 (released 2024-09-02)

- editor: disable TinyMCE convert_urls to fix same domain URLs
- forms: RemoteSelectField: Fix searching with same query
- forms: RemoteSelectField: Make request cancellable
- forms: RemoteSelectField: Display initial suggestions in dropdown

Version 4.0.0 (released 2024-08-12)

- customfields: allow hiding section name
- api: change default accept header for ajax calls (breaking change)

Version 3.5.2 (released 2024-08-02)

- editor: avoid losing content when the editor loses focus

Version 3.5.1 (released 2024-07-28)

- editor: fix jumping cursor to the top

Version 3.5.0 (released 2024-06-28)

- RemoteSelect: pass searchQueryParamName as a property

Version 3.4.0 (released 2024-06-12)

- ui: allow accordion to be folded as a default when not marked as active

Version 3.3.0 (released 2024-04-09)

- utils: added a reusable dropdown items serializer

Version 3.2.0 (released 2024-03-06)

- dropdown: added a dropdown for subjects
- editor: refactor config for editor

Version 3.1.0 (released 2024-01-30)

- custom fields: add remove discovered field button

Version 3.0.1 (released 2024-01-30)

- fix discoverable rendering for empty fields

Version 3.0.0 (released 2024-01-30)

- add discoverable custom fields components

Version 2.8.4 (released 2023-12-12)

- Replace CKEditor with TinyMCE

Version 2.8.3 (released 2023-11-28)

- ErrorMessage: add icon attribute only when needed

Version 2.8.2 (released 2023-10-18)

- user widget: display username correctly

Version 2.8.1 (released 2023-10-09)

- remote field: log errors to console

Version 2.8.0 (released 2023-10-02)

- ui: added toggle and keyboard focus for accordion
- ui: adds focus prop to dropdown select
- ui: prevents auto-selection of dropdown on focus

Version 2.7.1 (released 2023-09-22)

- a11y: remove duplicate field ids

Version 2.7.0 (released 2023-09-21)

- elements: add accessibility attributes
- array and select: fix formatting

Version 2.6.1 (released 2023-09-19)

- forms: fix missing display of initial errors

Version 2.6.0 (released 2023-09-12)

- responsive sidebar: add aria-label prop

Version 2.5.0 (released 2023-09-04)

- add RDM contrib components
- package: fix 'browser' entry in dist/package.json

Version 2.4.0 (released 2023-04-20)

- add accessible Popup component

Version 2.3.0 (released 2023-04-20)

- add human friendly bytes representation component

Version 2.2.0 (released 2023-03-29)

- add ErrorMessage generic component

Version 2.1.0 (released 2023-03-28)

- reorganise subpackages
- add locale relative time calculation function

Version 2.0.0 (released 2023-03-01)

- add multiple folders to dynamic loader

Version 1.1.2 (released 2023-02-15)

- widgets: add rows prop to TextArea component

Version 1.1.1 (released 2023-01-24)

- forms: fix ArrayField element remove button

Version 1.1.0 (released 2022-11-29)

- add required options to array field

Version 1.0.1 (released 2022-11-10)

- add central axios config

Version 1.0.0 (released 2022-10-24)

- upgrade to node 18
- align yup package version

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
- Fix AccordionField error state to depend on children fieldPaths

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
