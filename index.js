const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/Task');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost/BackendDB')
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/tasks', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get('/tasks/:id', getTask, (req, res) => {
    try {
        res.status(201).json(res.task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
    
});

app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const task = await Task.findByIdAndUpdate(id, { title, description }, { new: true });
        res.json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/tasks/:id', getTask, async (req, res) => {
    const { id } = req.params;
    try {
        await Task.findByIdAndDelete(id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getTask(req, res, next) {
    try {
        const task = await Task.findById(req.params.id);
        if (task == null) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.task = task;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
