/*
 * SPDX-FileCopyrightText: 2022 CERN.
 * SPDX-License-Identifier: MIT
 */

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
