const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.json());
const PORT = process.env.PORT || 3000;


const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.get('/', (req, res) => res.json({ message: 'Task Manager APP running' }));

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);


app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));