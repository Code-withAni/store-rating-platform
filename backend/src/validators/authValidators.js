const { body } = require('express-validator');

const nameRules = body('name')
  .trim()
  .isLength({ min: 20, max: 60 })
  .withMessage('Name must be between 20 and 60 characters');

const emailRules = body('email')
  .trim()
  .isEmail()
  .withMessage('Must be a valid email address');

const passwordRules = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be 8–16 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[^a-zA-Z0-9]/)
  .withMessage('Password must contain at least one special character');

const addressRules = body('address')
  .trim()
  .isLength({ max: 400 })
  .withMessage('Address must be at most 400 characters');

const registerValidation = [nameRules, emailRules, passwordRules, addressRules];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password required'),

  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be 8–16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[^a-zA-Z0-9]/)
    .withMessage('Password must contain at least one special character'),
];

module.exports = {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  nameRules,
  emailRules,
  passwordRules,
  addressRules,
};
