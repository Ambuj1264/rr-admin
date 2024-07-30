import {
  Card,
  Box,
  Typography,
  Avatar,
  Grid,
  alpha,
  useTheme,
  styled
} from '@mui/material';
import Label from 'src/components/Label';
import Text from 'src/components/Text';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { useQuery } from '@apollo/client';
import { dashBoardQuery } from 'src/hook/query/dashboard';
import SuspenseLoader from 'src/components/SuspenseLoader';
import "../../../Asset/globle css/globle.css"
const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    margin: ${theme.spacing(0, 0, 1, -0.5)};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing(1)};
    padding: ${theme.spacing(0.5)};
    border-radius: 60px;
    height: ${theme.spacing(5.5)};
    width: ${theme.spacing(5.5)};
    background: ${
      theme.palette.mode === 'dark'
        ? theme.colors.alpha.trueWhite[30]
        : alpha(theme.colors.alpha.black[100], 0.07)
    };
  
    img {
      background: ${theme.colors.alpha.trueWhite[100]};
      padding: ${theme.spacing(0.5)};
      display: block;
      border-radius: inherit;
      height: ${theme.spacing(4.5)};
      width: ${theme.spacing(4.5)};
    }
`
);

function WatchListColumn() {
  const authKey= localStorage.getItem("TOKEN")
  const theme = useTheme();
  const {loading, data}= useQuery(dashBoardQuery,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
  }
});

if(loading){
  <SuspenseLoader />
}
  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      zoom: {
        enabled: false
      }
    },
    fill: {
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.1,
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0,
        stops: [0, 100]
      }
    },
    colors: [theme.colors.primary.main],
    dataLabels: {
      enabled: false
    },
    theme: {
      mode: theme.palette.mode
    },
    stroke: {
      show: true,
      colors: [theme.colors.primary.main],
      width: 2
    },
    legend: {
      show: false
    },
    labels: data?.dashboard?.totals?.map(item =>item.startDate.split('T')[0]
     
    ).reverse(),
    xaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: false,
      tickAmount: 5
    },
    tooltip: {
      x: {
        show: true
      },
      y: {
        title: {
          formatter: function () {
            return 'Price: $';
          }
        }
      },
      marker: {
        show: false
      }
    }
  };

  const chart1Data = [
    {
      name: ' Price',
      data: data?.dashboard?.totals?.map(item => {
        return parseFloat(item?.totalPackagePrice || 0); // Extract totalPackagePrice values as numbers
      }).reverse()
      
    }
  ];
 


  return (
    <Grid
      container
      direction="row"
      // justifyContent="center"
      alignItems="stretch"
      spacing={3}
    >
      <Grid item md={4} xs={12}>
        <Card
          sx={{
            overflow: 'visible',
            width:"100%"
            
          }}
        >
          <Box
            sx={{
              p: 3,
              width:"100%"
            }}
          >
            <Box display="flex" alignItems="center" style={{}}>
              <AvatarWrapper>
                <img
                  alt="BTC"
                  src="/static/images/placeholders/logo/bitcoin.png"
                />
              </AvatarWrapper>
              <Box>
                <Typography variant="h4" noWrap>
                  Rerservation
                </Typography>
                <Typography variant="subtitle1" noWrap>
                  
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                pt: 3
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  pr: 1,
                  mb: 1
                }}
              >
                {data?.dashboard?.totalReservations}
              </Typography>
              <Text color="success">
                <b> Total Reservation</b>
              </Text>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}
            >
              {/* parseInt(data) < 0 ? true : false */}
              <Label color= {parseInt(data?.dashboard?.percentageDifference)>0 ?"success":"error"}>  {(data?.dashboard?.percentageDifference)}%</Label>
              <Typography
                variant="body2"
                color= "text.secondary"
                sx={{
                  pl: 1
                }}
              >
                last 24h
              </Typography>
            </Box>
          </Box>
          <Chart
            options={chartOptions}
            series={chart1Data}
            type="area"
            height={200}
      
          />
        </Card>
      </Grid>
    
    </Grid>
  );
}

export default WatchListColumn;
