
import { Box, Container, Card, Grid } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import Registration from './registration';
const OverviewWrapper = styled(Box)(({}) => `
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Set the height to 100% of the viewport height */
`);

function RegistrationOverview() {
  return (
    <OverviewWrapper>
      <Helmet>
        <title>Registration</title>
      </Helmet>
      <Container maxWidth="lg" sx ={{marginTop:"75px"}} >
        <Card sx={{ p:2, borderRadius: 10,  }} >
          <Registration />
        </Card>
      </Container>
    </OverviewWrapper>
  );
}

export default RegistrationOverview;