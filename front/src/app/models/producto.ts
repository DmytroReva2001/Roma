export interface Producto {
    id?: number; // El signo de interrogación indica que el id es opcional, ya que podría no estar presente al crear un nuevo producto
    nombreProducto: string;
    precio: number;
    descripcionCorta: string;
    descripcionLarga: string;
    imagenes: string[]; // Suponiendo que las imágenes son un array de URLs
    tipoProducto: string; // Otra opción es usar un enum si los tipos de producto son finitos y conocidos de antemano
  }  