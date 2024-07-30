import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import { useQuery } from '@apollo/client';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { footerQuery } from 'src/hook/query/footer';


function RecentOrders() {
  const authKey= localStorage.getItem("TOKEN");
  const {loading,data}= useQuery(footerQuery,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  })
  if(loading){
    return <SuspenseLoader />
  }
  let cryptoOrders: any =[data?.footerData]
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
