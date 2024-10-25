// exercises/messages/exercise-messages.ts
const EXERCISE_MESSAGES = {
  // Success messages
  CREATED: 'Ejercicio creado exitosamente',
  UPDATED: 'Ejercicio actualizado exitosamente',
  DELETED: 'Ejercicio eliminado exitosamente',
  FOUND: 'Ejercicio encontrado',
  FOUND_MANY: 'Ejercicios encontrados',

  // Image related messages
  IMAGES_CREATED: 'Imágenes agregadas exitosamente',
  MAIN_IMAGE_UPDATED: 'Imagen principal actualizada exitosamente',
  IMAGE_DELETED: 'Imagen eliminada exitosamente',

  // Error messages
  NOT_FOUND: 'Ejercicio no encontrado',
  MANY_NOT_FOUND: 'No se encontraron ejercicios',
  ALREADY_EXISTS: 'Ya existe un ejercicio con ese nombre',
  CREATE_ERROR: 'Error al crear el ejercicio',
  UPDATE_ERROR: 'Error al actualizar el ejercicio',
  DELETE_ERROR: 'Error al eliminar el ejercicio',
  FIND_ERROR: 'Error al buscar el ejercicio',

  // Image related error messages
  IMAGES_CREATE_ERROR: 'Error al crear las imágenes',
  MAIN_IMAGE_UPDATE_ERROR: 'Error al actualizar la imagen principal',
  IMAGE_NOT_FOUND: 'Imagen no encontrada',
  IMAGE_DELETE_ERROR: 'Error al eliminar la imagen',
}

export default EXERCISE_MESSAGES
