import { FC, ChangeEvent, useState } from "react";
// import { format } from 'date-fns';
// import numeral from 'numeral';
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
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader,
} from "@mui/material";

import Label from "src/components/Label";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { BASE_URL_FOR_RESTAPI } from "src/envirement";
import { useMutation, useQuery } from "@apollo/client";
import { deleteServiceMutation } from "src/hook/mutations/deleteService";
import { errorToast, successToast } from "src/utils/toaster";
import SuspenseLoader from "src/components/SuspenseLoader";
import { useNavigate } from "react-router";
import { headerDataQuery } from "src/hook/query/header";
import { deleteHeaderMutation } from "src/hook/mutations/header";
import Swal from "sweetalert2";

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
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null,
  });
  const navigate = useNavigate();
  const [deleteHeader, { loading }] = useMutation(deleteHeaderMutation,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });
  const { loading: delteLoading, refetch } = useQuery(headerDataQuery,{
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
  const selectedSomeCryptoOrders =
    selectedCryptoOrders.length > 0 &&
    selectedCryptoOrders.length < cryptoOrders.length;
  const selectedAllCryptoOrders =
    selectedCryptoOrders.length === cryptoOrders.length;
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
          const result = await deleteHeader({
            variables: {
              deleteHeaderId: id,
            },
          });
          if (result.data) {
            Swal.fire("Deleted!", "Your logo has been deleted.", "success");
            refetch();
          }
        }
      });
     
     
    } catch (error) {
      errorToast("Something went wrong");
    }
  };
  const editServices = (id: string) => {
    navigate(`/auth/editHeader/${id}`);
  };
  return (
    <Card>
      <CardHeader title="Preview" />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Logo</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCryptoOrders.map((cryptoOrder) => {
              const isCryptoOrderSelected = selectedCryptoOrders.includes(
                cryptoOrder?.id
              );
              return (
                <TableRow
                  hover
                  key={cryptoOrder?.id}
                  selected={isCryptoOrderSelected}
                >
                  <TableCell align="center">
                    <img
                      src={`${BASE_URL_FOR_RESTAPI}/upload/${cryptoOrder?.imageName}`}
                      alt="image"
                      width="160px"
                      height="99px"
                      style={{ borderRadius: "10px" }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="Edit logo" arrow>
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
                    <Tooltip title="Delete logo" arrow>
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
      {paginatedCryptoOrders.length? "":
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          flexWrap={"wrap"}
          sx={{ textAlign: "center" ,m: 1}}
        >
          Please add your logo
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
