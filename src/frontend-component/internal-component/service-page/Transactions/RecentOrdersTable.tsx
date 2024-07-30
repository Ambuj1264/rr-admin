import { FC, ChangeEvent, useState } from "react";
import PropTypes from "prop-types";
import {
  Tooltip,
  Divider,
  Box,
  Card,
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
  CardHeader,
} from "@mui/material";

import Label from "src/components/Label";
// import { CryptoOrder, any } from 'src/models/crypto_order';
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { BASE_URL_FOR_RESTAPI } from "src/envirement";
import { useMutation, useQuery } from "@apollo/client";
import {  delteServicePageDescription } from "src/hook/mutations/deleteService";
import { errorToast } from "src/utils/toaster";
import { servicePageDetails } from "src/hook/query/services";
import SuspenseLoader from "src/components/SuspenseLoader";
import { useNavigate } from "react-router";
import { sweetSuccessAlert } from "src/utils/sweetAlert";
// import Swal from "sweetalert2";
import Swal from "sweetalert2/dist/sweetalert2.js";

import "sweetalert2/src/sweetalert2.scss";

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
      text: "Failed",
      color: "error",
    },
    completed: {
      text: "Completed",
      color: "success",
    },
    pending: {
      text: "Pending",
      color: "warning",
    },
  };

  const { text, color }: any = map[any];

  return <Label color={color}>{text}</Label>;
};

const applyFilters = (cryptoOrders: any, filters: Filters): any => {
  
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
  const authKey= localStorage.getItem("TOKEN")
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null,
  });
  const navigate = useNavigate();
  const [deleteServicePage, { loading }] = useMutation(delteServicePageDescription,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });
  const { loading: delteLoading, refetch } = useQuery(servicePageDetails,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });

  const statusOptions = [
    {
      id: "all",
      name: "All",
    },
    {
      id: "completed",
      name: "Completed",
    },
    {
      id: "pending",
      name: "Pending",
    },
    {
      id: "failed",
      name: "Failed",
    },
  ];
  if (loading || delteLoading) {
    return <SuspenseLoader />;
  }

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredCryptoOrders = applyFilters(cryptoOrders, filters);
  const paginatedCryptoOrders = applyPagination(
    filteredCryptoOrders,
    page,
    limit
  );

  const theme = useTheme();
  const delteService = async (id: string) => {
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
          const response = await deleteServicePage({
            variables: {
              deleteServicesPageDescriptionId: id,
            },
          });

          if (response.data) {
      
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
            refetch();
          }
        }
      });
    } catch (error) {
      errorToast("Something went wrong");
    }
  };

  const editServices = (id: string) => {
    navigate(`/auth/editService-page/${id}`);
  };
  return (
    <Card>
      <CardHeader action={<Box width={150}></Box>} title="Preview" />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Service Description</TableCell>
              <TableCell align="left">Service Banner</TableCell>
              <TableCell align="right">Actions</TableCell>
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
                      width="600px"
                    >
                      {cryptoOrder.serviceDescription}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <img
                      src={`${BASE_URL_FOR_RESTAPI}/upload/${cryptoOrder.serviceBanner}`}
                      alt="image"
                      width="175px"
                      height="99px"
                      style={{ borderRadius: "10px" }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title="Edit service page" arrow>
                      <IconButton
                        onClick={() => editServices(cryptoOrder?.id)}
                        sx={{
                          "&:hover": {
                            background: theme.colors.primary.lighter,
                          },
                          color: theme.palette.primary.main,
                        }}
                        color="inherit"
                        size="small"
                      >
                        <EditTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Service page" arrow>
                      <IconButton
                        onClick={() => delteService(cryptoOrder?.id)}
                        sx={{
                          "&:hover": { background: theme.colors.error.lighter },
                          color: theme.palette.error.main,
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
      {paginatedCryptoOrders.length?  "":
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          flexWrap={"wrap"}
          sx={{ textAlign: "center" ,m: 1}}
        >
          Please add service page
        </Typography>}
    </Card>
  );
};

RecentOrdersTable.propTypes = {
  cryptoOrders: PropTypes.array.isRequired,
};

RecentOrdersTable.defaultProps = {
  cryptoOrders: [],
};

export default RecentOrdersTable;
