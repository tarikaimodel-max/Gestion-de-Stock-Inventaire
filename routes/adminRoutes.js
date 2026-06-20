const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

router.use(isAuthenticated, isAdmin);

router.get('/dashboard', adminController.getDashboard);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.put('/sessions/:id/erreur', adminController.markError);

module.exports = router;
