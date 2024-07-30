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

import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import BulkActions from "./BulkActions";
import { useMutation, useQuery } from "@apollo/client";
import { errorToast } from "src/utils/toaster";
import SuspenseLoader from "src/components/SuspenseLoader";
import { useNavigate } from "react-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { deleteResourceMutation } from "src/hook/mutations/reservationForm";
import { resourceFormQuery } from "src/hook/query/resourceForm";

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
  const authKey = localStorage.getItem("TOKEN");
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();
  const [deleteForm, { loading }] = useMutation(deleteResourceMutation, {
    context: {
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    },
  });
  const { loading: deleteLoading, refetch } = useQuery(resourceFormQuery, {
    context: {
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    },
  });

  // Sorting state
  const [sorting, setSorting] = useState<any>({
    field: "serviceName",
    order: "asc",
  });

  if (loading || deleteLoading) {
    return <SuspenseLoader />;
  }

  const handleSelectAllCryptoOrders = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedCryptoOrders(
      event.target.checked
        ? cryptoOrders.map((cryptoOrder) => cryptoOrder.id)
        : []
    );
  };

  const handleSort = (field: string) => {
    // If the same field is clicked, toggle the order (asc -> desc, desc -> asc)
    const order =
      sorting.field === field
        ? sorting.order === "asc"
          ? "desc"
          : "asc"
        : "asc";
    setSorting({ field, order });
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
      const items = cryptoOrder?.fields || [];
      const matchesItems = items.some((item) => {
        const itemName = item?.label?.toLowerCase();
        const quantity = String(item?.required); // convert quantity to string for case-insensitive search
        return itemName?.includes(lowerSearchQuery)
        || quantity.includes(lowerSearchQuery);
      });
      return(lowerServiceName?.includes(lowerSearchQuery)||matchesItems)
    }
  );

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
          const response = await deleteForm({
            variables: {
              deleteReservationFormId: id,
            },
          });

          if (response.data) {
            Swal.fire(
              "Deleted!",
              "Your reservation form has been deleted.",
              "success"
            );
            refetch();
          }
        }
      });
    } catch (error) {
      errorToast("Something went wrong");
    }
  };

  const editServices = (id: string) => {
    navigate(`/auth/reservationForm/editReservationForm/${id}`);
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
    if (sorting.order === "asc") {
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
        title="Form Preview"
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
              <TableCell
                onClick={() => handleSort("serviceName")}
                sx={{ cursor: "pointer" }}
              >
                Service Name
                {sorting?.field === "serviceName" && (
                  <span>{sorting?.order === "asc" ? " ▲" : " ▼"}</span>
                )}
              </TableCell>
              <TableCell>Label Name | Required</TableCell>
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

                  <TableCell align="left">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      flexWrap={"wrap"}
                    >
                      {(cryptoOrder?.serviceName)?.charAt(0)?.toUpperCase() +
                        cryptoOrder?.serviceName?.slice(1)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {cryptoOrder?.fields?.map((v: any) => (
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        flexWrap={"wrap"}
                      >
                        <span
                          style={{
                            background: "rgba(85, 105, 255, 0.1)",
                            borderRadius: " 6px",
                            textAlign: "center",
                            color: "#5569ff",
                            padding: "3px",
                            fontSize: "12px",
                          }}
                        >
                          {v?.label.charAt(0).toUpperCase() +
                            v?.label?.slice(1)}{" "}
                          : {v?.required ? "True" : "False"}
                        </span>
                      </Typography>
                    ))}
                  </TableCell>

                  <TableCell>
                    <Tooltip title="Edit form" arrow>
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
                    <Tooltip title="Delete form" arrow>
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
          rowsPerPageOptions={[2, 5, 25, 30]}
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