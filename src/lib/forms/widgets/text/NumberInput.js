import React from "react";
import { showHideOverridableWithDynamicId } from "../../fieldComponents";
import { InputComponent } from "./Input";

const NumberInputComponent = (props) => <InputComponent {...props} type="number" />;
export const NumberInput = showHideOverridableWithDynamicId(NumberInputComponent);
