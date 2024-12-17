'use client'
import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, CircularProgress } from '@mui/material';
import { Pie } from 'react-chartjs-2'; // Import the Pie chart component
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks from the server
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:8002/api/getalltask');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTaskData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Task count statistics
  const totalTasks = taskData.length;
  const completedTasks = taskData.filter(task => task.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;

  // Prepare data for Pie Chart (tasks by status)
  const chartData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completedTasks, pendingTasks],
        backgroundColor: ['#4caf50', '#f44336'],
        borderWidth: 1,
      },
    ],
  };

  if (loading) return <CircularProgress color="primary" />;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', padding: 3 }}>
      {/* Dashboard Title */}
      <Typography variant="h3" color="primary" gutterBottom align="center">
        Dashboard
      </Typography>

      {/* Task Summary Section */}
      <Grid container spacing={3} justifyContent="center">
        {/* Total Tasks */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={6} sx={{ padding: 3, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
            <Typography variant="h6" color="textSecondary">Total Tasks</Typography>
            <Typography variant="h4" color="primary" fontWeight="bold">{totalTasks}</Typography>
          </Paper>
        </Grid>

        {/* Completed Tasks */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={6} sx={{ padding: 3, backgroundColor: '#c8e6c9', borderRadius: 2 }}>
            <Typography variant="h6" color="textSecondary">Completed Tasks</Typography>
            <Typography variant="h4" color="primary" fontWeight="bold">{completedTasks}</Typography>
          </Paper>
        </Grid>

        {/* Pending Tasks */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={6} sx={{ padding: 3, backgroundColor: '#ffccbc', borderRadius: 2 }}>
            <Typography variant="h6" color="textSecondary">Pending Tasks</Typography>
            <Typography variant="h4" color="primary" fontWeight="bold">{pendingTasks}</Typography>
          </Paper>
        </Grid>
        
      </Grid>

      {/* Task Status Pie Chart */}
      <Grid container spacing={3} marginTop={5} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Paper elevation={6} sx={{ padding: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom align="center">Task Status</Typography>
            {/* Display the Pie chart */}
            <Pie data={chartData} />
          </Paper>
        </Grid>
      </Grid>

      {/* Task Table */}
      <Typography variant="h5" marginTop={5} gutterBottom color="primary">
        Tasks List
      </Typography>
      {/* <TaskTable taskData={taskData} /> */}
    </Box>
  );
};

export default Dashboard;
