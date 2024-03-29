import React from "react";
import { useEffect, useState } from "react";
import { Alert, Button, Snackbar } from "@mui/material";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import TablePagination from "@mui/material/TablePagination";

const ApproversTable = (props) => {
  const [approvers, setApprover] = useState([]);
  const [searchedVal, setSearchedVal] = useState("");
  const [reloadApprovers, setReloadApprovers] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, type: "success" });
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/approver`)
      .then((res) => {
        var approverList = [];
        res.data.forEach((approver, index) => {
          if (approver.status == "active") {
            approverList.push(approver);
          }
        });
        setApprover([...approverList]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reloadApprovers]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const newAccount = () => {
    navigate(`../admin/create_account`, {
      state: { userType: props.userType },
    });
  };

  //hard delete
  // const deleteApprover = (id) => {
  //   axios
  //     .delete(`http://localhost:8080/api/approver/${id}`)
  //     .then((res) => {
  //       console.log(res.data);
  //       alert("Admin successfully deleted");
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const deactivateApprover = (approver) => {
    axios
      .put(`http://localhost:8080/api/user/${approver.userId}`, {
        name: approver.name,
        email: approver.email,
        phoneNo: approver.phoneNo,
        password: approver.password,
        address: approver.address,
        industry: approver.industry,
        status: "inactive",
      })
      .then((res) => {
        console.log(res.data);
        setReloadApprovers(!reloadApprovers);
        setSnackbar({ open: true, type: "success" });
      })
      .catch((err) => {
        console.log(err);
        setSnackbar({ open: true, type: "error" });
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const editApprover = (id) => {
    navigate(`../admin/edit_account?id=${id}`, {
      state: { userType: props.userType },
    });
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <TextField
          label="Search"
          sx={{ mb: 4 }}
          onChange={(e) => setSearchedVal(e.target.value)}
        />
        <div className="row align-items-center">
          <Button variant="contained" color="primary" onClick={newAccount}>
            <Add />
            New
          </Button>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {approvers
              .filter(
                (row) =>
                  !searchedVal.length ||
                  row.name
                    .toString()
                    .toLowerCase()
                    .includes(searchedVal.toString().toLowerCase()) ||
                  row.email
                    .toString()
                    .toLowerCase()
                    .includes(searchedVal.toString().toLowerCase())
              )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => {
                // if (item.status === "active") {
                return (
                  <TableRow
                    key={item.userId}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell>{item.userId}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.phoneNo}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "#93C019" }}
                        onClick={() => editApprover(item.userId)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => deactivateApprover(item)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
                // }
                // return null;
              })}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={approvers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.type}
          sx={{ width: "100%" }}
        >
          {snackbar.type === "success"
            ? "Approver successfully deleted."
            : "Error deleting approver."}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ApproversTable;
