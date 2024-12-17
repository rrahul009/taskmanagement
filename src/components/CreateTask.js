import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

const CreateTask = () => {
    const [priority, setPriority] = useState('low');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    // Form validation check
    const isFormInvalid = !title || !description || !dueDate;

    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
    };

    const handleSubmit = async () => {
        const taskData = {
            title,
            description,
            dueDate,
            priority,
        };

        try {
            const res = await fetch('http://localhost:8000/api/addtask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // Setting content type to JSON
                },
                body: JSON.stringify(taskData),  // Send the task data as JSON
            });

            const resData = await res.json();  // Parse JSON response
            console.log(resData);  // Log the response from the backend

            if (res.ok) {
                alert('Task added successfully!'); // Show success message
                setDescription("");
                setTitle("")
                setDueDate("")
                setPriority("")
            } else {
                alert('Failed to add task!');  // Show error message
            }
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred while adding the task.');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Paper sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '450px', p: 3 }}>
                <Typography variant="h6" gutterBottom>Add Task</Typography>
                <TextField
                    label="Title"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    label="Description"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    id="dueDate"
                    label="Due Date"
                    variant="outlined"
                    type="date"
                    margin="normal"
                    fullWidth
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="priority-label">Priority</InputLabel>
                    <Select
                        labelId="priority-label"
                        id="priority"
                        label="Priority"
                        value={priority}
                        onChange={handlePriorityChange}
                    >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                    </Select>
                </FormControl>
                <Box sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isFormInvalid}
                    >
                        Submit
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default CreateTask;
