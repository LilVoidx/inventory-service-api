const request = require('supertest');
const app = require('../src/app');
const stockService = require('../src/services/stock.service');
const logger = require('../src/utils/logger.util');

jest.mock('../src/services/stock.service.js');
jest.mock('../src/utils/logger.util');

describe('Stock Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test for creating a product
  describe('POST /api/products', () => {
    it('should create a product and return success', async () => {
      const mockProduct = { id: 1, name: 'Test Product', plu: 'A123456789B' };
      stockService.createProduct.mockResolvedValue(mockProduct);

      const response = await request(app)
        .post('/api/products')
        .send({ name: 'Test Product' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Product created successfully.');
      expect(response.body.data).toEqual(mockProduct);
      expect(stockService.createProduct).toHaveBeenCalledTimes(1);
    });

    it('should handle errors during product creation', async () => {
      const errorMessage = 'Error creating product';
      stockService.createProduct.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .post('/api/products')
        .send({ name: 'Test Product' });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(errorMessage);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining(errorMessage),
      );
    });
  });

  describe('POST /api/stores', () => {
    it('should create a store and return success', async () => {
      const mockStore = { id: 1, name: 'Test Store' };
      stockService.createStore.mockResolvedValue(mockStore);

      const response = await request(app)
        .post('/api/stores')
        .send({ name: 'Test Store' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Store created successfully.');
      expect(response.body.data).toEqual(mockStore);
    });

    it('should handle errors during store creation', async () => {
      const errorMessage = 'Error creating store';
      stockService.createStore.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .post('/api/stores')
        .send({ name: 'Test Store' });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(errorMessage);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining(errorMessage),
      );
    });
  });

  // Test for increasing stock
  describe('PUT /api/stocks/:id/increase', () => {
    it('should increase the stock and return success', async () => {
      const mockStock = { id: 1, shelf_quantity: 10, order_quantity: 5 };
      stockService.increaseStock.mockResolvedValue(mockStock);

      const response = await request(app)
        .put('/api/stocks/1/increase')
        .send({ quantity: 5 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Stock increased successfully.');
      expect(response.body.data).toEqual(mockStock);
    });

    it('should return 400 if quantity is invalid', async () => {
      const response = await request(app)
        .put('/api/stocks/1/increase')
        .send({ quantity: -5 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Quantity must be a positive number.');
    });

    it('should handle errors during stock increase', async () => {
      const errorMessage = 'Error increasing stock';
      stockService.increaseStock.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .put('/api/stocks/5/increase')
        .send({ quantity: 5 });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(errorMessage);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining(errorMessage),
      );
    });
  });

  // Test for decreasing stock
  describe('PUT /api/stocks/:id/decrease', () => {
    it('should decrease the stock and return success', async () => {
      const mockStock = { id: 1, shelf_quantity: 10, order_quantity: 5 };
      stockService.decreaseStock.mockResolvedValue(mockStock);

      const response = await request(app)
        .put('/api/stocks/1/decrease?action=remove')
        .send({ quantity: 5 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        'Stock decreased successfully using action: remove.',
      );
      expect(response.body.data).toEqual(mockStock);
    });

    it('should handle errors during stock decrease', async () => {
      const errorMessage = 'Error decreasing stock';
      stockService.decreaseStock.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .put('/api/stocks/1/decrease?action=remove')
        .send({ quantity: 5 });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(errorMessage);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining(errorMessage),
      );
    });
  });

  // Test for fetching products by filters
  describe('GET /api/products', () => {
    it('should fetch products with filters', async () => {
      const mockProducts = [
        { id: 1, name: 'Test Product', plu: 'A123456789B' },
      ];
      stockService.getProductsByFilters.mockResolvedValue(mockProducts);

      const response = await request(app).get(
        '/api/products?name=Test Product',
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Products fetched successfully.');
      expect(response.body.data).toEqual(mockProducts);
    });

    it('should handle errors during product fetch', async () => {
      const errorMessage = 'Error fetching products';
      stockService.getProductsByFilters.mockRejectedValue(
        new Error(errorMessage),
      );

      const response = await request(app).get('/api/products');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(errorMessage);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining(errorMessage),
      );
    });
  });

  // Test for fetching stocks by filters
  describe('GET /api/stocks', () => {
    it('should fetch stocks with filters', async () => {
      const mockStocks = [
        {
          id: 1,
          shelf_quantity: 10,
          order_quantity: 5,
          store_id: 1,
          product_id: 1,
        },
      ];
      stockService.getStocksByFilters.mockResolvedValue(mockStocks);

      const response = await request(app).get(
        '/api/stocks?store_id=1&shelf_quantity_min=5',
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Stocks fetched successfully.');
      expect(response.body.data).toEqual(mockStocks);
    });

    it('should handle errors during stock fetch', async () => {
      const errorMessage = 'Error fetching stocks';
      stockService.getStocksByFilters.mockRejectedValue(
        new Error(errorMessage),
      );

      const response = await request(app).get('/api/stocks');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(errorMessage);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining(errorMessage),
      );
    });
  });
});
