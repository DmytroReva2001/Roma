USE tienda_roma;

SET @id = 11;

DELETE FROM tatuaje_imagenes
WHERE tatuaje_id = @id;

DELETE FROM tatuajes
WHERE id = @id;