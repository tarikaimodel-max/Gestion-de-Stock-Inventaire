const express = require('express');
const router = express.Router();
const magasinierController = require('../controllers/magasinierController');
const { isAuthenticated, isMagasiner } = require('../middlewares/authMiddleware');

router.use(isAuthenticated, isMagasiner);

router.get('/dashboard', magasinierController.getDashboard);
router.post('/sessions', magasinierController.postSession);

module.exports = router;
