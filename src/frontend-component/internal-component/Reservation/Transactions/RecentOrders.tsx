import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import { useQuery } from '@apollo/client';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { getAllReservationQuery } from 'src/hook/query/reservation';

function RecentOrders() {
  const authKey= localStorage.getItem("TOKEN");
  const {loading,data}= useQuery(getAllReservationQuery,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  })
  if(loading){
    return <SuspenseLoader />
  }
  const cryptoOrders: any =data?.getAllReservation
  return (
    <Card>
      <RecentOrdersTable cryptoOrders={cryptoOrders} />
    </Card>
  );
}

export default RecentOrders;
