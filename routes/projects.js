const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const projectController = require('../controllers/projectController');
const { requireAuth } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const projectValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 120 }).withMessage('Title too long'),
  body('shortDescription').trim().notEmpty().withMessage('Short description required').isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('Full description required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('fundingGoal').isNumeric({ min: 1 }).withMessage('Funding goal must be a positive number'),
  body('deadline').isISO8601().withMessage('Valid deadline required').custom(value => {
    if (new Date(value) <= new Date()) throw new Error('Deadline must be in the future');
    return true;
  })
];

// GET  /projects
router.get('/', projectController.index);

// GET  /projects/new
router.get('/new', requireAuth, projectController.getCreate);

// POST /projects
router.post('/', requireAuth, upload.single('image'), projectValidation, projectController.create);

// GET  /projects/:slug
router.get('/:slug', projectController.show);

// GET  /projects/:slug/edit
router.get('/:slug/edit', requireAuth, projectController.getEdit);

// PUT  /projects/:slug
router.put('/:slug', requireAuth, upload.single('image'), projectValidation, projectController.update);

// DELETE /projects/:slug
router.delete('/:slug', requireAuth, projectController.delete);

// POST /projects/:slug/updates
router.post('/:slug/updates', requireAuth, projectController.postUpdate);

module.exports = router;
