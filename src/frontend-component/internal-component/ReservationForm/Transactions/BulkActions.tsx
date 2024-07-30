import { useState, useRef } from "react";
import { Box, Menu, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { useMutation, useQuery } from "@apollo/client";
import SuspenseLoader from "src/components/SuspenseLoader";
import { errorToast } from "src/utils/toaster";
import Swal from "sweetalert2";
import { bulkDeleteResourceMutation } from "src/hook/mutations/reservationForm";
import { resourceFormQuery } from "src/hook/query/resourceForm";

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

function BulkActions({ selectedValue }) {
  const authKey= localStorage.getItem("TOKEN")
  const [onMenuOpen, menuOpen] = useState<boolean>(false);
  const moreRef = useRef<HTMLButtonElement | null>(null);
  const [bulkResourceDelete, { loading }] = useMutation(bulkDeleteResourceMutation,{
    context:{
      headers: {
        Authorization: `Bearer ${authKey}`,
      },
    }
  });
  const { loading: serviceLoading, refetch } = useQuery(
    resourceFormQuery,{
      context:{
        headers: {
          Authorization: `Bearer ${authKey}`,
        },
      }
    }
  );
  const openMenu = (): void => {
    menuOpen(true);
  };
  if (loading || serviceLoading) {
    return <SuspenseLoader />;
  }
  const closeMenu = (): void => {
    menuOpen(false);
  };
  const bulkDelete = async () => {
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
          const result = await bulkResourceDelete({
            variables: {
              ids: selectedValue,
            },
          });
          if (result.data) {
            Swal.fire("Deleted!", "Your reservation forms has been deleted.", "success");
            refetch();
          }
        }
      });
    } catch (error) {
      errorToast("Something went wrong");
    }
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Typography variant="h5" color="text.secondary">
            Bulk actions:
          </Typography>
          <ButtonError
            sx={{ ml: 1 }}
            startIcon={<DeleteTwoToneIcon />}
            variant="contained"
            onClick={bulkDelete}
          >
            Delete
          </ButtonError>
        </Box>
      </Box>

      <Menu
        keepMounted
        anchorEl={moreRef.current}
        open={onMenuOpen}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      ></Menu>
    </>
  );
}

export default BulkActions;
