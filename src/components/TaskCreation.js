'use client'
import { Box, Button, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';
import CreateTask from './CreateTask';
import ViewTask from './ViewTask';
import Dashboard from './Dashboard';

const TaskCreation = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue)

    }


    return (
        <div>
            <Box
                sx={{
                    backgroundColor: '#f5f5f5',
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    marginBottom: 3,
                    textAlign: 'center',
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="primary"
                    sx={{ fontSize: '28px', letterSpacing: 1 }}
                >
                    Task Management
                </Typography>
            </Box>

            <Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Tabs value={selectedTab}
                        onChange={handleTabChange}
                        centered
                        sx={{ marginBottom: 3 }}  >
                        <Tab label="Create Task" />
                        <Tab label="View Task  " />
                        <Tab label="Dashboard" />
                    </Tabs>

                </Box>

                <Box sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                  <Box sx={{display:'flex'}}>
                  {selectedTab === 0 && <CreateTask />}
                    {selectedTab === 1 && <ViewTask />}
                    {selectedTab === 2 && <Dashboard />}
                  </Box>
                </Box>
            </Box>
        </div>
    );
};

export default TaskCreation;
