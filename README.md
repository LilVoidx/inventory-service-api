# **Stock Management API**

This is a Node.js API for managing stock, products, and stores. It supports CRUD operations for products, stores, and stock management, including increasing and decreasing stock levels and finding by filters.

---

## **Features**

- Manages products, stores, and stock levels.
  
- Provided functionality to increase and decrease stock quantities.
  
- Provided filtering of products and stocks by various criteria.
  

---

## **Technologies Used**

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [Supertest](https://github.com/visionmedia/supertest)

---

## **How to get started**
### **Steps**

1. **Clone the Repository**
  
  ```bash
  git clone <repository-url>
  cd <repository-folder>
  ```
  
2. **Install Dependencies**
  
  ```bash
  npm install
  ```
  
3. **Configure Environment Variables**
  
  Refactor `.env.example` file in the project root and remove the .example then add your info, the file should look like this
  
  ```env
  PORT=5000
  SERVER_URL=http://localhost:5000
  DB_USER=<your-db-user>
  DB_HOST=<your-db-host>
  DB_NAME=<your-db-name>
  DB_PASSWORD=<your-db-password>
  DB_PORT=5432
  DB_URL=postgresql://<your-db-user>:<your-db-password>@<your-db-host>:5432/<your-db-name>
  ```
  
4. **Run the server**
  
  ```bash
  npm run dev
  ```
  

---

## **API Endpoints**

### **Product Management**

- **URL**: `/api/products`
  
- **Method**: `POST`
  
- **Description**: Create a new product.
  
  #### **Request Body**
  
  ```json
  {
    "name": "Product Name",
  }
  ```
  
  #### **Response**
  
  ```json
  {
    "id": 1,
    "name": "Product Name",
    "plu": "T345987234G",
    "createdAt": "2024-11-20T12:34:56.000Z",
    "updatedAt": "2024-11-20T12:34:56.000Z"
  }
  ```
  

### **Store Management**

- **URL**: `/api/stores`
  
- **Method**: `POST`
  
- **Description**: Create a new store.
  
  #### **Request Body**
  
  ```json
  {
    "name": "Store Name"
  }
  ```
  
  #### **Response**
  
  ```json
  {
    "id": 1,
    "name": "Store Name",
    "createdAt": "2024-11-20T12:34:56.000Z",
    "updatedAt": "2024-11-20T12:34:56.000Z"
  }
  ```
  

### **Stock Management**

- **URL**: `/api/stocks/:id/increase`
  
- **Method**: `PUT`
  
- **Description**: Increase stock for a product in a store.
  
  #### **Request Body**
  
  ```json
  {
    "quantity": 50
  }
  ```
  
  #### **Response**
  
  ```json
  {
    "success": true,
    "message": "Stock increased successfully.",
    "data": {
      "id": 5,
      "product_id": 7,
      "store_id": 7,
      "shelf_quantity": 16,
      "order_quantity": 1,
      "created_at": "2024-11-18T19:26:08.286Z",
      "updated_at": "2024-11-18T19:26:08.286Z"
    }
  }
  ```
  
- **URL**: `/api/stocks/:id/decrease?action=< remove | order >`
  
- **Method**: `PUT`
  
- **Description**: Decrease stock for a product in a store using a query to specify the action of the request either remove from shelf or add to order and remove from shelf
  
  #### **Request Body**
  
  ```json
  {
    "quantity": 10
  }
  ```
  
  #### **Response**
  
  ```json
  {
    "success": true,
    "message": "Stock decreased successfully using action: order.",
    "data": {
      "id": 5,
      "product_id": 7,
      "store_id": 7,
      "shelf_quantity": 10,
      "order_quantity": 7,
      "created_at": "2024-11-18T19:26:08.286Z",
      "updated_at": "2024-11-18T19:26:08.286Z"
    }
  }
  ```
  

### **Filtering Stocks and Products**

- **URL**: `/api/products`
  
- **Method**: `GET`
  
- **Description**: Fetch products with optional filtering by name and category.
  
  - **Full URL example:**
    
    `/api/products?name=test&plu=J123456789B`
    
  
  #### **Response**
  
  ```json
  {
    "success": true,
    "message": "Products fetched successfully.",
    "data": [
      {
        "id": 7,
        "name": "tests",
        "plu": "R780566651N",
        "created_at": "2024-11-18T19:12:37.741Z",
        "updated_at": "2024-11-18T19:12:37.741Z"
      },
      {
        "id": 8,
        "name": "testss",
        "plu": "Y438911730O",
        "created_at": "2024-11-18T19:12:41.721Z",
        "updated_at": "2024-11-18T19:12:41.721Z"
      },
      {
        "id": 9,
        "name": "heh",
        "plu": "C731869268R",
        "created_at": "2024-11-19T18:15:40.242Z",
        "updated_at": "2024-11-19T18:15:40.242Z"
      }
    ]
  }
  ```
  
- **URL**: `/api/stocks`
  
- **Method**: `GET`
  
- **Description**: Fetch stock data with optional filtering by product name and stock quantities.
  
  - **Full URL example:**
    
    `/api/stocks?plu=F123456789T&store_id=1&shelf_quantity_min=10&shelf_quantity_max=100&order_quantity_min=5&order_quantity_max=50`
    
  
  #### **Response**
  
  ```json
  {
    "success": true,
    "message": "Stocks fetched successfully.",
    "data": [
      {
        "id": 7,
        "product_id": 7,
        "store_id": 3,
        "shelf_quantity": 7,
        "order_quantity": 0,
        "created_at": "2024-11-18T19:12:37.741Z",
        "updated_at": "2024-11-18T19:12:37.741Z",
        "name": "tests",
        "plu": "R780566651N"
      },
      {
        "id": 9,
        "product_id": 9,
        "store_id": 3,
        "shelf_quantity": 6,
        "order_quantity": 6,
        "created_at": "2024-11-19T18:15:40.242Z",
        "updated_at": "2024-11-19T18:15:40.242Z",
        "name": "heh",
        "plu": "C731869268R"
      }
    ]
  }
  ```
  

---