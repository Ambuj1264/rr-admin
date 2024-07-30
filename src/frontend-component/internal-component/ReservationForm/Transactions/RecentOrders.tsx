import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import { useQuery } from '@apollo/client';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { resourceFormQuery } from 'src/hook/query/resourceForm';


function RecentOrders() {
  const authKey= localStorage.getItem("TOKEN");
  const {loading,data}= useQuery(resourceFormQuery,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  })
  if(loading){
    return <SuspenseLoader />
  }
  const cryptoOrders: any =data?.reservationFormAllData
  return (
    <Card>
      <RecentOrdersTable cryptoOrders={cryptoOrders} />
    </Card>
  );
}

export default RecentOrders;
