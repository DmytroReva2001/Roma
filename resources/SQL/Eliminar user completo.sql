USE tienda_roma;

SET @id = 95;

DELETE FROM user_tienda_roles
WHERE user_tienda_id = @id;

DELETE FROM user_tienda
WHERE id = @id;