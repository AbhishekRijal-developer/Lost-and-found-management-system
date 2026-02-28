# Lost & Found Management System

A complete full-stack application for managing lost and found items at a college campus.

## 📋 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Features](#features)

## 🎯 Overview

This application helps students and staff report lost/found items and connect with each other to retrieve their belongings. It features:

- User registration and authentication with college email
- Report lost or found items
- Search and browse all items in the system
- User profile and item management
- Item matching system

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM v7
- **Icons**: React Icons

## 📁 Project Structure

```
Lost and found management system/
├── Backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   └── itemController.js    # Item management logic
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── itemRoutes.js        # Item endpoints
│   ├── .env                     # Environment variables
│   ├── database.sql             # Database schema
│   ├── server.js                # Express server entry point
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Auth state management
│   │   ├── component/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── LostItems.jsx
│   │   │   ├── FoundItems.jsx
│   │   │   ├── ItemDetails.jsx
│   │   │   └── ... (other pages)
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx
│   ├── .env                     # Frontend env config
│   ├── vite.config.js
│   └── package.json
│
├── setup.bat / setup.ps1        # Database setup scripts
├── launch.bat / launch.ps1      # Application launcher
└── README.md
```

## 📦 Prerequisites

Before setup, ensure you have installed:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **MySQL** (v8.0 or higher)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Verify: `mysql --version`
   - **Important**: Make sure MySQL service is running

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

## 🚀 Installation & Setup

### Step 1: Prepare Environment Variables

#### Backend Configuration
Edit `Backend/.env` file with your database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lost_found_db
PORT=5000
JWT_SECRET=your_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

#### Frontend Configuration
The `Frontend/.env` file is already configured:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 2: Setup MySQL Database

#### Option 1: Using PowerShell (Recommended for Windows)
```powershell
cd 'C:\Users\ADMIN\OneDrive\Desktop\Lost and found management system\Backend'
.\setup.db.ps1
```

#### Option 2: Using Command Prompt
```batch
cd Backend
setup.db.bat
```

#### Option 3: Manual Setup
```sql
mysql -u root -p < Backend/database.sql
```

**Note**: If MySQL requires a password, use:
```sql
mysql -u root -p your_password < Backend/database.sql
```

### Step 3: Install Dependencies

#### Install Backend Dependencies
```bash
cd Backend
npm install
cd ..
```

#### Install Frontend Dependencies
```bash
cd Frontend
npm install
cd ..
```

## 🎮 Running the Application

### Option 1: Automated Launcher (Recommended)

#### Using PowerShell
```powershell
.\launch.ps1
```

#### Using Command Prompt
```batch
launch.bat
```

This will automatically:
- Check and install dependencies if needed
- Start the Backend server on http://localhost:5000
- Start the Frontend dev server on http://localhost:5173

### Option 2: Manual Start

#### Terminal 1 - Start Backend
```bash
cd Backend
npm start
# Backend will run on http://localhost:5000
```

#### Terminal 2 - Start Frontend
```bash
cd Frontend
npm run dev
# Frontend will run on http://localhost:5173
```

### Option 3: Development Mode

#### Terminal 1 - Backend with Auto-reload
```bash
cd Backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd Frontend
npm run dev
```

## 🔌 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user info | Yes |

### Item Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/items` | Get all items | No |
| GET | `/api/items/:id` | Get item by ID | No |
| GET | `/api/items/search/query?q=keyword` | Search items | No |
| GET | `/api/items/user/my-items` | Get user's items | Yes |
| POST | `/api/items` | Create new item | Yes |
| PUT | `/api/items/:id` | Update item | Yes |
| DELETE | `/api/items/:id` | Delete item | Yes |

### Example Request

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@iic.edu.np","password":"password123"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@iic.edu.np",
    "role": "User"
  }
}
```

## ✨ Features

### User Management
- ✅ User registration with college email (@iic.edu.np)
- ✅ Secure login with JWT authentication
- ✅ User profile management
- ✅ Password encryption with bcryptjs

### Item Management
- ✅ Report lost items
- ✅ Report found items
- ✅ Browse all items
- ✅ Search items by keyword, location, category
- ✅ View item details
- ✅ Edit/Delete own items
- ✅ Item status management (Active, Resolved, Archived)

### User Interface
- ✅ Responsive design
- ✅ Dark gradients and animations
- ✅ Smooth transitions with Framer Motion
- ✅ Tailwind CSS styling
- ✅ Mobile-friendly interface

## 🔒 Security Features

- JWT-based authentication for protected routes
- Password hashing with bcryptjs (10 salt rounds)
- Email domain validation (@iic.edu.np)
- CORS protection
- Environment variable configuration for sensitive data

## 🐛 Troubleshooting

### Database Connection Error
**Problem**: `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solutions**:
1. Ensure MySQL service is running
2. Check database credentials in `.env` file
3. Verify MySQL is listening on port 3306

### Port Already in Use
**Problem**: `EADDRINUSE: address already in use :::5000`

**Solutions**:
1. Change PORT in Backend/.env
2. Kill existing process: `netstat -ano | findstr :5000`
3. Restart your system

### API Connection Error
**Problem**: Frontend can't connect to backend

**Solutions**:
1. Ensure backend is running on http://localhost:5000
2. Check VITE_API_URL in Frontend/.env
3. Check CORS configuration in Backend/server.js

### Module Not Found
**Problem**: `Cannot find module 'express'`

**Solutions**:
1. Run `npm install` in the respective directory
2. Delete node_modules and reinstall: `rm -r node_modules && npm install`

## 📝 Default Test Account

After setup, you can register a new account or use test credentials:

```
Email: test@iic.edu.np
Password: test123456
```

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 👥 Contributing

To contribute to this project:
1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review error messages in console logs
3. Check backend server logs
4. Verify all prerequisites are installed

---

**Happy searching for your lost items!** 🔍📦
# practice-lost-and-found
