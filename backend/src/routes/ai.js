const router = require('express').Router();
const { improveSummary, improveBullets } = require('../controllers/aiController');

router.post('/improve-summary', improveSummary);
router.post('/improve-bullets', improveBullets);

module.exports = router;
