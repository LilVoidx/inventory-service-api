/* eslint-disable no-restricted-globals */
const stockService = require('../services/stock.service');
const logger = require('../utils/logger.util');

const createProduct = async (req, res, next) => {
  try {
    const newProduct = await stockService.createProduct(req.body);
    logger.info(`Product created: ${JSON.stringify(newProduct)}`);
    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: newProduct,
    });
  } catch (error) {
    logger.error(`Error creating product: ${error.message}`);
    next(error);
  }
};

const createStore = async (req, res, next) => {
  try {
    const newStore = await stockService.createStore(req.body);
    logger.info(`Store created: ${JSON.stringify(newStore)}`);
    res.status(201).json({
      success: true,
      message: 'Store created successfully.',
      data: newStore,
    });
  } catch (error) {
    logger.error(`Error creating store: ${error.message}`);
    next(error);
  }
};

const createStock = async (req, res, next) => {
  try {
    const newStock = await stockService.createStock(req.body);
    logger.info(`Stock created: ${JSON.stringify(newStock)}`);
    res.status(201).json({
      success: true,
      message: 'Stock created successfully.',
      data: newStock,
    });
  } catch (error) {
    logger.error(`Error creating stock: ${error.message}`);
    next(error);
  }
};

const increaseStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || isNaN(quantity) || quantity <= 0) {
      res.status(400);
      throw new Error('Quantity must be a positive number.');
    }

    const updatedStock = await stockService.increaseStock(
      id,
      parseInt(quantity, 10),
    );
    logger.info(`Stock increased: ${JSON.stringify(updatedStock)}`);
    res.json({
      success: true,
      message: 'Stock increased successfully.',
      data: updatedStock,
    });
  } catch (error) {
    logger.error(`Error increasing stock: ${error.message}`);
    next(error);
  }
};

const decreaseStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.query;
    const { quantity } = req.body;

    if (!['remove', 'order'].includes(action)) {
      res.status(400);
      throw new Error("Invalid action. Use 'remove' or 'order'.");
    }

    if (!quantity || isNaN(quantity) || quantity <= 0) {
      res.status(400);
      throw new Error('Quantity must be a positive number.');
    }

    const updatedStock = await stockService.decreaseStock(
      id,
      parseInt(quantity, 10),
      action,
    );
    logger.info(
      `Stock decreased with action ${action}: ${JSON.stringify(updatedStock)}`,
    );
    res.json({
      success: true,
      message: `Stock decreased successfully using action: ${action}.`,
      data: updatedStock,
    });
  } catch (error) {
    logger.error(`Error decreasing stock: ${error.message}`);
    next(error);
  }
};

const getStocksByFilters = async (req, res, next) => {
  try {
    const filters = req.query;
    const stocks = await stockService.getStocksByFilters(filters);
    logger.info(`Stocks fetched with filters: ${JSON.stringify(filters)}`);
    res.json({
      success: true,
      message: 'Stocks fetched successfully.',
      data: stocks,
    });
  } catch (error) {
    logger.error(`Error fetching stocks: ${error.message}`);
    next(error);
  }
};

const getProductsByFilters = async (req, res, next) => {
  try {
    const filters = req.query;
    const products = await stockService.getProductsByFilters(filters);
    logger.info(`Products fetched with filters: ${JSON.stringify(filters)}`);
    res.json({
      success: true,
      message: 'Products fetched successfully.',
      data: products,
    });
  } catch (error) {
    logger.error(`Error fetching products: ${error.message}`);
    next(error);
  }
};

module.exports = {
  createProduct,
  createStore,
  createStock,
  increaseStock,
  decreaseStock,
  getStocksByFilters,
  getProductsByFilters,
};
