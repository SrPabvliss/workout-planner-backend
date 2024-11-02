const UNIT_MESSAGES = {
  CREATED: 'Unidad de medida creada exitosamente',
  UPDATED: 'Unidad de medida actualizada exitosamente',
  DELETED: 'Unidad de medida eliminada exitosamente',
  FOUND: 'Unidad de medida encontrada',
  FOUND_MANY: 'Unidades de medida encontradas',

  NOT_FOUND: 'Unidad de medida no encontrada',
  MANY_NOT_FOUND: 'No se encontraron unidades de medida',
  ALREADY_EXISTS: 'Ya existe una unidad de medida con ese símbolo',
  CREATE_ERROR: 'Error al crear la unidad de medida',
  UPDATE_ERROR: 'Error al actualizar la unidad de medida',
  DELETE_ERROR: 'Error al eliminar la unidad de medida',

  INVALID_TYPE: 'El tipo de unidad no es válido',
  INVALID_SYMBOL: 'El símbolo de la unidad no es válido',
  INVALID_NAME: 'El nombre de la unidad no es válido',

  INVALID_MASS_UNIT: 'La unidad de masa no es válida',
  INVALID_VOLUME_UNIT: 'La unidad de volumen no es válida',
  INVALID_UNIT_TYPE: 'La unidad de tipo unidad no es válida',

  INCOMPATIBLE_UNITS: 'Las unidades no son compatibles para conversión',
  CONVERSION_ERROR: 'Error al realizar la conversión de unidades',

  UNIT_IN_USE:
    'No se puede eliminar la unidad porque está siendo utilizada en una o más comidas',
  UNIT_NOT_COMPATIBLE:
    'La unidad no es compatible con el ingrediente seleccionado',
}

export default UNIT_MESSAGES
