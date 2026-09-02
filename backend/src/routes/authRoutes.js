const express = require('express');
const router = express.Router();
const { register, login, changePassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  changePasswordValidation,
} = require('../validators/authValidators');
const validate = require('../validators/validate');

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// Protected — change password
router.post(
  '/change-password',
  authenticate,
  changePasswordValidation,
  validate,
  changePassword
);

module.exports = router;
