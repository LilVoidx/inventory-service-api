const db = require('../config/db.config');
const logger = require('../utils/logger.util');
const generatePlu = require('../utils/pluGenerator.util');
const logAction = require('../utils/actionLogger.util');
const getPluByProductId = require('../utils/pluGrabber.util');

const createProduct = async (productData) => {
  const plu = await generatePlu();
  const { name } = productData;
  const result = await db.query(
    'INSERT INTO products (plu, name) VALUES ($1, $2) RETURNING *',
    [plu, name],
  );

  const product = result.rows[0];
  logger.info(`Created product: ${JSON.stringify(product)}`);

  // Log action
  await logAction(
    null,
    product.plu,
    'create_product',
    `Product "${name}" created.`,
  );
  return product;
};

const createStore = async (storeData) => {
  const { name } = storeData;
  const result = await db.query(
    'INSERT INTO stores (name) VALUES ($1) RETURNING *',
    [name],
  );

  const store = result.rows[0];
  logger.info(`Created store: ${JSON.stringify(store)}`);

  // Log action
  await logAction(store.id, null, 'create_store', `Store "${name}" created.`);
  return store;
};

const createStock = async (stockData) => {
  const {
    product_id,
    store_id,
    shelf_quantity = 0,
    order_quantity = 0,
  } = stockData;

  const result = await db.query(
    'INSERT INTO stocks (product_id, store_id, shelf_quantity, order_quantity) VALUES ($1, $2, $3, $4) RETURNING *',
    [product_id, store_id, shelf_quantity, order_quantity],
  );

  const stock = result.rows[0];
  logger.info(`Created stock: ${JSON.stringify(stock)}`);

  // Log action
  const plu = await getPluByProductId(product_id);

  await logAction(
    store_id,
    plu,
    'create_stock',
    `Stock created for product ID ${product_id} in store ID ${store_id}.`,
  );
  return stock;
};

const increaseStock = async (stockId, quantity) => {
  const result = await db.query(
    'UPDATE stocks SET shelf_quantity = shelf_quantity + $1 WHERE id = $2 RETURNING *',
    [quantity, stockId],
  );

  const stock = result.rows[0];
  logger.info(`Increased stock: ${JSON.stringify(stock)}`);

  // Log action
  const plu = await getPluByProductId(stock.product_id);

  await logAction(
    stock.store_id,
    plu,
    'increase_stock',
    `Increased stock by ${quantity} for stock ID ${stockId}.`,
  );
  return stock;
};

const decreaseStock = async (stockId, quantity, action) => {
  await db.query('BEGIN');
  try {
    let result;
    if (action === 'order') {
      result = await db.query(
        `
        UPDATE stocks 
        SET shelf_quantity = shelf_quantity - $1, 
            order_quantity = order_quantity + $1 
        WHERE id = $2 
        RETURNING *`,
        [quantity, stockId],
      );
    } else {
      result = await db.query(
        'UPDATE stocks SET shelf_quantity = shelf_quantity - $1 WHERE id = $2 RETURNING *',
        [quantity, stockId],
      );
    }

    const updatedStock = result.rows[0];
    if (!updatedStock) throw new Error(`Stock with ID ${stockId} not found.`);

    // Log action
    const plu = await getPluByProductId(updatedStock.product_id);

    await logAction(
      updatedStock.store_id,
      plu,
      'decrease_stock',
      `Decreased stock by ${quantity} for stock ID ${stockId} with action "${action}".`,
    );

    if (
      updatedStock.shelf_quantity === 0
      && updatedStock.order_quantity === 0
    ) {
      await db.query('DELETE FROM products WHERE id = $1', [
        updatedStock.product_id,
      ]);
      logger.info(
        `Deleted product ID ${updatedStock.product_id} as shelf & order  quantities are zero.`,
      );

      await logAction(
        updatedStock.store_id,
        plu,
        'delete_product',
        `Product ID ${updatedStock.product_id} deleted as shelf & order quantities are zero.`,
      );
    }

    await db.query('COMMIT');
    logger.info(`Decreased stock: ${JSON.stringify(updatedStock)}`);
    return updatedStock;
  } catch (error) {
    await db.query('ROLLBACK');
    logger.error(`Error decreasing stock: ${error.message}`);
    throw error;
  }
};

const getStocksByFilters = async (filters) => {
  const {
    plu,
    store_id,
    shelf_quantity_min,
    shelf_quantity_max,
    order_quantity_min,
    order_quantity_max,
  } = filters;

  const query = `
  SELECT * FROM stocks
  JOIN products ON stocks.product_id = products.id
  WHERE ($1::VARCHAR IS NULL OR products.plu = $1)
    AND ($2::INTEGER IS NULL OR stocks.store_id = $2)
    AND (($3::INTEGER IS NULL) OR (stocks.shelf_quantity >= $3) OR (stocks.shelf_quantity IS NULL))
    AND (($4::INTEGER IS NULL) OR (stocks.shelf_quantity <= $4) OR (stocks.shelf_quantity IS NULL))
    AND (($5::INTEGER IS NULL) OR (stocks.order_quantity >= $5) OR (stocks.order_quantity IS NULL))
    AND (($6::INTEGER IS NULL) OR (stocks.order_quantity <= $6) OR (stocks.order_quantity IS NULL));
`;

  const result = await db.query(query, [
    plu || null,
    store_id || null,
    shelf_quantity_min || null,
    shelf_quantity_max || null,
    order_quantity_min || null,
    order_quantity_max || null,
  ]);

  // Log action
  const hasFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== null,
  );

  const description = hasFilters
    ? `Fetched stocks by filters: ${JSON.stringify(filters)}`
    : 'Fetched all stocks.';

  await logAction(
    store_id || null,
    plu || null,
    'get_stocks_by_filters',
    description,
  );

  return result.rows;
};

const getProductsByFilters = async (filters) => {
  const { name, plu } = filters;

  const query = `
    SELECT * FROM products 
    WHERE ($1::VARCHAR IS NULL OR name ILIKE $1) 
      AND ($2::VARCHAR IS NULL OR plu = $2)
  `;

  const result = await db.query(query, [name || null, plu || null]);

  // Log action
  const hasFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== null,
  );
  const description = hasFilters
    ? `Fetched products by filters: ${JSON.stringify(filters)}`
    : 'Fetched all products.';

  await logAction(null, plu || null, 'get_products_by_filters', description);

  return result.rows;
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
