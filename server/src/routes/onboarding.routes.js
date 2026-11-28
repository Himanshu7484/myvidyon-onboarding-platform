const express = require('express');
const {
  getOnboarding,
  updateStep,
} = require('../controllers/onboarding.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

// Every onboarding route needs a logged-in user
router.get('/', requireAuth, getOnboarding);
router.put('/steps/:stepKey', requireAuth, updateStep);

module.exports = router;