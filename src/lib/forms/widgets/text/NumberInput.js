/*
 * SPDX-FileCopyrightText: 2022-2025 CERN.
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import { showHideOverridableWithDynamicId } from "../../fieldComponents";
import { InputComponent } from "./Input";

const NumberInputComponent = (props) => <InputComponent {...props} type="number" />;
export const NumberInput = showHideOverridableWithDynamicId(NumberInputComponent);
