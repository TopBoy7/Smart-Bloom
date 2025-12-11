const express = require('express');
const router = express.Router();
const data = require('../db/data');

// GET /api/ -> list top-level keys
router.get('/', (req, res) => {
  return res.json({ availableKeys: Object.keys(data) });
});

// GET /api/:key -> return data[key] or 404
router.get('/:key', (req, res) => {
  const { key } = req.params;

  if (Object.prototype.hasOwnProperty.call(data, key)) {
    return res.json({ key, data: data[key] });
  }

  return res.status(404).json({
    error: 'Key not found',
    requested: key,
    availableKeys: Object.keys(data),
  });
});

module.exports = router;