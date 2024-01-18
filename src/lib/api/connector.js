// This file is part of React-Invenio-Forms
// Copyright (C) 2022 CERN.
//
// React-Invenio-Forms is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

// This file is part of InvenioRDM
// Copyright (C) 2022 CERN.
//
// Invenio RDM is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import axios from "axios";

const baseAxiosConfiguration = {
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
  headers: {
    "Accept": "application/vnd.inveniordm.v1+json",
    "Content-Type": "application/json",
  },
};

export const http = axios.create(baseAxiosConfiguration);
