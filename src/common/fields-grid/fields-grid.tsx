import { FunctionComponent, useMemo } from "react";
import { Grid } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { mapFieldsData } from "./fields-data-map";
export interface IFieldsGridProps {
  title?: string;
  data?: object;
  mode?: "create" | "edit";
  fieldsMap: any[];
  disabled?: boolean;
  onChange?: Function;
  showChanges?: boolean;
  onMultiSelectChange?: Function| undefined;
}
export const FieldsGrid: FunctionComponent<IFieldsGridProps> = (
  props: IFieldsGridProps
) => {
  const {
    data,
    mode = "create",
    disabled,
    fieldsMap = [],
    onChange = () => {},
    showChanges,
    onMultiSelectChange,
  } = props;
  const classes = useStyles();

  const fields = useMemo(
    () =>
      mapFieldsData({
        data,
        mode,
        fieldsMap,
        disabled,
        classes,
        onChange,
        showChanges,
        onMultiSelectChange
      }),
    [data, mode, fieldsMap, disabled, classes, onChange, onMultiSelectChange, showChanges]
  );
  return (
    <Grid container spacing={2}>
      {fields.length > 0 ? fields : <h1>No fields to display</h1>}
    </Grid>
  );
};

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: "100%",
    },
  })
);

export default FieldsGrid;
