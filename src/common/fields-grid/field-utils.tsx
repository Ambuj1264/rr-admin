import TextValidator from "../input-validators/text-validator";
import { Chip } from "@mui/material";
import { DateRange } from "react-date-range";
import { dateFormatter } from "../utils";
export interface selectOption {
  [key: string]: any;
  id: string;
  value: string;
}
export interface listOption {
  key: string;
  value?: string;
  isEditable?: boolean;
}
export interface IFieldProps {
  id: string;
  title: string;
  inputType: string;
  value?:
    | string
    | boolean
    | Date
    | DateRange
    | any[]
    | selectOption
    | listOption;
  valueKey?: string;
  proposedValue?: string;
  options?: any[];
  onChange?: Function;
  onMultiSelectChange?: Function;
  showChanges?: boolean;
  disabled?: boolean;
  editable?: boolean;
  validators?: string[];
  errorMessages?: string[];
  defaultValue?: any;
  placeholder?: string;
  variant?: string;
  classes?: Classes; // Add the 'classes' property
}
interface Classes {
  inputValue: string;
  validatorContainer: string;
  proposed: string;
  proposedText: string;
  variant?: string;
}
export const renderPlainTextField = ({
  title,
  value = "",
  disabled,
  onChange = undefined,
  validators,
  errorMessages,
  editLabelHighlight,
  classes,
  variant= undefined,
  defaultValue = undefined,
  placeholder = undefined,
  props = {},
  inputType = "text",
}: {
  title: string; // Explicitly define the type of the 'title' parameter
  value:
    | string
    | boolean
    | Date
    | DateRange
    | any[]
    | selectOption
    | listOption
    | undefined;
  disabled: boolean;
  onChange?: Function;
  validators?: string[];
  errorMessages?: string[];
  editLabelHighlight: any;
  classes: Classes;
  defaultValue?: any;
  placeholder?: string;
  props?: any;
  variant?:string
  inputType?: string;
}) => {
  // Protect value against null: Warning: `value` prop on `textarea` should not be null.
  const _value = value ?? defaultValue ?? "";
  return (
    <TextValidator
      type={inputType}
      name={title}
      label={title}
      value={_value}
      placeholder={placeholder}
      disabled={disabled}
      variant={variant}
      onChange={onChange}
      multiline
      maxRows={1}
      validators={validators}
      errorMessages={errorMessages}
      InputLabelProps={editLabelHighlight}
      inputClass={classes.inputValue}
      containerProps={{ className: classes.validatorContainer }}
      {...props}
    />
  );
};

export const renderProposed = ({
  inputType = "",
  showChanges = true,
  proposedValue = "",
  classes = {} as Classes, // Provide default value as empty object
}) => {
  let label = "";
  switch (inputType) {
    case "text":
    case "checkbox":
      label = proposedValue as string;
      break;
    case "radio":
      label = proposedValue as string;
      break;
    case "select":
      label = (proposedValue as unknown as selectOption)?.value;
      break;
    case "Multipleselect":
      label = (proposedValue as unknown as selectOption)?.value;
      break;
    case "date":
      label = dateFormatter(proposedValue);
      break;
    default:
  }

  return (
    showChanges &&
    proposedValue && (
      <Chip
        label={label}
        classes={{ root: classes?.proposed, label: classes?.proposedText }}
      />
    )
  );
};
