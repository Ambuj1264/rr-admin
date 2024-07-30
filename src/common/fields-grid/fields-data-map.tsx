import { Grid, GridSize } from "@mui/material";
import { Field } from "./field";
import { FieldSelect } from "./field-select";
import { FieldMultipleSelect } from "./field-multi-select";
import { FieldDates } from "./field-dates";

export function mapFieldsData({
  data = {} as any,
  mode,
  fieldsMap,
  disabled,
  classes,
  onChange,
  showChanges,
  onMultiSelectChange,
}: {
  data?: any;
  mode: string;
  fieldsMap: any[];
  disabled?: boolean;
  classes: any;
  onChange: any;
  showChanges: any;
  onMultiSelectChange?: Function | undefined;
}) {
  
  const gridFields: any[] = [];
  fieldsMap.forEach((f, i) => {
    const key = `${i}.${f.readKey}`;
    const fieldKey = f.apiKey;
    if (fieldKey === null) {
      gridFields.push(
        <Grid container item key={i} xs={12} className={classes.lineBreak} />
      );
      return;
    }
    const fieldProps = {
      id: fieldKey,
      title: f.title,
      editable: f.editable,
      defaultValue: f.defaultValue,
      placeholder: f.placeholder,
      variant: f.variant,
      proposedValue: f.proposedValue,
      inputType: f.type,
      validators: mode === "create" ? f.createValidators : f.editValidators,
      errorMessages: mode === "create" ? f.createErrorMsgs : f.editErrorMsgs,
      valueKey: f.valueKey,
      disabled,
      onChange,
      onMultiSelectChange,
      value: data && data[fieldKey] ? data[fieldKey] : null,
      showChanges,
    } as any;

    let cellScale = f.cellScale || 1;
    let gridSizes: { xs: GridSize; sm: GridSize; md: GridSize; lg: GridSize };
    switch (f.type) {
      case "date":
        fieldProps.value = fieldProps.value || null;
        break;
      case "text":
        break;
      case "select":
        fieldProps.options = f.options;
        break;
      case "Multipleselect":
        fieldProps.options = f.options;
        break;
      case "radio":
        fieldProps.options = f.options;
        break;
      case "checkbox":
        break;
        case "password":
          break;
      case "currency":
        break;
      case "number":
        break;
      default:
        // Ignore field
        return;
    }
    gridSizes = generateGridSizes(cellScale);
    gridFields.push(
      renderField({
        ...fieldProps,
        key,
        gridSizes,
      })
    );
  });
  return gridFields;
}

function renderField({
  key = "",
  id = "",
  title = "",
  value = "",
  valueKey = "",
  disabled = true,
  editable = true,
  gridSizes = {},
  inputType = "text",
  proposedValue = undefined,
  defaultValue = undefined,
  placeholder = undefined,
  variant = undefined,
  options = [],
  onMultiSelectChange = undefined,
  onChange = undefined,
  showChanges = undefined,
  validators = undefined,
  errorMessages = undefined,
}) {
  let FieldComponent;
  
  switch (inputType) {
    case "select":
      FieldComponent = FieldSelect;
      break;
    case "Multipleselect":
      FieldComponent = FieldMultipleSelect;
      break;
    case "date":
      FieldComponent = FieldDates;
      break;
    default:
      FieldComponent = Field;
  }
 
  return (
    <Grid container item key={key} {...gridSizes}>
      <FieldComponent
        id={id}
        inputType={inputType}
        title={title}
        value={value}TextValidator
        valueKey={valueKey}
        defaultValue={defaultValue}
        placeholder={placeholder}
        proposedValue={proposedValue}
        options={options}
        disabled={disabled}
        variant={variant}
        editable={editable}
        onChange={onChange}
        data-testid={id}
        showChanges={showChanges}
        validators={validators}
        errorMessages={errorMessages}
        onMultiSelectChange={onMultiSelectChange}
      />
    </Grid>
  );
}

function generateGridSizes(cellScale: number) {
  return {
    xs: Math.min(6 * cellScale, 12) as GridSize,
    sm: Math.min(4 * cellScale, 12) as GridSize,
    md: Math.min(3 * cellScale, 12) as GridSize,
    lg: Math.min(2 * cellScale, 12) as GridSize,
  };
}
