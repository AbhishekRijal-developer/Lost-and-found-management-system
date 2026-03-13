# Lost & Found Backend API

Backend server for the Lost and Found Management System built with Node.js, Express, and MySQL.

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Setup MySQL Database

**Option A: Using MySQL Command Line**
```bash
mysql -u root -p < database.sql
```

**Option B: Using MySQL Workbench**
- Open MySQL Workbench
- Create a new connection to your MySQL server
- Open database.sql file
- Execute the script

If your database already exists, run this one-time migration for forgot-password support:
```bash
mysql -u root -p lostandfound < migrations/add-forgot-password-columns.sql
```

### 3. Configure Environment Variables

Edit `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lost_found_db
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5174
FRONTEND_URL=http://localhost:5173
PORT=5000
```

### 4. Start the Server

**Development Mode (with auto-reload)**
```bash
npm run dev
```

**Production Mode**
```bash
npm start
```

Server will run on: **http://localhost:5000**

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Send reset password link
- `POST /api/auth/reset-password` - Reset password using token

### Items
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Health Check
- `GET /api/health` - Server health status

## 🗄️ Database Schema

### Users Table
- id, name, email, password, resetPasswordToken, resetPasswordExpires, phone, role, isActive, createdAt, updatedAt

### Items Table
- id, userId, title, description, category, itemType, status, location, contactPhone, contactEmail, imageUrl, createdAt, updatedAt

### Matches Table
- id, lostItemId, foundItemId, userId, status, notes, createdAt, updatedAt

## 🔐 Sample Login Credentials

**Admin:**
- Email: admin@iic.edu.np
- Password: password (hash provided in database.sql)

**User:**
- Email: test@iic.edu.np
- Password: password (hash provided in database.sql)

## 📦 Dependencies

- **express** - Web framework
- **mysql2** - MySQL database driver
- **dotenv** - Environment variables
- **cors** - CORS middleware
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Request validation
- **nodemon** - Development auto-reload

## 🛠️ Folder Structure

```
Backend/
├── config/
│   └── database.js          # Database connection
├── routes/
│   ├── authRoutes.js        # Authentication endpoints
│   └── itemRoutes.js        # Item management endpoints
├── controllers/              # Business logic (ready to add)
├── middleware/               # Custom middleware (ready to add)
├── models/                   # Database models (ready to add)
├── server.js                # Main server file
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── database.sql            # Database schema
└── package.json            # Project metadata
```

## 🐛 Troubleshooting

### Connection Error to MySQL
- Check if MySQL service is running
- Verify credentials in .env file
- Ensure database exists

### CORS Error
- Update CORS_ORIGIN in .env to match your frontend URL
- Default is http://localhost:5174

### Port Already in Use
- Change PORT in .env file
- Or kill process using port 5000

## 📝 Next Steps

1. ✅ Backend setup complete
2. Connect Frontend to Backend API
3. Add JWT authentication middleware
4. Add request validation
5. Add file upload for images
6. Add email notifications

---

For more information, visit the main repository.
