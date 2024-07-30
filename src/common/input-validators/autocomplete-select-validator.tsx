import { AutoCompleteSelectVirtualized } from "../components/autocomplete-select-virtualized";
import { ValidatorComponent } from "react-material-ui-form-validator";

class AutoCompleteSelectValidator extends ValidatorComponent {
  renderValidatorComponent() {
    const {
      error,
      errorMessages = "",
      validators,
      requiredError,
      helperText,
      validatorListener,
      withRequiredValidator,
      options,
      multiple,
      onchange,
      containerProps,
      renderInputProps,
      ...rest
    } = this.props;
    const { labelProps = {}, ...inputProps } = renderInputProps;
    const { isValid } = this.state as any;

    return (
      <AutoCompleteSelectVirtualized
        onChange={onchange}
        containerProps={undefined}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        options={options}
        renderInputProps={{
          labelProps,
          ...inputProps,
          error: !isValid,
          helperText: !isValid && this.getErrorMessage(),
        }}
        multiple={multiple}
        defaultValue={rest.value != null ? rest.value : undefined}
      />
    );
  }
}

export default AutoCompleteSelectValidator;
