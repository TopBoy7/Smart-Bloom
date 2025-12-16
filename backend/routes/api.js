const express = require('express');
const Page = require('../db/model');
const router = express.Router();

// GET /api/ -> list top-level keys
router.get('/', (req, res) => {
  return res.send("Smart bloom backend!")
});

router.get('/:key', async (req, res) => {
  const { key } = req.params;

  const page = await Page.findOne({name: key});
  const data = page ? page.data : null;  

  if (!data) {
    return res.status(404).json({
      error: 'Key not found',
      requested: key,
    });
  }

    return res.status(200).json({ key, data });

});

module.exports = router;