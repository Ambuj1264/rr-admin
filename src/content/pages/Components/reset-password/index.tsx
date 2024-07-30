
import { Box, Container, Card } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import ChangeResetPassword from './ChangeResetPassword';
const OverviewWrapper = styled(Box)(
  () => `
    overflow: auto;
    flex: 1;
    overflow-x: hidden;
    align-items: center;
`
);

function ResetPaswordOverview() {
  return (
    <OverviewWrapper>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" py={5} alignItems="center">
        </Box>
        <Card sx={{ p: 10, mb: 10, borderRadius: 12 }}>
          <ChangeResetPassword />
        </Card>
      </Container>
    </OverviewWrapper>
  );
}

export default ResetPaswordOverview;