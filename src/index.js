/*
 * This file is part of React-Invenio-Forms.
 * Copyright (C) 2019 CERN.
 *
 * React-Invenio-Forms is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { createRoot } from "react-dom/client";
import App from "./demos/App";
import "semantic-ui-css/semantic.min.css";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
