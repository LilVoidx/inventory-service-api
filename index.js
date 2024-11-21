const app = require('./src/app');
const { PORT } = require('./src/config/env.config');
const logger = require('./src/utils/logger.util');

try {
  app.listen(PORT, () => {
    logger.info(`Server Listening: http://localhost:${PORT}`);
  });
} catch (error) {
  if (error.code === 'EADDRINUSE') {
    logger.error(`Port ${PORT} is already in use.`);
  } else {
    logger.error('Error starting the server:', error.message);
  }
  process.exit(1);
}
