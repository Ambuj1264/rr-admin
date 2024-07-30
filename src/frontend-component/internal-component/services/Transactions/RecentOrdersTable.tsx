import { FC, ChangeEvent, useState } from "react";
import PropTypes from "prop-types";
import {
  Tooltip,
  Divider,
  Box,
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
  CardHeader,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Label from "src/components/Label";
// import { CryptoOrder, any } from 'src/models/crypto_order';
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import BulkActions from "./BulkActions";
import { BASE_URL_FOR_RESTAPI } from "src/envirement";
import { useMutation, useQuery } from "@apollo/client";
import { deleteServiceMutation } from "src/hook/mutations/deleteService";
import { errorToast, successToast } from "src/utils/toaster";
import { servicesListingQuery } from "src/hook/query/services";
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

const applyPagination = (data: any, page: number, limit: number): any => {
  const startIndex = page * limit;
  const endIndex = startIndex + limit;
  return data.slice(startIndex, endIndex);
};


const RecentOrdersTable: FC<RecentOrdersTableProps> = ({ cryptoOrders }) => {
  const authKey= localStorage.getItem("TOKEN")
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
    []
  );
    // Sorting state
    const [sorting, setSorting] = useState<any>({
      field: 'serviceName',
      order: 'asc',
    });
    const handleSort = (field: string) => {
      // If the same field is clicked, toggle the order (asc -> desc, desc -> asc)
      const order = sorting.field === field ? (sorting.order === 'asc' ? 'desc' : 'asc') : 'asc';
      setSorting({ field, order })}
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  const [deleteService, { loading, data }] = useMutation(deleteServiceMutation,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });
  const { loading: delteLoading, refetch } = useQuery(servicesListingQuery,{
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
  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== "all") {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value,
    }));
  };

  const handleSelectAllCryptoOrders = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedCryptoOrders(
      event.target.checked
        ? cryptoOrders.map((cryptoOrder) => cryptoOrder.id)
        : []
    );
  };

  const handleSelectOneCryptoOrder = (
    event: ChangeEvent<HTMLInputElement>,
    cryptoOrderId: string
  ): void => {
    if (!selectedCryptoOrders.includes(cryptoOrderId)) {
      setSelectedCryptoOrders((prevSelected) => [
        ...prevSelected,
        cryptoOrderId,
      ]);
    } else {
      setSelectedCryptoOrders((prevSelected) =>
        prevSelected.filter((id) => id !== cryptoOrderId)
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPage(0);
    setLimit(parseInt(event.target.value));
  };
  

  const filteredCryptoOrders = applyFilters(cryptoOrders, filters).filter(
    (cryptoOrder) => {
      const lowerSearchQuery = searchQuery.toLowerCase();
      const lowerServiceName = cryptoOrder?.serviceName?.toLowerCase();
      const lowerServiceDescription =
        cryptoOrder?.serviceDescription?.toLowerCase();
      const topFive = cryptoOrder?.priority
        ? cryptoOrder.priority.toString()
        : cryptoOrder.priority.toString();

      return (
        lowerServiceName.includes(lowerSearchQuery) ||
        lowerServiceDescription.includes(lowerSearchQuery) ||
        topFive.includes(lowerSearchQuery)
      );
    }
  );

  const paginatedCryptoOrders = applyPagination(filteredCryptoOrders, page, limit);
  const selectedSomeCryptoOrders =
    selectedCryptoOrders.length > 0 && selectedCryptoOrders.length < cryptoOrders.length;
  const selectedAllCryptoOrders = selectedCryptoOrders.length === cryptoOrders.length;
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
          const response = await deleteService({
            variables: {
              deleteServicesId: id,
            },
          });

          if (response.data) {
            Swal.fire("Deleted!", "Your service has been deleted.", "success");
            refetch();
          }
        }
      });
    } catch (error) {
      errorToast("Something went wrong");
    }
  };

  const editServices = (id: string) => {
    navigate(`/auth/editServices/${id}`);
  };
  const sortedCryptoOrders = [...paginatedCryptoOrders].sort((a, b) => {
    if (sorting.order === 'asc') {
      return a[sorting?.field]?.localeCompare(b[sorting.field]);
    } else {
      return b[sorting?.field]?.localeCompare(a[sorting.field]);
    }
  });
  return (
    <Card>
      {selectedBulkActions &&
        (paginatedCryptoOrders.length ? (
          <Box flex={1} p={2}>
            <BulkActions selectedValue={selectedCryptoOrders} />
          </Box>
        ) : (
          ""
        ))}
      <CardHeader
        action={
          <>
            <Box width={150}></Box>
            <TextField
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </>
        }
        title="Preview"
      />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllCryptoOrders}
                  indeterminate={selectedSomeCryptoOrders}
                  onChange={handleSelectAllCryptoOrders}
                />
              </TableCell>
              <TableCell onClick={() => handleSort('serviceName')} sx={{ cursor: 'pointer' }}>
                Service Name
                {sorting?.field === 'serviceName' && (
                  <span>
                    {sorting?.order === 'asc' ? ' ▲' : ' ▼'}
                  </span>
                )}
              </TableCell>
              <TableCell onClick={() => handleSort('serviceDescription')} sx={{ cursor: 'pointer' }}>
                Service Description
                {sorting?.field === 'serviceDescription' && (
                  <span>
                    {sorting?.order === 'asc' ? ' ▲' : ' ▼'}
                  </span>
                )}
              </TableCell>
              <TableCell>Top Five</TableCell>

              <TableCell align="center">Service Image</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCryptoOrders.map((cryptoOrder) => {
              const isCryptoOrderSelected = selectedCryptoOrders.includes(
                cryptoOrder.id
              );
              return (
                <TableRow
                  hover
                  key={cryptoOrder.id}
                  selected={isCryptoOrderSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isCryptoOrderSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneCryptoOrder(event, cryptoOrder.id)
                      }
                      value={isCryptoOrderSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      flexWrap={"wrap"}
                      width="200px"
                    >
                      {cryptoOrder?.serviceName.charAt(0).toUpperCase() + cryptoOrder?.serviceName.slice(1)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      flexWrap={"wrap"}
                      width="300px"
                    >
                      {cryptoOrder.serviceDescription}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      flexWrap={"wrap"}
                      width="70px"
                      sx={{
                        background: theme.colors.primary.lighter,
                        borderRadius: "30px",
                        textAlign: "center",
                        color: cryptoOrder.priority
                          ? theme.palette.success.main
                          : theme.palette.primary.main,
                      }}
                    >
                      {cryptoOrder.priority ? "True" : "False"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <img
                      src={`${BASE_URL_FOR_RESTAPI}/upload/${cryptoOrder.serviceImageName}`}
                      alt="image"
                      width="175px"
                      height="99px"
                      style={{ borderRadius: "10px" }}
                    />
                  </TableCell>

                  <TableCell align="right" sx={{ minWidth: "100px" }}>
                    <Tooltip title="Edit Services" arrow>
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
                    <Tooltip title="Delete Service" arrow>
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
        <Box p={2}>
          <TablePagination
            component="div"
            count={filteredCryptoOrders.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[2, 10, 25, 30]}
          />
        </Box>
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
