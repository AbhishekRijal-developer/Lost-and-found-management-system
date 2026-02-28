#!/usr/bin/env pwsh

Write-Host "🚀 Lost & Found System - One Command Launcher" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

# Start Backend
Write-Host "📦 Starting Backend (Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\Backend'; npm start"

# Wait 3 seconds
Start-Sleep -Seconds 3

# Start Frontend  
Write-Host "⚛️  Starting Frontend (Port 5173)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\Frontend'; npm run dev"

Write-Host ""
Write-Host "✅ Services launched in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔌 Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "✓ Services started!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Check the terminal windows for status messages" -ForegroundColor Cyan
Write-Host "🌐 Open your browser and navigate to: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""

# Wait for process termination
$backendProcess, $frontendProcess | Wait-Process

Write-Host "Services have been terminated." -ForegroundColor Yellow
