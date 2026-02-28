# 🚀 QUICK START GUIDE

## Before You Start
Make sure you have installed:
1. ✅ Node.js (https://nodejs.org/)
2. ✅ MySQL (https://dev.mysql.com/downloads/mysql/)
3. ✅ MySQL is running (check Windows Services)

## 5-Minute Setup

### Step 1: Setup Database (2 minutes)
**Using PowerShell:**
```powershell
cd 'C:\Users\ADMIN\OneDrive\Desktop\Lost and found management system\Backend'
.\setup.ps1
```

**Or using Command Prompt:**
```batch
cd Backend
setup.db.bat
```

### Step 2: Start the Application (1 minute)
**Using PowerShell:**
```powershell
cd 'C:\Users\ADMIN\OneDrive\Desktop\Lost and found management system'
.\launch.ps1
```

**Or using Command Prompt:**
```batch
cd "Lost and found management system"
launch.bat
```

This will automatically:
- Install missing dependencies
- Start Backend on http://localhost:5000
- Start Frontend on http://localhost:5173

### Step 3: Open in Browser
Go to: **http://localhost:5173**

## Done! 🎉

You can now:
- 📝 Register a new account (must use @iic.edu.np email)
- 📱 Report lost/found items
- 🔍 Search for items
- 👤 Manage your profile

## Test Credentials
After setup you can create test accounts with:
- Email: `anything@iic.edu.np`
- Password: any 6+ character password

## If Something Goes Wrong

### Backend won't start?
- Check if MySQL is running
- Run: `mysql -u root -p` to verify MySQL access
- Check `.env` file in Backend folder has correct credentials

### Database setup failed?
- Make sure MySQL service is running
- Open Services (Windows) → MySQL → Start if not running
- Try manual setup: `mysql -u root < Backend\database.sql`

### Can't access frontend?
- Browser should auto-open to http://localhost:5173
- If not, manually go to: http://localhost:5173 or http://localhost:5174

## .env Configuration

**Backend/.env** - Update with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=lost_found_db
PORT=5000
JWT_SECRET=secure_key_here
NODE_ENV=development
```

## File Locations

| File | Location |
|------|----------|
| Backend | Backend/ |
| Frontend | Frontend/ |
| Database Schema | Backend/database.sql |
| Setup Scripts | setup.ps1, setup.bat |
| Launcher | launch.ps1, launch.bat |
| Config | Backend/.env, Frontend/.env |
| API | http://localhost:5000/api |
| App | http://localhost:5173 |

## Project Features

✨ **User Features:**
- College email registration (@iic.edu.np)
- Secure login with JWT
- Report lost items
- Report found items
- Search & browse items
- User profile management
- View item details
- Contact item reporters

🛠️ **Technical Stack:**
- React 19 + Vite
- Node.js + Express
- MySQL Database
- Tailwind CSS
- Framer Motion (animations)

## All Complete! ✅

Your Lost & Found system is fully integrated and ready to deploy!

For detailed information, see: [README.md](README.md)
