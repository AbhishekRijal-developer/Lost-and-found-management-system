@echo off
echo ================================================
echo Lost & Found Management System - Setup Script
echo ================================================
echo.
echo This script will help you set up the database.
echo.

REM Check if MySQL is installed
mysql --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: MySQL is not installed or not in PATH
    echo Please install MySQL and add it to your PATH
    pause
    exit /b 1
)

echo.
echo Setting up database...
echo.

REM Check if .env file exists
if not exist ".env" (
    echo ERROR: .env file not found
    echo Please create .env file with database credentials
    pause
    exit /b 1
)

REM Get database credentials from .env
for /f "tokens=1,2 delims==" %%a in (.env) do (
    if "%%a"=="DB_HOST" set DB_HOST=%%b
    if "%%a"=="DB_USER" set DB_USER=%%b
    if "%%a"=="DB_PASSWORD" set DB_PASSWORD=%%b
    if "%%a"=="DB_NAME" set DB_NAME=%%b
)

REM Run database setup
if "%DB_PASSWORD%"=="" (
    mysql -h %DB_HOST% -u %DB_USER% < database.sql
) else (
    mysql -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% < database.sql
)

if errorlevel 1 (
    echo ERROR: Failed to setup database
    echo Make sure your MySQL service is running
    echo and credentials are correct in .env file
    pause
    exit /b 1
)

echo.
echo ================================================
echo Database setup completed successfully!
echo ================================================
echo.
echo Next steps:
echo 1. Make sure MySQL is running
echo 2. Update .env with correct database credentials if needed
echo 3. Run 'npm install' in Backend and Frontend folders
echo 4. Run 'npm start' in Backend folder
echo 5. Run 'npm run dev' in Frontend folder
echo.
pause
