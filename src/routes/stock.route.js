const express = require('express');

const router = express.Router();
const stockController = require('../controllers/stock.controller');

router.post('/products', stockController.createProduct);
router.get('/products', stockController.getProductsByFilters);

router.post('/stores', stockController.createStore);

router.post('/stocks', stockController.createStock);
router.get('/stocks', stockController.getStocksByFilters);
router.put('/stocks/:id/increase', stockController.increaseStock);
router.put('/stocks/:id/decrease', stockController.decreaseStock);

module.exports = router;
