import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import { useQuery } from '@apollo/client';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { packagesQueryListing } from 'src/hook/query/packages';

function RecentOrders() {
  const authKey= localStorage.getItem("TOKEN");
  const {loading,data}= useQuery(packagesQueryListing,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  }
    )
  if(loading){
    return <SuspenseLoader />
  }
  const cryptoOrders: any =data?.packagesListing
  return (
    <Card>
      <RecentOrdersTable cryptoOrders={cryptoOrders} />
    </Card>
  );
}

export default RecentOrders;
