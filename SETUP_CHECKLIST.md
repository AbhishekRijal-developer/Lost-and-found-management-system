# ✅ SETUP CHECKLIST

Follow this checklist to ensure everything is set up correctly.

## Prerequisites Installation

- [ ] **Node.js v16+** installed
  - Verify: `node --version` (should show v16+)
  - Download: https://nodejs.org/
  
- [ ] **MySQL v8.0+** installed
  - Verify: `mysql --version` (should show 8.0+)
  - Download: https://dev.mysql.com/downloads/mysql/
  
- [ ] **MySQL Service Running**
  - Windows: Open Services → MySQL → Status: Running
  - Or verify: `mysql -u root -p` (should connect)

## Backend Setup

### Configuration
- [ ] Navigation to project folder: Lost and found management system
- [ ] Copy Backend/.env file
- [ ] Update Backend/.env with your MySQL credentials:
  ```
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=your_password
  DB_NAME=lost_found_db
  ```
- [ ] Verify PORT=5000 in Backend/.env

### Database Setup
- [ ] Run setup script (PowerShell): `.\setup.ps1`
  - Or Command Prompt: `setup.bat`
  - Or Manual: `mysql -u root -p < Backend\database.sql`
- [ ] Verify database created: `mysql -u root -p` → `SHOW DATABASES;` → Look for lost_found_db
- [ ] Check tables exist: `USE lost_found_db;` → `SHOW TABLES;`

### Dependencies
- [ ] Navigate to Backend folder: `cd Backend`
- [ ] Install dependencies: `npm install`
- [ ] Verify node_modules folder created

## Frontend Setup

### Configuration
- [ ] Frontend/.env already configured for `http://localhost:5000/api`
- [ ] No changes needed unless API is on different host

### Dependencies
- [ ] Navigate to Frontend folder: `cd Frontend`
- [ ] Install dependencies: `npm install`
- [ ] Verify node_modules folder created

## Launch & Testing

### Start Services
- [ ] Run launcher script (PowerShell): `.\launch.ps1`
  - Or Command Prompt: `launch.bat`
  - Or Manual:
    - Terminal 1: `cd Backend && npm start`
    - Terminal 2: `cd Frontend && npm run dev`

### Verify Services Running
- [ ] Backend running at http://localhost:5000
  - Check: http://localhost:5000/api/health (should show JSON)
- [ ] Frontend running at http://localhost:5173
  - Browser should auto-open
- [ ] No errors in console windows

### Test Registration & Login
- [ ] Open http://localhost:5173 in browser
- [ ] Click "Create Account" or "Register"
- [ ] Register with test account:
  - Name: Test User
  - Email: test@iic.edu.np
  - Password: Test123456
- [ ] Verify: Database shows new user in users table
- [ ] Login with new account
- [ ] Verify: Token stored in localStorage

### Test Item Creation
- [ ] Click "Report Lost Item"
- [ ] Fill form with test data
- [ ] Submit form
- [ ] Verify: Item appears in database
- [ ] Click "Lost Items" to see reported item

### Test Item Browsing
- [ ] Go to "Lost Items" page
- [ ] Verify: Items load from database
- [ ] Search for an item
- [ ] Filter by category
- [ ] Go to "Found Items" page
- [ ] Verify: Items load correctly

## File Verification

### Project Structure
- [ ] Backend folder exists with:
  - [ ] server.js
  - [ ] package.json
  - [ ] .env file
  - [ ] config/database.js
  - [ ] controllers/authController.js
  - [ ] controllers/itemController.js
  - [ ] middleware/auth.js
  - [ ] routes/authRoutes.js
  - [ ] routes/itemRoutes.js
  - [ ] database.sql

- [ ] Frontend folder exists with:
  - [ ] package.json
  - [ ] .env file
  - [ ] vite.config.js
  - [ ] src/App.jsx
  - [ ] src/main.jsx
  - [ ] src/services/api.js
  - [ ] src/context/AuthContext.jsx
  - [ ] src/pages/ (all pages)

- [ ] Root folder contains:
  - [ ] README.md
  - [ ] QUICK_START.md
  - [ ] setup.ps1
  - [ ] setup.bat
  - [ ] launch.ps1
  - [ ] launch.bat

## Optional: Advanced Verification

### Check Backend API Endpoints
```bash
curl http://localhost:5000/api/health
```
Should return: `{"status":"Backend is running","timestamp":"..."}`

### Check JWT Token
1. Login and copy token from localStorage
2. Test protected endpoint:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/auth/me
```

### Database Queries
```sql
USE lost_found_db;
SELECT * FROM users;
SELECT * FROM items WHERE itemType='Lost';
SELECT * FROM items WHERE itemType='Found';
```

## Troubleshooting

### Issue: Database Connection Failed
- [ ] MySQL service running?
- [ ] Credentials correct in .env?
- [ ] Database exists? `SHOW DATABASES;`
- [ ] Solutions:
  - Restart MySQL service
  - Re-run setup script
  - Check .env file for typos

### Issue: EADDRINUSE Port Already in Use
- [ ] Another app using port 5000 or 5173?
- [ ] Solutions:
  - Kill process: `netstat -ano | findstr :5000`
  - Change PORT in .env
  - Restart system

### Issue: npm install fails
- [ ] Internet connection stable?
- [ ] Disk space available?
- [ ] Solutions:
  - Clear npm cache: `npm cache clean --force`
  - Delete node_modules: `rm -r node_modules`
  - Reinstall: `npm install`

### Issue: Frontend can't connect to backend
- [ ] Backend running on http://localhost:5000?
- [ ] VITE_API_URL in Frontend/.env correct?
- [ ] Solutions:
  - Check backend is running
  - Check CORS in Backend/server.js
  - Check Frontend/.env

## Deployment Readiness

Before submitting/deploying:
- [ ] All tests pass
- [ ] No console errors
- [ ] Database backups created
- [ ] .env files configured properly
- [ ] All dependencies installed
- [ ] README.md reviewed
- [ ] Security check (passwords not in code)
- [ ] API endpoints tested

## Final Verification

- [ ] ✅ Can register new user
- [ ] ✅ Can login
- [ ] ✅ Can report lost item
- [ ] ✅ Can report found item
- [ ] ✅ Can browse lost items
- [ ] ✅ Can browse found items
- [ ] ✅ Can search items
- [ ] ✅ Can filter by category
- [ ] ✅ Database stores data
- [ ] ✅ No errors in console

## What's Next?

Your application is fully integrated! You can now:

1. **Test thoroughly** - Try all features
2. **Deploy** - Follow deployment guide
3. **Add more features** - See API documentation
4. **Customize** - Modify layouts and colors
5. **Scale** - Optimize for more users

🎉 **Congratulations! Your Lost & Found System is Ready!**

---

For detailed info, see: [README.md](README.md)
For quick start, see: [QUICK_START.md](QUICK_START.md)
