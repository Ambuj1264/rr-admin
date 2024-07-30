import { ValidatorComponent } from "react-material-ui-form-validator";
import { StyledTextField } from "../components/styledTextField";
class TextValidator extends ValidatorComponent {
  renderValidatorComponent() {
    const {
      errorMessages="",
      validators,
      requiredError,
      helperText,
      validatorListener,
      withRequiredValidator,
      containerProps,
      InputLabelProps,
      ...rest
    } = this.props;
    const { isValid } = this.state as any;
    // const isRequired =
    //   !validators ||
    //   Boolean(validators.includes("required") ? !!rest?.value : true);
    //   const errorText = !isRequired ? errorMessages[0] : "";
    return (
      <StyledTextField
        InputLabelProps={{ ...(InputLabelProps ?? {}) }}
        {...rest}
        error={!isValid}
        helperText={(!isValid && this.getErrorMessage())}
      />
    );
  }
}
export default TextValidator;
