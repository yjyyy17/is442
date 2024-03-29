import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import VendorsTable from "./VendorsTable";
import AdminsTable from "./AdminsTable";
import ApproversTable from "./ApproversTable";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function UserAccountTabs(props) {
  const [value, setValue] = React.useState(props.prevViewedTab);
  console.log(props.prevViewedTab);
  const handleChange = (event, newValue) => {
    console.log("value:", newValue);
    setValue(newValue);
  };


  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Vendor" {...a11yProps(0)} />
          <Tab label="Admin" {...a11yProps(1)} />
          <Tab label="Approver" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <VendorsTable userType={value} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AdminsTable userType={value} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ApproversTable userType={value} />
      </TabPanel>
    </Box>
  );
}
