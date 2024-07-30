  import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
  import React, { FunctionComponent, useState } from "react";
  import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
  import { createStyles, makeStyles } from "@mui/styles";
  import de from 'date-fns/locale/de'
  import { IFieldProps, renderPlainTextField, renderProposed } from "./field-utils";
  import { DatePicker } from '@mui/x-date-pickers/DatePicker';

  export const FieldDates: FunctionComponent<IFieldProps> = (props: IFieldProps) => {
    const {
      id,
      title,
      inputType: propsInputType,
      // value: propsValue,
      proposedValue,
      onChange: propsOnChange = () => { },
      showChanges,
      disabled: propsDisabled,
      editable,
      validators,
      errorMessages,
      defaultValue,
      variant
    } = props;

    const [value, setValue] = useState<Date | null>(null);
    const [inputType] = useState(propsInputType);
    const classes = useStyles();
    const disabled = propsDisabled || !editable;
    const editLabelHighlight = editable && !propsDisabled
      ? { classes: { root: classes.editableHighlight }, shrink: true }
      : { classes: { root: classes.inputLabel }, shrink: true };

    const onDateChange = (date: Date | null) => {
      setValue(date);
      propsOnChange({ id, value: date });
    };

    const renderInput = (_inputType: string) => {
      switch (_inputType) {
        case "date": {
          const dateValue = value ?? defaultValue ?? null;
          return (
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
              <DatePicker
                label={title}
                value={dateValue}
                onChange={onDateChange}
                renderInput={_props => {
                  const inputProps = _props.inputProps || {}; // Add null check here
                  inputProps["data-testid"] = id;
                  return renderPlainTextField({
                    title,
                    value: inputProps.value || '', // Provide a default value
                    defaultValue,
                    disabled,
                    props: _props,
                    validators,
                    errorMessages,
                    editLabelHighlight,
                    classes,
                    variant
                  });
                }}
                disabled={disabled}
              />
            </LocalizationProvider>
          );
        }
        default:
          return null;
      }
    };
    return (
      <div className={classes.container}>
        {renderInput(inputType)}
        {renderProposed({ inputType, showChanges, proposedValue, classes })}
      </div>
    );
  };

  const useStyles = makeStyles(() =>
    createStyles({
      container: {
        flex: 1,
      },
      dateRangeTo: {
        alignSelf: "center",
      },
      inputLabel: {
        fontSize: "1rem",
        fontWeight: 500,
      },
      inputValue: {
        fontWeight: 300,
      },
      validatorContainer: {
        width: "100%",
      },
      editableHighlight: {
        fontSize: "1rem",
        fontWeight: 300,
      },
      proposed: {
        margin: "0.1rem",
        padding: "0.2rem",
        height: "auto",
      },
      proposedText: {
        color: "white",
      },
    })
  );

