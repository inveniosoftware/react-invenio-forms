import React from "react";
import {
  createDynamicOverridableComponent,
  createShowHideComponent,
} from "../../../utils";
import { InputComponent } from "./Input";

const _NumberInputComponent = (props) => <InputComponent {...props} type="number" />;
export const NumberInputComponent = createShowHideComponent(_NumberInputComponent);
export const NumberInput = createDynamicOverridableComponent(NumberInputComponent);
