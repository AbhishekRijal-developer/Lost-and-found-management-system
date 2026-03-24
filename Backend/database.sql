-- Create Database
CREATE DATABASE IF NOT EXISTS projectdb;
USE projectdb;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  isEmailVerified BOOLEAN NOT NULL DEFAULT FALSE,
  emailVerificationOtp VARCHAR(64) DEFAULT NULL,
  emailVerificationExpires DATETIME DEFAULT NULL,
  resetPasswordToken VARCHAR(64) DEFAULT NULL,
  resetPasswordExpires DATETIME DEFAULT NULL,
  phone VARCHAR(20),
  profilePicture LONGTEXT NULL,
  bio TEXT NULL,
  department VARCHAR(120) NULL,
  batch VARCHAR(60) NULL,
  location VARCHAR(255) NULL,
  role ENUM('User', 'Admin') DEFAULT 'User',
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_isEmailVerified (isEmailVerified),
  INDEX idx_emailVerificationOtp (emailVerificationOtp),
  INDEX idx_resetPasswordToken (resetPasswordToken)
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
  imageUrl LONGTEXT,
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

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  itemId INT NOT NULL,
  senderId INT NOT NULL,
  receiverId INT NOT NULL,
  message TEXT NOT NULL,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (itemId) REFERENCES items(id) ON DELETE CASCADE,
  FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiverId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_itemId (itemId),
  INDEX idx_senderId (senderId),
  INDEX idx_receiverId (receiverId),
  INDEX idx_createdAt (createdAt)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  itemId INT DEFAULT NULL,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (itemId) REFERENCES items(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_isRead (isRead)
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('Open', 'Addressed') DEFAULT 'Open',
  adminReply TEXT NULL,
  repliedBy INT NULL,
  repliedAt DATETIME NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (repliedBy) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_contact_status (status),
  INDEX idx_contact_createdAt (createdAt)
);

-- Sample Users (for testing)
INSERT INTO users (name, email, password, phone, role, isEmailVerified) VALUES 
('Admin User', 'admin@iic.edu.np', '$2a$10$YjJjZGM4MjNhMmU4Nzc4YuZhBW5WzGvKjZcR8Q8vI2O1H7T2i', '9800000001', 'Admin', TRUE),
('Test User', 'test@iic.edu.np', '$2a$10$YjJjZGM4MjNhMmU4Nzc4YuZhBW5WzGvKjZcR8Q8vI2O1H7T2i', '9800000002', 'User', TRUE);


