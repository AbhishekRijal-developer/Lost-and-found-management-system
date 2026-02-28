# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Use JWT tokens for protected routes. Include the token in the Authorization header:
```
Authorization: Bearer your_token_here
```

---

## 🔐 Auth Endpoints

### Register User
**POST** `/auth/register`

Register a new user with college email.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@iic.edu.np",
  "password": "password123",
  "phone": "9841234567",
  "role": "User"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": 1
}
```

**Errors:**
- 400: Missing required fields
- 400: Email must end with @iic.edu.np
- 409: Email already registered
- 500: Server error

---

### Login User
**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@iic.edu.np",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@iic.edu.np",
    "role": "User",
    "phone": "9841234567"
  }
}
```

**Errors:**
- 400: Email and password required
- 401: Invalid email or password
- 500: Server error

---

### Get Current User
**GET** `/auth/me`

Get logged-in user information. **Requires authentication.**

**Headers:**
```
Authorization: Bearer your_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@iic.edu.np",
    "phone": "9841234567",
    "role": "User"
  }
}
```

**Errors:**
- 401: Access token required
- 403: Invalid or expired token
- 404: User not found

---

## 📦 Item Endpoints

### Get All Items
**GET** `/items`

Get all lost and found items.

**Query Parameters:**
- None currently, but can add pagination

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "title": "Blue Wallet",
      "description": "Blue leather wallet with cards",
      "category": "Wallet/Purse",
      "itemType": "Lost",
      "status": "Active",
      "location": "City Center",
      "contactPhone": "9841234567",
      "contactEmail": "john@iic.edu.np",
      "imageUrl": null,
      "createdAt": "2024-02-24T10:30:00.000Z",
      "updatedAt": "2024-02-24T10:30:00.000Z"
    }
  ]
}
```

---

### Get Item by ID
**GET** `/items/:id`

Get details of a specific item.

**Parameters:**
- `id` (number): Item ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "title": "Blue Wallet",
    "description": "Blue leather wallet with cards",
    "category": "Wallet/Purse",
    "itemType": "Lost",
    "status": "Active",
    "location": "City Center",
    "contactPhone": "9841234567",
    "contactEmail": "john@iic.edu.np",
    "imageUrl": null,
    "createdAt": "2024-02-24T10:30:00.000Z",
    "updatedAt": "2024-02-24T10:30:00.000Z"
  }
}
```

**Errors:**
- 404: Item not found
- 500: Server error

---

### Search Items
**GET** `/items/search/query`

Search items by keyword, location, or category.

**Query Parameters:**
- `q` (string): Search query (required)

**Example:**
```
GET /items/search/query?q=wallet
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Blue Wallet",
      ...
    }
  ]
}
```

**Errors:**
- 400: Search query required
- 500: Server error

---

### Get My Items
**GET** `/items/user/my-items`

Get all items created by the logged-in user. **Requires authentication.**

**Headers:**
```
Authorization: Bearer your_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Blue Wallet",
      ...
    }
  ]
}
```

**Errors:**
- 401: User not authenticated
- 401: Access token required
- 403: Invalid or expired token

---

### Create Item
**POST** `/items`

Create a new lost or found item. **Requires authentication.**

**Headers:**
```
Authorization: Bearer your_token_here
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": 1,
  "title": "Blue Wallet",
  "description": "Blue leather wallet with cards inside",
  "category": "Wallet/Purse",
  "itemType": "Lost",
  "location": "City Center",
  "contactPhone": "9841234567",
  "contactEmail": "john@iic.edu.np"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Item created successfully",
  "data": {
    "id": 1
  }
}
```

**Errors:**
- 400: Missing required fields
- 401: Not authenticated
- 500: Server error

---

### Update Item
**PUT** `/items/:id`

Update an item. **Requires authentication.**

**Headers:**
```
Authorization: Bearer your_token_here
Content-Type: application/json
```

**Parameters:**
- `id` (number): Item ID

**Request Body:**
```json
{
  "title": "Blue Wallet",
  "description": "Updated description",
  "category": "Wallet/Purse",
  "status": "Resolved",
  "location": "City Center",
  "contactPhone": "9841234567"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item updated successfully"
}
```

**Errors:**
- 401: Not authenticated
- 500: Server error

---

### Delete Item
**DELETE** `/items/:id`

Delete an item. **Requires authentication.**

**Headers:**
```
Authorization: Bearer your_token_here
```

**Parameters:**
- `id` (number): Item ID

**Response (200):**
```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

**Errors:**
- 401: Not authenticated
- 500: Server error

---

## 🏥 Health Check

### Server Status
**GET** `/health`

Check if the backend is running.

**Response (200):**
```json
{
  "status": "Backend is running",
  "timestamp": "2024-02-24T10:30:00.000Z"
}
```

---

## Error Responses

All error responses follow this format:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Description of the error"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Access token required"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**409 Conflict:**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**500 Server Error:**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## Testing Endpoints

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@iic.edu.np","password":"test123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@iic.edu.np","password":"test123"}'
```

**Get Items:**
```bash
curl http://localhost:5000/api/items
```

**Create Item (with token):**
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"userId":1,"title":"Test Item","description":"Test","category":"Electronics","itemType":"Lost","location":"Here","contactPhone":"9841234567","contactEmail":"test@iic.edu.np"}'
```

### Using Postman

1. Import these endpoints into Postman
2. Set `{{BASE_URL}}` variable to `http://localhost:5000/api`
3. Set `{{TOKEN}}` variable after login
4. Use `Authorization` header: `Bearer {{TOKEN}}`

---

## Rate Limiting

Currently no rate limiting. Implement in production.

---

## CORS

CORS is enabled for:
- Local development: `http://localhost:5173`
- Can be changed in `Backend/server.js`

---

## Database Schema

### Users Table
```sql
- id: INT PRIMARY KEY AUTO_INCREMENT
- name: VARCHAR(100)
- email: VARCHAR(100) UNIQUE
- password: VARCHAR(255)
- phone: VARCHAR(20)
- role: ENUM('User', 'Admin')
- isActive: BOOLEAN
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP
```

### Items Table
```sql
- id: INT PRIMARY KEY AUTO_INCREMENT
- userId: INT (Foreign Key)
- title: VARCHAR(200)
- description: TEXT
- category: VARCHAR(100)
- itemType: ENUM('Lost', 'Found')
- status: ENUM('Active', 'Resolved', 'Archived')
- location: VARCHAR(255)
- contactPhone: VARCHAR(20)
- contactEmail: VARCHAR(100)
- imageUrl: VARCHAR(255)
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP
```

---

## Version
API Version: 1.0.0

---

For more information, see: [README.md](README.md)
