export interface Tatuaje {
    id?: number; // El signo de interrogación indica que el id es opcional, ya que podría no estar presente al crear un nuevo producto
    nombreTatuaje: string;
    descripcion: string;
    imagenes: string[]; // Suponiendo que las imágenes son un array de URLs
  }