// This file is part of React-Invenio-Forms
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from 'react';
import ReactDOM from 'react-dom';
import { FieldLabel } from './FieldLabel';

it('renders without crashing with no props', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FieldLabel />, div);
});

it('renders without crashing with all props', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <FieldLabel
      htmlFor="foo"
      icon="american sign language interpreting"
      label="Foo"
    />,
    div
  );
});
