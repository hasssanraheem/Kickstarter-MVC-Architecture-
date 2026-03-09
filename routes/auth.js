const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { redirectIfAuthenticated } = require('../middlewares/auth');

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords do not match');
    return true;
  })
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

// GET  /auth/register
router.get('/register', redirectIfAuthenticated, authController.getRegister);

// POST /auth/register
router.post('/register', redirectIfAuthenticated, registerValidation, authController.postRegister);

// GET  /auth/login
router.get('/login', redirectIfAuthenticated, authController.getLogin);

// POST /auth/login
router.post('/login', redirectIfAuthenticated, loginValidation, authController.postLogin);

// POST /auth/logout
router.post('/logout', authController.logout);

module.exports = router;
