import React, { useState, useEffect } from "react";
import {
  Typography,
  Divider,
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  InputAdornment,
} from "../../../mui";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import getVendorWorkflows from "../../../services/getVendorWorkflows"

const ViewWorkflows = (props) => {
  const { viewIndivWorkflow } = props;
  const [searchInput, setSearchInput] = useState("");
  const userId = sessionStorage.getItem("userId");
  const [workflowData, setWorkflowData] = useState([])


  useEffect(() => {
      const fetchData = async () => {
        const data = await getVendorWorkflows(userId);
        setWorkflowData(data);
      };
  
      fetchData();
    });


  function handleWorkflowClick(wf) {
    // pass workflowID to Vendor component
    viewIndivWorkflow(wf);
  }

  return (
    <>
      <Typography variant='h5' sx={{ pb: 4 }}>
        Your workflow(s)
      </Typography>
      <Divider sx={{ mb: 4 }}/>

      {workflowData.map((wf) => (
        <>
        {wf.evaluationStatus === "Assigned to vendor" && (
        <Card sx={{ p: 3, mb: 5 }} key={wf.workflow.workflowId}>
          <CardContent>
            <Typography variant='h6'>{wf.workflow.title}</Typography>
            <br></br>
            <Typography sx={{ color: "grey" }}>Status: {wf.evaluationStatus}</Typography>
            {wf.status === "Rejected" && (
              <Typography sx={{ color: "grey" }}>
                Reason: {wf.reason}
              </Typography>
            )}
            <br></br>
            <Typography sx={{ color: "grey" }}>{wf.workflow.description}</Typography>
          </CardContent>
          <CardActions>
            <Link
              to={"indiv_workflow"}
              style={{ textDecoration: "none" }}
              state={{ data: wf }}
            >
              <Button variant='text' onClick={() => handleWorkflowClick(wf)}>
                Complete
              </Button>
            </Link>
          </CardActions>
        </Card>
        )}
        </>
      ))}
    </>
  );
};

export default ViewWorkflows;
