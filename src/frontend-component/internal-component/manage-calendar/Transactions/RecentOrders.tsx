import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import { useQuery } from '@apollo/client';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { manageSlotsQuery } from 'src/hook/query/slot';


function RecentOrders() {
  const authKey= localStorage.getItem("TOKEN");
  const {loading,data}= useQuery(manageSlotsQuery,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  })
  if(loading){
    return <SuspenseLoader />
  }
  const cryptoOrders: any =data?.allSlots
  return (
    <Card>
      <RecentOrdersTable cryptoOrders={cryptoOrders} />
    </Card>
  );
}

export default RecentOrders;
