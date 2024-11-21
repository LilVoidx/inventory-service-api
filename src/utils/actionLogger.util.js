const axios = require('axios');

const logger = require('./logger.util');
const { HISTORY_SERVICE_URL } = require('../config/env.config');

const logAction = async (store_id, plu, action, description) => {
  try {
    const payload = {
      store_id,
      plu,
      action,
      description,
    };
    logger.info(`Payload for logging action to the server: ${JSON.stringify(payload)}`);

    await axios.post(HISTORY_SERVICE_URL, payload, { timeout: 5000 });

    logger.info(
      `Logged action: store_id=${store_id}, plu=${plu}, action=${action}`,
    );
  } catch (error) {
    logger.error(`Failed to log action: ${error.message}`);
  }
};

module.exports = logAction;
