# Lost and Found Database Setup Script for PowerShell

Write-Host "`n========================================"
Write-Host "Lost & Found Database Setup"
Write-Host "========================================`n"
Write-Host "This script will create the database and tables."
Write-Host "Make sure MySQL is running on localhost.`n"

$dbUser = "root"
$dbPass = ""  # Change if you have a password
$dbFile = "./database.sql"

# If you have a MySQL password, uncomment and modify:
# $dbPass = "-p yourPassword"

Write-Host "Importing database schema...`n"

# Read SQL file and pipe to mysql
$sqlContent = Get-Content $dbFile -Raw
$sqlContent | mysql -u $dbUser $dbPass

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================"
    Write-Host "✅ Database setup completed successfully!"
    Write-Host "========================================`n"
    Write-Host "Database created: lost_found_db"
    Write-Host "Tables created: users, items, matches`n"
    Write-Host "Sample users created:"
    Write-Host "- Admin: admin@iic.edu.np / password"
    Write-Host "- User: test@iic.edu.np / password`n"
} else {
    Write-Host "`n========================================"
    Write-Host "❌ Error setting up database!"
    Write-Host "========================================`n"
    Write-Host "Please ensure:"
    Write-Host "- MySQL is running"
    Write-Host "- Username and password are correct"
    Write-Host "- database.sql file exists`n"
}

Read-Host "Press Enter to exit"
