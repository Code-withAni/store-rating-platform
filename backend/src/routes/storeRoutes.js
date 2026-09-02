const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getStores, submitRating, updateRating } = require('../controllers/storeController');

router.use(authenticate, authorize('user'));

router.get('/stores', getStores);
router.post('/ratings', submitRating);
router.put('/ratings/:id', updateRating);

module.exports = router;
