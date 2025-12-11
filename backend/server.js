const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api');

const app = express();
// allow all origins
app.use(cors());
app.use(express.json());

// mount API router
app.use('/api', apiRouter);

// simple health check
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Smart-Bloom backend listening on http://localhost:${PORT}`));