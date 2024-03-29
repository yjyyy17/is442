import {
  Button,
  Card,
  CardActions,
  CardContent,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const WorkflowBox = (props) => {
  const [actions, setActions] = useState([]);
  const current = new Date();
  const [snackbar, setSnackbar] = useState({ open: false, type: "success" });
  const [reloadComponent, setReloadComponent] = useState(true)

  const deleteWorkflow = (id) => {
    axios
      .put(`http://localhost:8080/api/workflow/delete/${id}`)
      .then((res) => {
        console.log(res.data);
        setReloadComponent(!reloadComponent)
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

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/workflow`)
      .then((res) => {
        setActions([])
        res.data.forEach((workflow, index) => {
          var workflowID = workflow.workflowId;
          var formStatuses = workflow.formStatuses;
          var overdueAssignees = [];
          formStatuses.forEach((fs, index) => {
            var formDueDate = new Date(fs.dueDate).getTime();
            if (formDueDate < current && !overdueAssignees.includes(fs.user.name)) {
              overdueAssignees.push(fs.user.name);
            }
            console.log(overdueAssignees);
          });
          axios
            .get(`http://localhost:8080/api/action/workflow/${workflowID}`)
            .then((res) => {
              setActions((current) => [
                ...current,
                {
                  workflow: workflow,
                  actions: res.data,
                  overdueVendors: overdueAssignees,
                },
              ]);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reloadComponent]);

  return (
    <>
      <div style={{ height: "500px", overflow: "auto" }}>
        {actions
          .filter(
            (action) =>
              !props.filterSearch.length ||
              action.workflow.title
                .toString()
                .toLowerCase()
                .includes(props.filterSearch.toString().toLowerCase())
          )
          .filter(
            (action) => !props.filterSwitch || action.overdueVendors.length > 0
          )
          .map((action, index) => {
            if (action.workflow.status == "Inactive") {
              return;
            }
            return (
              <Card sx={{ p: 3, mb: 5 }} key={index}>
                <CardContent>
                  <Typography variant="h6">{action.workflow.title}</Typography>
                  <br></br>
                  {action.overdueVendors.length != 0 && (
                    <Alert severity="error">
                      Late forms: {action.overdueVendors.length}
                      <br />
                      Late assignee(s): {action.overdueVendors.join(", ")}
                    </Alert>
                  )}
                  <Typography variant="caption">Action to be taken</Typography>
                  <Stepper activeStep={-1}>
                    {action.actions.map((oneaction) => (
                      <Step key={oneaction.actionId}>
                        <StepLabel>{oneaction.title}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </CardContent>
                <CardActions>
                  <Link
                    to={`../admin/indiv_workflow?id=${action.workflow.workflowId}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button variant="text">View</Button>
                  </Link>
                  <Link
                    onClick={() => deleteWorkflow(action.workflow.workflowId)}
                    style={{ textDecoration: "none" }}
                  >
                    <Button variant="text" color="error">
                      Delete
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            );
          })}
      </div>
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
            ? "Workflow successfully deleted."
            : "Error deleting workflow."}
        </Alert>
      </Snackbar>
    </>
  );
};

export default WorkflowBox;
