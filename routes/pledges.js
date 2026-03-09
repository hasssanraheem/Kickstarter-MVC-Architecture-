const express = require('express');
const router = express.Router();
const pledgeController = require('../controllers/pledgeController');
const { requireAuth } = require('../middlewares/auth');

// POST /pledges  — back a project
router.post('/', requireAuth, pledgeController.create);

// GET  /pledges/my-pledges
router.get('/my-pledges', requireAuth, pledgeController.myPledges);

// POST /pledges/:id/cancel
router.post('/:id/cancel', requireAuth, pledgeController.cancel);

module.exports = router;
