const express = require('express');
const router = express.Router();
const { getProductDetails } = require('../controllers/productController');

router.get('/cosmeticos/:barcode', getProductDetails);

module.exports = router;
