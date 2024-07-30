import React, { useState } from "react";
import { FormHelperText, FormControl, OutlinedInput, TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ValidatorComponent } from "react-material-ui-form-validator";

class PasswordField extends ValidatorComponent {
  state = {
    isValid: true, // Add isValid to the initial state
    showPassword: false,
  };

  toggleShowPassword = () => {
    this.setState((prevState:any) => ({
      showPassword: !prevState?.showPassword,
    }));
  };

  renderValidatorComponent() {
    const {
      title,
      value,
      onChange,
      disabled,
      id,
      validators,
      errorMessages = [],
      placeholder,
    } = this.props;
    const { isValid, showPassword } = this.state;

    const isRequired = !validators || validators.includes("required") ? true : false;

    const showErrorOnLoad = isRequired && !value;

    const errorText = !isRequired ? "Required" : errorMessages[errorMessages.length - 1];

    return (
      <div>
        <FormControl sx={{ m: 0, width: "100%" }} variant="outlined">
          <TextField
            id={id}
            type={showPassword ? "text" : "password"}
            title={title}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            error={!isValid && Boolean(errorText)}
            helperText={!isValid && errorText}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={this.toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </div>
    );
  }
}

export default PasswordField;
