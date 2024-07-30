import React, { FC, ChangeEvent, useState } from "react";
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
  TextField,
  useTheme,
  CardHeader,
} from "@mui/material";

import Label from "src/components/Label";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import BulkActions from "./BulkActions";
import { useMutation, useQuery } from "@apollo/client";
import { errorToast } from "src/utils/toaster";
import SuspenseLoader from "src/components/SuspenseLoader";
import { useNavigate } from "react-router";
import Swal from "sweetalert2/dist/sweetalert2.js";

import "sweetalert2/src/sweetalert2.scss";
import { deleteProductItems } from "src/hook/mutations/item";
import { productItemsListingQuery } from "src/hook/query/item";

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
  const authKey = localStorage.getItem("TOKEN")
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>([]);
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();
  const [deleteItems, { loading }] = useMutation(deleteProductItems, {
    context: {
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });
  const { loading: deleteLoading, refetch } = useQuery(productItemsListingQuery, {
    context: {
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });

  // Sorting state
  const [sorting, setSorting] = useState<any>({
    field: 'itemName',
    order: 'asc',
  });

  if (loading || deleteLoading) {
    return <SuspenseLoader />;
  }

  const handleSelectAllCryptoOrders = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedCryptoOrders(
      event.target.checked
        ? cryptoOrders.map((cryptoOrder) => cryptoOrder.id)
        : []
    );
  };

  const handleSort = (field: string) => {
    // If the same field is clicked, toggle the order (asc -> desc, desc -> asc)
    const order = sorting.field === field ? (sorting.order === 'asc' ? 'desc' : 'asc') : 'asc';
    setSorting({ field, order });
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPage(0);
    setLimit(parseInt(event.target.value));
  };

  const filteredCryptoOrders = applyFilters(cryptoOrders, filters).filter((cryptoOrder) => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    const lowerItemName = cryptoOrder?.itemName?.toLowerCase();
    const basicQuantity = cryptoOrder?.basicQuantity
      ? cryptoOrder.basicQuantity.toString()
      : "";
    const deluxeQuantity = cryptoOrder?.deluxeQuantity
      ? cryptoOrder.deluxeQuantity.toString()
      : "";
    const superDeluxeQuantity = cryptoOrder?.superDeluxeQuantity
      ? cryptoOrder.superDeluxeQuantity.toString()
      : "";

    return (
      lowerItemName?.includes(lowerSearchQuery) ||
      basicQuantity.includes(lowerSearchQuery) ||
      deluxeQuantity.includes(lowerSearchQuery) ||
      superDeluxeQuantity.includes(lowerSearchQuery)
    );
  });

  const paginatedCryptoOrders = applyPagination(filteredCryptoOrders, page, limit);
  const selectedSomeCryptoOrders =
    selectedCryptoOrders.length > 0 && selectedCryptoOrders.length < cryptoOrders.length;
  const selectedAllCryptoOrders = selectedCryptoOrders.length === cryptoOrders.length;
  const theme = useTheme();

  const deleteItem = async (id: string) => {
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
              deleteProductItemId: id,
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
    navigate(`/auth/packages/editItem/${id}`);
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
  // Update your data sorting based on the sorting state
  const sortedCryptoOrders = [...paginatedCryptoOrders].sort((a, b) => {
    if (sorting.order === 'asc') {
      return a[sorting.field]?.localeCompare(b[sorting?.field]);
    } else {
      return b[sorting.field]?.localeCompare(a[sorting?.field]);
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
        title="Items listing"
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
              <TableCell onClick={() => handleSort('itemName')} sx={{ cursor: "pointer" }}>
                Item Name
                {sorting?.field === 'itemName' && (
                  <span>
                    {sorting?.order === 'asc' ? ' ▲' : ' ▼'}
                  </span>
                )}
              </TableCell>
              <TableCell>Basic Quantity</TableCell>
              <TableCell>Deluxe Quantity</TableCell>
              <TableCell>Super Deluxe Quantity</TableCell>
              <TableCell>Actions</TableCell>
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
                      width="250px"
                    >
                      {(cryptoOrder?.itemName).charAt(0).toUpperCase() + cryptoOrder?.itemName.slice(1)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      flexWrap={"wrap"}
                    >
                      {cryptoOrder?.basicQuantity}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      flexWrap={"wrap"}
                    >
                      {cryptoOrder?.deluxeQuantity}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      flexWrap={"wrap"}
                    >
                      {cryptoOrder?.superDeluxeQuantity}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Tooltip title="Edit Item" arrow>
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
                    <Tooltip title="Delete Item" arrow>
                      <IconButton
                        onClick={() => deleteItem(cryptoOrder?.id)}
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
          rowsPerPageOptions={[5, 10, 25, 30]}
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
