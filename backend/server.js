require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/mongo');

const app = express();
app.use(cors());
app.use(express.json());

// health check (safe to mount before DB)
app.get(['/', '/health'], (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// connect to DB first, then require/mount routers that access models
(async () => {
  try {
    await connectDB();

    // require routes after DB connection to avoid DB calls at module-eval time
    const apiRouter = require('./routes/api');
    app.use('/api', apiRouter);

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Smart-Bloom backend listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to database, exiting.', err && err.message ? err.message : err);
    process.exit(1);
  }
})();