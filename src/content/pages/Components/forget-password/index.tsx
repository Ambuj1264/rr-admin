
import { Box, Container, Card } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import ChangeForgetPassword from './ChangeForgetPassword';
const OverviewWrapper = styled(Box)(({}) => `
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Set the height to 100% of the viewport height */
`);

function ForgetPaswordOverview() {
  return (
    <OverviewWrapper>
    <Helmet>
      <title>Forgot Password</title>
    </Helmet>
    <Container maxWidth="lg">
      <Card sx={{ p:2, borderRadius:5 }}>
      <ChangeForgetPassword />
      </Card>
    </Container>
  </OverviewWrapper>
  );
}

export default ForgetPaswordOverview;
