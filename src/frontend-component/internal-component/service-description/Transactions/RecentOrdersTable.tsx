import { FC, ChangeEvent, useState } from "react";
import PropTypes from "prop-types";
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
  CardHeader,
} from "@mui/material";

import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { useMutation, useQuery } from "@apollo/client";
import { errorToast, successToast } from "src/utils/toaster";
import SuspenseLoader from "src/components/SuspenseLoader";
import { useNavigate } from "react-router";
import { deleteServiceDescription } from "src/hook/mutations/service-description";
import { ServiceDesciptionModule } from "src/hook/query/service-description";
import Swal from "sweetalert2";

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
  const [deleteFooter, { loading }] = useMutation(deleteServiceDescription,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });
  const { loading: delteLoading, refetch } = useQuery(ServiceDesciptionModule,{
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
          const result = await deleteFooter({
            variables: {
              deleteServiceDescritionId: id,
            },
          });
          if (result.data) {
            Swal.fire("Deleted!", "Your brief has been deleted.", "success");
            refetch();
          }
        }
      });
    } catch (error) {
      errorToast("Something went wrong");
    }
  };
  const editServices = (id: string) => {
    navigate(`/auth/editServiceDescription/${id}`);
  };
  return (
    <Card>
      <CardHeader action={<Box width={150}></Box>} title="Brief" />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell >Heading</TableCell>
              <TableCell>Subheading</TableCell>
              <TableCell>Text</TableCell>
              <TableCell>Button Text</TableCell>
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
                
                    >
                      {cryptoOrder.serviceName}
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
                      {cryptoOrder.serviceSubheading}
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
                      {cryptoOrder.serviceDescription}
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
                      {cryptoOrder.serviceButton}
                    </Typography>
                  </TableCell>

                  <TableCell align="right" width="120px">
                    <Tooltip title="Edit home page breif" arrow>
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
                    <Tooltip title="Delete home page breif" arrow>
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
        {paginatedCryptoOrders.length? "":
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          flexWrap={"wrap"}
          sx={{ textAlign: "center" ,m: 1}}
        >
          Please add your home page brief
        </Typography>}
      </TableContainer>
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
