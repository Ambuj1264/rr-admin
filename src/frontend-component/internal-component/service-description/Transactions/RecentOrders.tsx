import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import { useQuery } from '@apollo/client';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { ServiceDesciptionModule } from 'src/hook/query/service-description';

function RecentOrders() {
  const authKey= localStorage.getItem("TOKEN");
  const {loading,data}= useQuery(ServiceDesciptionModule,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  })
  if(loading){
    return <SuspenseLoader />
  }
  let cryptoOrders: any =[data?.serviceDesciptionModule]
  if (JSON.stringify(cryptoOrders) === JSON.stringify([null])) {
    cryptoOrders = [];
  }
  return (
    <Card>
      <RecentOrdersTable cryptoOrders={cryptoOrders} />
    </Card>
  );
}

export default RecentOrders;
