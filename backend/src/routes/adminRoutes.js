const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getDashboard,
  getUsers,
  getUserById,
  createUser,
  getStores,
  getStoreById,
  updateStore,
  createStore,
} = require('../controllers/adminController');
const {
  nameRules,
  emailRules,
  passwordRules,
  addressRules,
} = require('../validators/authValidators');
const { body } = require('express-validator');
const validate = require('../validators/validate');

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboard);

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post(
  '/users',
  [
    nameRules,
    emailRules,
    passwordRules,
    addressRules,
    body('role').isIn(['admin', 'user', 'owner']).withMessage('Role must be admin, user, or owner'),
  ],
  validate,
  createUser
);

router.get('/stores', getStores);
router.get('/stores/:id', getStoreById);
router.put('/stores/:id', updateStore);
router.post(
  '/stores',
  [
    nameRules,
    emailRules,
    addressRules,
    body('owner_id').optional({ nullable: true }).isInt().withMessage('owner_id must be an integer'),
  ],
  validate,
  createStore
);

module.exports = router;
