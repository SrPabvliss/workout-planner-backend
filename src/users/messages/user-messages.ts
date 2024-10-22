enum USER_MESSAGES {
  CREATED = 'El usuario ha sido creado con éxito',
  CREATE_ERROR = 'Error al crear el usuario',
  UPDATED = 'El usuario ha sido actualizado con éxito',
  UPDATE_ERROR = 'Error al actualizar el usuario',
  DELETED = 'El usuario ha sido eliminado con éxito',
  DELETE_ERROR = 'Error al eliminar el usuario',
  FOUND = 'El usuario ha sido encontrado con éxito',
  FOUND_MANY = 'Los usuarios han sido encontrados con éxito',
  NOT_FOUND = 'El usuario no ha sido encontrado',
  MANY_NOT_FOUND = 'No se encontraron usuarios',
  ALREADY_EXISTS = 'El usuario ya existe',
  INVALID_CREDENTIALS = 'Credenciales inválidas',
  LOGIN_SUCCESS = 'Bienvenido de vuelta',
  USERNAME_ALREADY_EXISTS = 'Nombre de usuario no disponible',
  EMAIL_ALREADY_EXISTS = 'Email ya registrado',
}

export default USER_MESSAGES
