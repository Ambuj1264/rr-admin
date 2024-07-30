import { FunctionComponent, useEffect, useState } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { IFieldProps, renderPlainTextField } from "./field-utils";
import {  FormControl, FormControlLabel, FormHelperText, OutlinedInput, Radio } from "@mui/material";
import CheckboxField from "../input-validators/checkbox";
import PasswordField from "../input-validators/password";
export const Field: FunctionComponent<IFieldProps> = (props: IFieldProps) => {
  const {
    id,
    title,
    inputType,
    value: propsValue,
    onChange: propsOnChange = () => {},
    disabled: propsDisabled,
    editable,
    validators,
    errorMessages,
    defaultValue,
    placeholder,
    variant,
    options = [],
  } = props;
  const [value, setValue] = useState(propsValue);
  const classes = useStyles();
  const disabled = propsDisabled || !editable;
  const editLabelHighlight =
    editable && !propsDisabled
      ? { classes: { root: classes.editableHighlight }, shrink: true }
      : { classes: { root: classes.inputLabel }, shrink: true };
  const checkboxLabel = `${classes.checkboxLabel} ${
    editable && !propsDisabled ? classes.editableCheckboxHighlight : ""
  }`;
  const onChange = (event: { target: any }) => {
    
    let _value;
    let onChangeValue;
    switch (inputType) {
      case "checkbox":
        _value = event.target.checked;
        onChangeValue = _value;
        break;
      case "currency":
      case "number":
        _value = event.target.value;
        onChangeValue = parseFloat(_value);
        break;
      case "text":
      case "password":
      default:
        _value = event.target.value;
        onChangeValue = _value;
    }
    setValue(_value);
    propsOnChange({ id, value: onChangeValue });
  };


useEffect(()=>{
  setValue(propsValue)
},[propsValue])
  const renderInput = (_inputType: string) => {
    let _value = value;
    switch (_inputType) {
      case "currency":
        return renderPlainTextField({
          title,
          variant,
          value: _value,
          defaultValue,
          placeholder,
          disabled,
          onChange,
          validators,
          errorMessages,
          editLabelHighlight,
          classes,
          inputType: "number",
        });
      case "number":
        return renderPlainTextField({
          title,
          value: _value,
          props: { inputProps: { "data-testid": id } },
          defaultValue,
          placeholder,
          disabled,
          variant,
          onChange,
          validators,
          errorMessages,
          editLabelHighlight,
          classes,
          inputType: _inputType,
        });
      case "text":
        return renderPlainTextField({
          title,
          variant,
          value: _value,
          props: { inputProps: { "data-testid": id } },
          defaultValue,
          placeholder,
          disabled,
          onChange,
          validators,
          errorMessages,
          editLabelHighlight,
          classes,
        });
      case "checkbox":
        return (
        
          <CheckboxField
            title={title}
            value={_value}
            defaultValue={defaultValue}
            onChange={onChange}
            disabled={disabled}
            checkboxLabel={checkboxLabel}
            classes={classes}
            id={id} createValidators={undefined} createErrorMsgs={undefined} 
            name={id} 
            errorMessages={errorMessages} 
            validators={validators}     />
        );
   
      case "radio":
        if (value == null) {
          _value = defaultValue;
        }
        return (
          <>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                label={option.value}
                control={
                  <Radio
                    checked={value === option.value}
                    onChange={onChange}
                    value={option.value}
                    className={classes.radio}
                    disabled={disabled}
                  />
                }
              />
            ))}
          </>
        );

      case "password":
        return (<PasswordField
        title={title}
        value={_value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        classes={classes}
        id={id} createValidators={undefined} createErrorMsgs={undefined} 
        name={id} 
        errorMessages={errorMessages} 
        validators={validators}     />)
      case "NA":
        return <span>N/A</span>;
      default:
        return null;
    }
  };

  return <div className={classes.container}>{renderInput(inputType)}</div>;
};

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      flex: 1,
    },
    autocompleteContainer: {
      flex: 1,
    },
    checkboxRoot: {
      display: "flex",
    },
    checkboxLabel: {
      color: "black !important",
      fontWeight: 400,
      fontSize: "1rem",
    },
    inputLabel: {
      fontSize: "1rem",
      fontWeight: 300,
    },
    inputValue: {
      fontWeight: 300,
    },
    editableHighlight: {
      fontSize: "1rem",
      fontWeight: 300,
      // color: "#3f51b5",
    },
    editableCheckboxHighlight: {
      fontSize: "1rem",
      fontWeight: 500,
      // color: "#1dc6c9",
    },
    validatorContainer: {
      width: "100%",
    },
    select: {
      fontWeight: 200,
      fontSize: "1rem",
    },
    proposed: {
      margin: "0.1rem",
      padding: "0.2rem",
      height: "auto",
      // backgroundColor: MercadoColors.orange,
    },
    proposedText: {
      color: "white",
    },
    radio: {
      fontSize: "1rem",
      fontWeight: 500,
      // color: "#1dc6c9",
    },
   
  })
);


