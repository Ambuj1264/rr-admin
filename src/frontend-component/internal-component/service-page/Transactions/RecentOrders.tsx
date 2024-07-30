import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import { useQuery } from '@apollo/client';
import { servicePageDetails } from '../../../../hook/query/services';
import SuspenseLoader from 'src/components/SuspenseLoader';

function RecentOrders() {
  const authKey= localStorage.getItem("TOKEN");
  const {loading,data}= useQuery(servicePageDetails,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  })
  if(loading){
    return <SuspenseLoader />
  }
  const cryptoOrders: any =data?.servicePageDataListing

  return (
    <Card>
      <RecentOrdersTable cryptoOrders={cryptoOrders} />
    </Card>
  );
}

export default RecentOrders;
