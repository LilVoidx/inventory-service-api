const db = require('../config/db.config');

const generatePlu = async () => {
  const min = 100000000;
  const max = 999999999;

  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  const randomChar = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const PUID = `${randomChar()}${randomNum}${randomChar()}`;

  const result = await db.query('SELECT 1 FROM products WHERE plu = $1', [PUID]);
  if (result.rows.length > 0) {
    return generatePlu();
  }

  return PUID;
};

module.exports = generatePlu;
