import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import AdminTab from '../components/AdminTab';
import UserTab from '../components/UserTab';


const HomePage: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ typography: 'body1' }}>
      <Tabs value={selectedTab} onChange={handleChange}>
        <Tab label="User" />
        <Tab label="Admin" />
      </Tabs>
      <Box sx={{ padding: 2 }}>
        {selectedTab === 0 && <UserTab />}
        {selectedTab === 1 && <AdminTab />}
      </Box>
    </Box>
  );
};

export default HomePage;
