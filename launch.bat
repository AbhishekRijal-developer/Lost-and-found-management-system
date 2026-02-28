@echo off
echo ================================================
echo Lost & Found Management System - Launcher
echo ================================================
echo.
echo Starting Backend and Frontend services...
echo.

cd /d "%~dp0"

REM Check if Backend node_modules exists
if not exist "Backend\node_modules" (
    echo Installing Backend dependencies...
    cd Backend
    call npm install
    cd ..
)

REM Check if Frontend node_modules exists
if not exist "Frontend\node_modules" (
    echo Installing Frontend dependencies...
    cd Frontend
    call npm install
    cd ..
)

echo.
echo Starting services...
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:5173 or http://localhost:5174
echo.

REM Start Backend in a new window
start "Lost & Found Backend" cmd /k "cd Backend && npm start"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start Frontend in a new window
start "Lost & Found Frontend" cmd /k "cd Frontend && npm run dev"

echo.
echo ================================================
echo Services are starting...
echo Check the new terminal windows for status.
echo ================================================
echo.
pause
