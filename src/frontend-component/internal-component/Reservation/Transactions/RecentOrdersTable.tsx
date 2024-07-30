import React, { FC, ChangeEvent, useState } from "react";
import PropTypes from "prop-types";
import {
  Divider,
  Box,
  Card,
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

import BulkActions from "./BulkActions";

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

  // Sorting state
  const [sorting, setSorting] = useState<any>({
    field: "serviceName",
    order: "asc",
  });

  const handleSort = (field: string) => {
    const order =
      sorting?.field === field
        ? sorting?.order === "asc"
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
      const serviceName = cryptoOrder?.serviceName?.toLowerCase();
      const packageType = cryptoOrder?.packageType?.toLowerCase();
      const packagePrice = cryptoOrder?.packagePrice?.toLowerCase();
  
      const reservationFormEntries = Object.entries(cryptoOrder?.reservationForm || {});
  
      const includesSearch = (value) => value?.toLowerCase().includes(lowerSearchQuery);
      
      // Check if any reservation form key or value includes the search query
      const matchesReservationForm = reservationFormEntries.some(([key, value]) => {
        return key.toLowerCase().includes(lowerSearchQuery) || includesSearch(value);
      });
  
      // Filter based on itemName and quantity in the items array
      const items = cryptoOrder?.packages || [];
      const matchesItems = items.some((item) => {
        const itemName = item.itemName?.toLowerCase();
        const quantity = String(item.quantity); // convert quantity to string for case-insensitive search
        return itemName?.includes(lowerSearchQuery) || quantity.includes(lowerSearchQuery);
      });
  
      return (
        serviceName?.includes(lowerSearchQuery) ||
        packageType?.includes(lowerSearchQuery) ||
        packagePrice?.includes(lowerSearchQuery) ||
        matchesReservationForm ||
        matchesItems
      );
    }
  );
  
  const paginatedCryptoOrders = applyPagination(filteredCryptoOrders, page, limit);
    selectedCryptoOrders.length > 0 && selectedCryptoOrders.length < cryptoOrders.length;
  // Update your data sorting based on the sorting state
  const sortedCryptoOrders = [...paginatedCryptoOrders]?.sort((a, b) => {
    if (sorting?.order === "asc") {
      return a[sorting?.field]?.localeCompare(b[sorting?.field]);
    } else {
      return b[sorting?.field]?.localeCompare(a[sorting?.field]);
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
        title="Reservations listing"
      />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Label | Data
              </TableCell>
              <TableCell
                onClick={() => handleSort("serviceName")}
                sx={{ cursor: "pointer" }}
              >
                Service name
                {sorting?.field === "serviceName" && (
                  <span>{sorting?.order === "asc" ? " ▲" : " ▼"}</span>
                )}
              </TableCell>

              <TableCell
                onClick={() => handleSort("packagePrice")}
                sx={{ cursor: "pointer" }}
              >
                Package Price
                {sorting?.field === "packagePrice" && (
                  <span>{sorting?.order === "asc" ? " ▲" : " ▼"}</span>
                )}
              </TableCell>
              <TableCell
                onClick={() => handleSort("packageType")}
                sx={{ cursor: "pointer" }}
              >
                Pacakage Type
                {sorting?.field === "packageType" && (
                  <span>{sorting?.order === "asc" ? " ▲" : " ▼"}</span>
                )}
              </TableCell>
              <TableCell>Package (Item & quantity)</TableCell>
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
                  <TableCell>
                    {Object.entries(cryptoOrder?.reservationForm || {}).map(
                      ([key, value]) => (
                        <Typography
                          key={key}
                          variant="body1"
                          fontWeight="bold"
                          color="text.primary"
                          gutterBottom
                          flexWrap="wrap"
                          width="300px"
                        >
                          <span
                            key={key}
                            style={{
                              background: "rgba(85, 105, 255, 0.1)",
                              borderRadius: "6px",
                              textAlign: "center",
                              color: "#5569ff",
                              padding: "3px",
                              fontSize: "12px", // added 'px' for font size
                            }}
                          >
                            {`${key}: ${value}`}
                          </span>
                        </Typography>
                      )
                    )}
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
                      {cryptoOrder?.serviceName}
                    </Typography>
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
                      {cryptoOrder?.packagePrice}
                    </Typography>
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
                      {cryptoOrder?.packageType}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {cryptoOrder?.packages?.map((v: any, key: any) => (
                      <Typography
                        key={key}
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        flexWrap={"wrap"}
                        width="300px"
                      >
                        <span
                          key={key}
                          style={{
                            background: "rgba(85, 105, 255, 0.1)",
                            borderRadius: " 6px",
                            textAlign: "center",
                            color: "#5569ff",
                            padding: "3px",
                            fontSize: "12px",
                          }}
                        >
                          {v.itemName} : {v.quantity}
                        </span>
                      </Typography>
                    ))}
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
          rowsPerPageOptions={[1, 2, 25, 30]}
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
