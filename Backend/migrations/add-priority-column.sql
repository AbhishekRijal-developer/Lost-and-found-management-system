-- Add priority column to items table
ALTER TABLE items ADD COLUMN priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium';

-- Add index for priority column for better query performance
ALTER TABLE items ADD INDEX idx_priority (priority);
