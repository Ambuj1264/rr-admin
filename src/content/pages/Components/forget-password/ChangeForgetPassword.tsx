import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { styled } from "@mui/material/styles";
import ForgetPassword from "./forget-password";
const TypographyH1 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(50)};
`
);

const TypographyH2 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(17)};
`
);

function ChangeForgetPassword() {
 
  return (
    <Container maxWidth="md" sx={{ textAlign: "center" }}>
      <Grid
        spacing={{ xs: 6, md: 10 }}
        justifyContent="center"
        alignItems="center"
        container
      >
        <Grid item md={10} lg={8} mx="auto">

          <TypographyH1 sx={{ mb: 2 }} variant="h1">
           Forgot Password
          </TypographyH1>
          <TypographyH2
            sx={{ lineHeight: 1.5, pb: 4 }}
            variant="h4"
            color="text.secondary"
            fontWeight="normal"
          ></TypographyH2>

          <ForgetPassword />
          <Button
            component={RouterLink}
            to="/login"
            size="large"
            
          >
            Go to Login
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ChangeForgetPassword;
