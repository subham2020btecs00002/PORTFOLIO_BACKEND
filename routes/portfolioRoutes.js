// portfolioRoutes.js
const express = require('express');
const router = express.Router();
const { createPortfolio, getPortfolio, updatePortfolio,checkPortfolioExists ,getPublicPortfolio} = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createPortfolio);
router.get('/', authMiddleware, getPortfolio);
router.put('/', authMiddleware, updatePortfolio);
router.get('/exists', authMiddleware, checkPortfolioExists); // New endpoint for checking portfolio existence
router.get('/public/:userId', getPublicPortfolio); // New endpoint for public portfolio

module.exports = router;
