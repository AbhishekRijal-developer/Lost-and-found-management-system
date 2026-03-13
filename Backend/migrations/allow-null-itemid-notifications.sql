ALTER TABLE notifications
MODIFY COLUMN itemId INT NULL;

ALTER TABLE notifications
DROP FOREIGN KEY fk_notifications_item_id;

ALTER TABLE notifications
ADD CONSTRAINT fk_notifications_item_id
FOREIGN KEY (itemId) REFERENCES items(id) ON DELETE SET NULL;