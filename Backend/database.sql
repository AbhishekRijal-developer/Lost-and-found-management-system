-- Create Database
CREATE DATABASE IF NOT EXISTS lost_found_db;
USE lost_found_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('User', 'Admin') DEFAULT 'User',
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Items Table (Lost & Found Items)
CREATE TABLE IF NOT EXISTS items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100),
  itemType ENUM('Lost', 'Found') NOT NULL,
  status ENUM('Active', 'Resolved', 'Archived') DEFAULT 'Active',
  location VARCHAR(255),
  contactPhone VARCHAR(20),
  contactEmail VARCHAR(100),
  imageUrl VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_itemType (itemType),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt)
);

-- Claims/Matches Table
CREATE TABLE IF NOT EXISTS matches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  lostItemId INT NOT NULL,
  foundItemId INT NOT NULL,
  userId INT NOT NULL,
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lostItemId) REFERENCES items(id) ON DELETE CASCADE,
  FOREIGN KEY (foundItemId) REFERENCES items(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_userId (userId)
);

-- Sample Users (for testing)
INSERT INTO users (name, email, password, phone, role) VALUES 
('Admin User', 'admin@iic.edu.np', '$2a$10$YjJjZGM4MjNhMmU4Nzc4YuZhBW5WzGvKjZcR8Q8vI2O1H7T2i', '9800000001', 'Admin'),
('Test User', 'test@iic.edu.np', '$2a$10$YjJjZGM4MjNhMmU4Nzc4YuZhBW5WzGvKjZcR8Q8vI2O1H7T2i', '9800000002', 'User');
