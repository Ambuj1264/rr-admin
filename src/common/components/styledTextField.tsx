import { withStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import { forwardRef } from "react";

const _TextField = forwardRef<HTMLDivElement, any>(
  (props: { [x: string]: any; inputClass: any }, ref: any) => {
    const { inputClass, variant, type,...rest } = props;
    const selectedVariant = variant || "standard";
    const spacehandler = (event) => {
      if (event.which === 32 && event.target.value === "") {
        event.preventDefault();
      }
    };
    
    return (
      <TextField
        ref={ref}
        {...rest}
        fullWidth
        onKeyDown={spacehandler}
        variant={selectedVariant}
        inputProps={{ ...rest.inputProps, className: inputClass }}
      />
    );
  }
);

export const StyledTextField = withStyles({
  root: {
    // Override disabled grey text color default of rgba(0, 0, 0, 0.38)
    "& .MuiInputBase-root.Mui-disabled": { // disabled value text
      color: "black",
    },
    "& .MuiFormLabel-root.Mui-disabled": { // disabled label text
      color: "rgba(0,0,0,0.8)",
    },
    "& .MuiFormHelperText-root.Mui-disabled": { // remove mm/dd/yyyy below date inputs
      display: "none",
    },
  }
})(_TextField);
