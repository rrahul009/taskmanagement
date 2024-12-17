'use client'

import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TaskModal from './model';
import { CheckBox } from '@mui/icons-material';

const ViewTask = () => {
  const [taskData, setTaskData] = useState([]); // Initialize as an empty array instead of null
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // Track selected task for editing
  const [selectedTasks, setSelectedTasks] = useState({}); // Track selected state for each task

  useEffect(() => {
    getAllData(); // Fetch data when the component mounts
  }, []);

  const getAllData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/getalltask'); // Your endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch tasks'); // Throw error if response is not OK
      }
      const resData = await response.json();
      setTaskData(resData); // Set the fetched data to state
    } catch (error) {
      setError(error.message); // Set error state
    } finally {
      setLoading(false); // Set loading to false after request
    }
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8002/api/deletetask/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete task');
        }
        // If delete is successful, remove the task from local state
        setTaskData((prevTask) => prevTask.filter((task) => task._id !== id));
        alert('Task deleted successfully');
      } catch (error) {
        setError(error.message);
        alert('Error deleting task');
      }
    }
  };

  const handleEditClick = (task) => {
    setSelectedTask(task); // Set the selected task
    setIsOpen(true); // Open the modal
  };

  // Handle checkbox change for a specific task
  const handleCheckboxChange = (taskId) => {
    setSelectedTasks((prevSelectedTasks) => ({
      ...prevSelectedTasks,
      [taskId]: !prevSelectedTasks[taskId], // Toggle the selected state for the specific task
    }));
  };

  if (loading) {
    return <div>Loading tasks...</div>; // Show loading text while data is fetching
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if there is an error
  }

  if (taskData.length === 0) {
    return <div>No tasks available.</div>; // Show if there are no tasks
  }

  return (
    <div>
      <h2>View Tasks</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Title</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Description</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Due Date</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Priority</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Created At</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Updated At</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>View/Update</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {taskData.map((task) => (
            <tr key={task._id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{task.title}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{task.description}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {new Date(task.dueDate).toLocaleDateString()}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{task.priority}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {new Date(task.createdAt).toLocaleString()}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {new Date(task.updatedAt).toLocaleString()}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <Button
                  onClick={() => handleEditClick(task)} // Pass the entire task object to handleEditClick
                  variant="contained"
                  style={{ textTransform: 'none' }}
                >
                  Update
                </Button>
                <Button
                  onClick={() => handleDeleteClick(task._id)}
                  style={{
                    backgroundColor: 'red',
                    marginLeft: '10px',
                    textTransform: 'none',
                    color: 'white',
                    '&:hover': { backgroundColor: 'darkred' },
                  }}
                >
                  Delete
                </Button>
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <input
                  type="checkbox"
                  checked={!!selectedTasks[task._id]} // Check if the task ID is in selectedTasks state
                  onChange={() => handleCheckboxChange(task._id)} // Pass the task ID to the handler
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Show modal only if isOpen is true */}
      {isOpen && selectedTask && (
        <TaskModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title={selectedTask.title}
          description={selectedTask.description}
          dueDate={selectedTask.dueDate}
          priority={selectedTask.priority}
          taskId={selectedTask._id} // Pass the task ID to the modal
        />
      )}
    </div>
  );
};

export default ViewTask;
