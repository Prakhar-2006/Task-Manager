const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/tasksDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Task Schema
const taskSchema = new mongoose.Schema({
    name: String
});

const Task = mongoose.model('Task', taskSchema);

// Routes
app.get('/', async (req, res) => {
    const tasks = await Task.find();
    let html = `<h1>Task Manager</h1>
                <form method="POST" action="/add">
                    <input type="text" name="task" placeholder="New Task" required>
                    <button type="submit">Add Task</button>
                </form>
                <ul>`;
    tasks.forEach(task => {
        html += `<li>${task.name} <a href="/delete/${task._id}">Delete</a></li>`;
    });
    html += `</ul>`;
    res.send(html);
});

app.post('/add', async (req, res) => {
    const task = new Task({ name: req.body.task });
    await task.save();
    res.redirect('/');
});

app.get('/delete/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
