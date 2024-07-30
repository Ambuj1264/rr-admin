import { FC, ChangeEvent, useState } from 'react';
// import { format } from 'date-fns';
// import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  useTheme,
  CardHeader
} from '@mui/material';

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useMutation, useQuery } from '@apollo/client';
import { errorToast, successToast } from 'src/utils/toaster';
import  SuspenseLoader  from 'src/components/SuspenseLoader';
import { useNavigate } from 'react-router';
import { deleteFooterMutation } from 'src/hook/mutations/footer';
import { footerQuery } from 'src/hook/query/footer';
import Swal from 'sweetalert2';

interface RecentOrdersTableProps {
  className?: string;
  cryptoOrders: any;
}

interface Filters {
  status?: any;
}

const getStatusLabel = (any: any): JSX.Element => {
  const map = {
    failed: {
      text: 'Failed',
      color: 'error'
    },
    completed: {
      text: 'Completed',
      color: 'success'
    },
    pending: {
      text: 'Pending',
      color: 'warning'
    }
  };

  const { text, color }: any = map[any];

  return <Label color={color}>{text}</Label>;
};

const applyFilters = (
  cryptoOrders: any,
  filters: Filters
): any => {
  return cryptoOrders.filter((cryptoOrder) => {
    let matches = true;

    if (filters.status && cryptoOrder.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  cryptoOrders: any,
  page: number,
  limit: number
): any => {
  return cryptoOrders.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({ cryptoOrders }) => {
  const authKey= localStorage.getItem("TOKEN");
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null
  });
  const navigate= useNavigate()
  const [deleteFooter, {loading}]= useMutation(deleteFooterMutation,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  })
  const {loading:delteLoading, refetch}= useQuery(footerQuery,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  })

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'completed',
      name: 'Completed'
    },
    {
      id: 'pending',
      name: 'Pending'
    },
    {
      id: 'failed',
      name: 'Failed'
    }
  ];
  if(loading || delteLoading){
    return <SuspenseLoader />
  }


  const handleSelectOneCryptoOrder = (
    event: ChangeEvent<HTMLInputElement>,
    cryptoOrderId: string
  ): void => {
    if (!selectedCryptoOrders.includes(cryptoOrderId)) {
      setSelectedCryptoOrders((prevSelected) => [
        ...prevSelected,
        cryptoOrderId
      ]);
    } else {
      setSelectedCryptoOrders((prevSelected) =>
        prevSelected.filter((id) => id !== cryptoOrderId)
      );
    }
  };


  const filteredCryptoOrders = applyFilters(cryptoOrders, filters);
  const paginatedCryptoOrders = applyPagination(
    filteredCryptoOrders,
    page,
    limit
  );
  const selectedSomeCryptoOrders =
    selectedCryptoOrders.length > 0 &&
    selectedCryptoOrders.length < cryptoOrders.length;
  const selectedAllCryptoOrders =
    selectedCryptoOrders.length === cryptoOrders.length;
  const theme = useTheme();
  const delteService=async(id:string)=>{
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const result = await deleteFooter({
            variables:{
              deleteFooterId:id
    
            }
          })
          if (result.data) {
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
            refetch();
          }
        }
      });
    } catch (error) {
      errorToast("Something went wrong")
    }    
  }
  const editServices =(id:string)=>{
    navigate(`/auth/editFooter/${id}`)
  }
  return (
    
    <Card>
    
      <CardHeader
          action={
            <Box width={150}>
            </Box>
          }
          title="Footer listing"
        />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              
              <TableCell width="200px">Brand Name</TableCell>
              <TableCell  width="200px">Footer Description</TableCell>
              <TableCell  width="200px">Facebook Url</TableCell>
              <TableCell width="200px">Linkedin Url</TableCell>
              <TableCell width="200px">Twitter Url</TableCell>
              <TableCell width="200px">Instagram Url</TableCell>
            <TableCell  align='left' width="200px">Actions</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCryptoOrders.map((cryptoOrder) => {
              const isCryptoOrderSelected = selectedCryptoOrders.includes(
                cryptoOrder.id
              );
              return (
                <TableRow
                  hover
                  key={cryptoOrder.id}
                  selected={isCryptoOrderSelected}
                >
                 
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      flexWrap={"wrap"}
                      width="200px"
                    >
                      {cryptoOrder.footerLogo}
                    </Typography>
                   
                  </TableCell>
                  <TableCell  >
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      flexWrap={"wrap"}
                      width="200px"
                    >
                      {cryptoOrder.footerDescription }
                    </Typography>
                  </TableCell>
                  <TableCell  >
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      width="200px"
                      flexWrap={"wrap"}
                    >
                      {cryptoOrder.socialMedia[0].facebook }
                    </Typography>
                  </TableCell>
                  <TableCell  >
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      flexWrap={"wrap"}
                      width="200px"
                    >
                      {cryptoOrder.socialMedia[0].linkedin }
                    </Typography>
                  </TableCell>
               
                  <TableCell  >
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      flexWrap={"wrap"}
                      width="200px"
                    >
                      {cryptoOrder.socialMedia[0].twitter }
                    </Typography>
                  </TableCell>
                  <TableCell  >
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      width="200px"
                      flexWrap={"wrap"}
                     
                    >
                      {cryptoOrder.socialMedia[0].instagram }
                    </Typography>
                  </TableCell>
               
                
                  <TableCell sx={{minWidth:"100px"}}>
                    <Tooltip title="Edit footer" arrow >
                      <IconButton 
                      onClick={()=>editServices(cryptoOrder?.id)}
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter
                          },
                          color: theme.palette.primary.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <EditTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Footer" arrow>
                      <IconButton
                      onClick={()=>delteService(cryptoOrder?.id)}
                        sx={{
                          '&:hover': { background: theme.colors.error.lighter },
                          color: theme.palette.error.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <DeleteTwoToneIcon fontSize="medium" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {paginatedCryptoOrders.length? "":
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          flexWrap={"wrap"}
          sx={{ textAlign: "center" ,m: 1}}
        >
          Please add your footer
        </Typography>}
    </Card>
  );
};

RecentOrdersTable.propTypes = {
  cryptoOrders: PropTypes.array.isRequired
};

RecentOrdersTable.defaultProps = {
  cryptoOrders: []
};

export default RecentOrdersTable;
