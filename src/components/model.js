import * as React from 'react';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, TextField } from '@mui/material';

export default function TaskModal({
  isOpen,
  setIsOpen,
  title,
  description,
  dueDate,
  priority,
  taskId,
  handleTaskUpdate
}) {
  const rootRef = React.useRef(null);

  // Initialize state with the values passed as props
  const [taskData, setTaskData] = React.useState({
    title: title,
    description: description,
    dueDate: dueDate,
    priority: priority || 'low', // Default to 'low' if priority is not passed
  });

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Close the modal
  const handleClose = () => {
    setIsOpen(false);
  };

  // Handle save (or update) task data
  const handleSubmit = async () => {
    

    // Ensure that the taskId is available
    if (!taskId) {
      alert('Task ID is missing');
      return;
    }

    try {
      // Send PUT request to the API
      const response = await fetch(`http://localhost:8000/api/update/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Indicate the request body format
        },
        body: JSON.stringify(taskData), // Send task data as JSON
      });

      if (!response.ok) {
        throw new Error('Failed to update task'); // Handle failed response
      }

      const result = await response.json();
      alert(result.message || 'Task updated successfully'); // Display success message

      // If the update is successful, call handleTaskUpdate (optional)
      if (handleTaskUpdate) {
        handleTaskUpdate(taskId, taskData);
      }

      // Close the modal after submitting
      handleClose();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error updating task');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
      }}
      ref={rootRef}
    >
      <Modal
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="task-modal-title"
        aria-describedby="task-modal-description"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1500, // High z-index to ensure modal is on top
        }}
        container={() => rootRef.current}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            bgcolor: 'background.paper',
            boxShadow: 24,
            width: '90%',  // Adjust width for smaller screens
            maxWidth: '450px', // Max width for larger screens
            padding: 3,
            borderRadius: 2,
            zIndex: 2000, // Ensure modal content stays on top of the backdrop
            maxHeight: '90vh',
            overflow: 'auto',
          }}
        >
          <Typography variant="h6" gutterBottom>Edit Task</Typography>

          {/* Title Input */}
          <TextField
            label="Title"
            variant="outlined"
            margin="normal"
            fullWidth
            name="title"
            value={taskData.title}
            onChange={handleInputChange}
            sx={{
              marginBottom: 2, // Adds space between inputs
            }}
          />

          {/* Description Input */}
          <TextField
            label="Description"
            variant="outlined"
            margin="normal"
            fullWidth
            name="description"
            value={taskData.description}
            onChange={handleInputChange}
            sx={{
              marginBottom: 2, // Adds space between inputs
            }}
          />

          {/* Due Date Input */}
          <TextField
            id="dueDate"
            label="Due Date"
            variant="outlined"
            type="date"
            margin="normal"
            fullWidth
            name="dueDate"
            value={taskData.dueDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            sx={{
              marginBottom: 2, // Adds space between inputs
            }}
          />

          {/* Priority Input (TextField as alternative to Select) */}
          <TextField
            label="Priority"
            variant="outlined"
            margin="normal"
            fullWidth
            name="priority"
            value={taskData.priority}
            onChange={handleInputChange}
            sx={{
              marginBottom: 2, // Adds space between inputs
            }}
          />

          {/* Submit and Close Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="contained" onClick={handleSubmit} sx={{ marginRight: 1 }}>
              Save Task
            </Button>
            <Button onClick={handleClose}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
