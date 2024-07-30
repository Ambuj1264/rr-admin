import { Autocomplete, TextField } from "@mui/material";
export function AutoCompleteSelectVirtualized(props: { [x: string]: any; containerProps: any; renderInputProps: any; options: any[];}) {
  const { containerProps, renderInputProps, options, ...rest } = props;
  const { labelProps = {},variant, ...inputProps } = renderInputProps;
  const selectedVariant = variant || "standard";
  return (
    <Autocomplete
      options={options} 
      getOptionLabel={(option) => option.value}
      disableListWrap
      autoComplete={true}
      autoHighlight={true}
      autoSelect={true}
     
      renderInput={(params) => (
        <TextField {...params} InputLabelProps={{ ...labelProps }} {...inputProps}   variant={selectedVariant}  />
      )}
      {...rest}
    />
  );
}
