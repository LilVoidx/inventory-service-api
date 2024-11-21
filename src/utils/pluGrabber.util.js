const db = require('../config/db.config');
const logger = require('./logger.util');

const getPluByProductId = async (productId) => {
  const result = await db.query('SELECT plu FROM products WHERE id = $1', [
    productId,
  ]);
  const { plu } = result.rows[0];

  if (!plu) {
    logger.error(`PLU not found for product ID ${productId}`);
    throw new Error(`PLU not found for product ID ${productId}`);
  }

  return plu;
};

module.exports = getPluByProductId;
