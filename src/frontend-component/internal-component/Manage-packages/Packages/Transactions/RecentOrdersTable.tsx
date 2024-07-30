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

import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import BulkActions from "./BulkActions";
import { useMutation, useQuery } from "@apollo/client";
import { errorToast } from "src/utils/toaster";
import SuspenseLoader from "src/components/SuspenseLoader";
import { useNavigate } from "react-router";
import Swal from "sweetalert2/dist/sweetalert2.js";

import "sweetalert2/src/sweetalert2.scss";
import { deletePackagesMuatation } from "src/hook/mutations/prakages";
import { packagesQueryListing } from "src/hook/query/packages";

interface RecentOrdersTableProps {
  className?: string;
  cryptoOrders: any;
}

interface Filters {
  status?: any;
}

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
  const [searchQuery, setSearchQuery] = useState<string>("");
   // Sorting state
   const [sorting, setSorting] = useState<any>({
    field: 'services_serviceName',
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
  const navigate = useNavigate();
  const [deleteItems, { loading }] = useMutation(deletePackagesMuatation,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });
  const { loading: delteLoading, refetch } = useQuery(packagesQueryListing,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });

  if (loading || delteLoading) {
    return <SuspenseLoader />;
  }

  const handleSelectAllCryptoOrders = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedCryptoOrders(
      event.target.checked
        ? cryptoOrders.map((cryptoOrder) => cryptoOrder.packages_id)
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
      const lowerServiceName = cryptoOrder?.services_serviceName?.toLowerCase();
      const lowerServiceDescription = cryptoOrder?.packages_items
        ?.map((item: any) => item?.value)
        .join(" ")
        ?.toLowerCase();

      return (
        lowerServiceName?.includes(lowerSearchQuery) ||
        lowerServiceDescription?.includes(lowerSearchQuery)
      );
    }
  );
  const paginatedCryptoOrders = applyPagination(filteredCryptoOrders, page, limit);
  const selectedSomeCryptoOrders =
    selectedCryptoOrders.length > 0 && selectedCryptoOrders.length < cryptoOrders.length;
  const selectedAllCryptoOrders = selectedCryptoOrders.length === cryptoOrders.length;
  const theme = useTheme();
  const delteItem = async (id: string) => {
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
          const response = await deleteItems({
            variables: {
              deletePackageId: id,
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
  const sortedCryptoOrders = [...paginatedCryptoOrders].sort((a, b) => {
    if (sorting.order === 'asc') {
      return a[sorting?.field]?.localeCompare(b[sorting.field]);
    } else {
      return b[sorting?.field]?.localeCompare(a[sorting.field]);
    }
  });
  const editServices = (id: string) => {
    navigate(`/auth/packages/editPackages/${id}`);
  };
  console.log(selectedBulkActions, paginatedCryptoOrders,"afasdfasdfsd  ")
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
        title="Packages listing"
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
              <TableCell onClick={() => handleSort('services_serviceName')} sx={{ cursor: 'pointer' }} width="200px">
                Service Name
                {sorting?.field === 'services_serviceName' && (
                  <span>
                    {sorting?.order === 'asc' ? ' ▲' : ' ▼'}
                  </span>
                )}</TableCell>
              <TableCell align="left" width="300px">
                Item Names
              </TableCell>
              <TableCell width="30px">Basic Package</TableCell>
              <TableCell width="30px">Deluxe Package</TableCell>
              <TableCell width="30px">Super Deluxe Package</TableCell>
              <TableCell width="200px">Basic Package Price($)</TableCell>
              <TableCell width="200px">Deluxe Package Price($)</TableCell>
              <TableCell width="200px">Super Deluxe Package Price($)</TableCell>
              <TableCell width="130px">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCryptoOrders.map((cryptoOrder) => {
              const isCryptoOrderSelected = selectedCryptoOrders.includes(
                cryptoOrder.packages_id
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
                        handleSelectOneCryptoOrder(
                          event,
                          cryptoOrder.packages_id
                        )
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
                      {cryptoOrder?.services_serviceName?.charAt(0)?.toUpperCase() + cryptoOrder?.services_serviceName?.slice(1)}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    {cryptoOrder?.packages_items?.map((item, index) => (
                      <Typography
                        key={index}
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        flexWrap={"wrap"}
                        width="210px"
                        style={{
                          border: "0px",
                        }}
                      >
                        <span
                          style={{
                            background: "rgba(85, 105, 255, 0.1)",
                            borderRadius: " 6px",
                            textAlign: "center",
                            color: "#5569ff",
                            padding: "3px",
                            fontSize: "10",
                          }}
                        >
                          {" "}
                          {item?.value}
                        </span>
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      flexWrap={"wrap"}
                      width="50px"
                    >
                      {cryptoOrder?.packages_basic ? "Added" : "NA"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      flexWrap={"wrap"}
                      width="50px"
                    >
                      {cryptoOrder?.packages_deluxe ? "Added" : "NA"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      flexWrap={"wrap"}
                      width="50px"
                    >
                      {cryptoOrder?.packages_superDeluxe ? "Added " : "NA"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      flexWrap={"wrap"}
                      width="130px"
                    >
                      {cryptoOrder?.packages_basicPackagePrice}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      flexWrap={"wrap"}
                      width="130px"
                    >
                      {cryptoOrder?.packages_deluxePackagePrice}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      flexWrap={"wrap"}
                      width="130px"
                    >
                      {cryptoOrder?.packages_superDeluxePackagePrice}
                    </Typography>
                  </TableCell>

                  <TableCell  sx={{ minWidth: "100px" }}>
                    <Tooltip title="Edit packages" arrow>
                      <IconButton
                        onClick={() => editServices(cryptoOrder?.packages_id)}
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
                    <Tooltip title="Delete packages" arrow>
                      <IconButton
                        onClick={() => delteItem(cryptoOrder?.packages_id)}
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
      {paginatedCryptoOrders.length ? (
        <Box p={2}>
          <TablePagination
            component="div"
            count={filteredCryptoOrders.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[2, 5, 25, 30]}
          />
        </Box>
      ) : (
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          flexWrap={"wrap"}
          sx={{ textAlign: "center", m: 1 }}
        >
          Please add your packages
        </Typography>
      )}
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
