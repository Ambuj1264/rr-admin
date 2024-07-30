import { Box, Container, Card } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import Hero from './Hero';

const OverviewWrapper = styled(Box)(({}) => `
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Set the height to 100% of the viewport height */
`);

function Overview() {
  return (
    <OverviewWrapper>
      <Helmet>
        <title>Welcome to Resource Reservation Admin Panel</title>
      </Helmet>
      <Container maxWidth="lg">
        <Card sx={{ p:2, borderRadius:5 }}>
          <Hero />
        </Card>
      </Container>
    </OverviewWrapper>
  );
}

export default Overview;
