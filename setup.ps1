#!/usr/bin/env pwsh

Write-Host "======================================" -ForegroundColor Green
Write-Host "Lost & Found System - Setup Script" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

# Check if MySQL is installed
try {
    $mysqlVersion = mysql --version
    Write-Host "✓ MySQL found: $mysqlVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: MySQL is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install MySQL Community Server" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check if running from Backend directory
if (-not (Test-Path ".env")) {
    Write-Host "✗ ERROR: .env file not found" -ForegroundColor Red
    Write-Host "Please run this script from the Backend directory" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Load environment variables
$envFile = Get-Content ".env" | ConvertFrom-StringData
$DB_HOST = $envFile['DB_HOST'] -or 'localhost'
$DB_USER = $envFile['DB_USER'] -or 'root'
$DB_PASSWORD = $envFile['DB_PASSWORD']
$DB_NAME = $envFile['DB_NAME'] -or 'lost_found_db'

Write-Host "Connecting to MySQL..." -ForegroundColor Cyan
Write-Host "Host: $DB_HOST" -ForegroundColor Gray
Write-Host "User: $DB_USER" -ForegroundColor Gray
Write-Host "Database: $DB_NAME" -ForegroundColor Gray
Write-Host ""

# Setup database
if ($DB_PASSWORD) {
    mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD < database.sql
} else {
    mysql -h $DB_HOST -u $DB_USER < database.sql
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "✓ Database setup completed successfully!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Ensure MySQL service is running" -ForegroundColor Yellow
    Write-Host "2. Update .env with correct database credentials if needed" -ForegroundColor Yellow
    Write-Host "3. Run 'npm install' in Backend folder" -ForegroundColor Yellow
    Write-Host "4. Run 'npm install' in Frontend folder" -ForegroundColor Yellow
    Write-Host "5. Use the launcher script to start both services" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Red
    Write-Host "✗ ERROR: Failed to setup database" -ForegroundColor Red
    Write-Host "================================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Make sure MySQL service is running" -ForegroundColor Gray
    Write-Host "2. Verify credentials in .env file" -ForegroundColor Gray
    Write-Host "3. Check if the database already exists" -ForegroundColor Gray
    Write-Host ""
}

Read-Host "Press Enter to exit"
