CREATE USER 'tiendaRoma_user'@'localhost' IDENTIFIED BY 'tiendaRoma1234';

GRANT ALL PRIVILEGES ON tienda_roma.* TO 'tiendaRoma_user'@'localhost';

FLUSH privileges;