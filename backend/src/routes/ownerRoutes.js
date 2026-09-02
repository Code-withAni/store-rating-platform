const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getDashboard } = require('../controllers/ownerController');

router.use(authenticate, authorize('owner'));

router.get('/dashboard', getDashboard);

module.exports = router;
