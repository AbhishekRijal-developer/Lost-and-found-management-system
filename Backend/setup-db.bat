@echo off
REM Lost and Found Database Setup Script
echo.
echo ========================================
echo Lost & Found Database Setup
echo ========================================
echo.
echo This script will create the database and tables.
echo Make sure MySQL is running on localhost.
echo.

set "DB_USER=root"
set "DB_PASS="

REM If you have a password, uncomment and set it:
REM set "DB_PASS=-p"

echo Importing database schema...
echo.

mysql -u %DB_USER% %DB_PASS% < database.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ Database setup completed successfully!
    echo ========================================
    echo.
    echo Database created: lost_found_db
    echo Tables created: users, items, matches
    echo.
    echo Sample users created:
    echo - Admin: admin@iic.edu.np / password
    echo - User: test@iic.edu.np / password
    echo.
) else (
    echo.
    echo ❌ Error setting up database!
    echo Please ensure:
    echo - MySQL is running
    echo - Username and password are correct
    echo - database.sql file exists
    echo.
)

pause
