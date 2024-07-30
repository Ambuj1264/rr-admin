import React from "react";
import { FormControlLabel, Checkbox, FormHelperText } from "@mui/material";
import { ValidatorComponent } from "react-material-ui-form-validator";

class CheckboxField extends ValidatorComponent {
  renderValidatorComponent() {
    const {
      title,
      value,
      onChange,
      disabled,
      id,
      validators,
      errorMessages = [],
    } = this.props;
    const { isValid } = this.state as any;
    const isRequired =
      !validators || validators.includes("required") ? true : false;
    const showErrorOnLoad = isRequired && !value;
    const errorText = isRequired ? errorMessages[0] : "";

    return (
      <div>
        <FormControlLabel
          label={title}
          checked={!!value}
          onChange={onChange}
          disabled={disabled}
          control={<Checkbox data-testid={id} color="primary" />}
        />
        {(!isValid ) && (
          <FormHelperText style={{ color: "#FF1943"}}>
            {errorText}
          </FormHelperText>
        )}
      </div>
    );
  }
}

export default CheckboxField;
