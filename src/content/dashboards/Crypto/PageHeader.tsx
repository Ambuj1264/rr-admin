import { Typography, Avatar, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";

function PageHeader() {
  const [fullName, setFullName] = useState("");
  useEffect(() => {
    const userName = JSON.parse(localStorage.getItem("USERNAME"));
    const firstName = userName?.firstName;
    const lastName = userName?.lastName;
    setFullName((firstName + " " + lastName).toUpperCase());
  }, []);

  const user = {
    name: fullName,
    avatar:
      "/static/images/avatars/pngtree-vector-administration-icon-png-image_747092.jpg",
  };

  const theme = useTheme();

  return (
    <Grid container alignItems="center">
      <Grid item>
        <Avatar
          sx={{
            mr: 2,
            width: theme.spacing(8),
            height: theme.spacing(8),
          }}
          variant="rounded"
          alt={user.name}
          src={user.avatar}
        />
      </Grid>
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Welcome, {user.name}
        </Typography>
        <Typography variant="subtitle2">
          Today sets the stage for efficient resource management and seamless
          reservations within our admin panel
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
