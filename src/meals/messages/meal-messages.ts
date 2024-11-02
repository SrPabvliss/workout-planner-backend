const MEAL_MESSAGES = {
  CREATED: 'Comida creada exitosamente',
  UPDATED: 'Comida actualizada exitosamente',
  DELETED: 'Comida eliminada exitosamente',
  FOUND: 'Comida encontrada',
  FOUND_MANY: 'Comidas encontradas',

  NOT_FOUND: 'Comida no encontrada',
  MANY_NOT_FOUND: 'No se encontraron comidas',
  CREATE_ERROR: 'Error al crear la comida',
  UPDATE_ERROR: 'Error al actualizar la comida',
  DELETE_ERROR: 'Error al eliminar la comida',

  INVALID_INGREDIENT: 'Uno o más ingredientes no son válidos',
  INVALID_QUANTITY: 'La cantidad del ingrediente debe ser mayor a 0',
  NO_INGREDIENTS: 'Debe especificar al menos un ingrediente',
  DUPLICATE_INGREDIENT: 'No puede usar el mismo ingrediente más de una vez',

  INVALID_UNIT: 'Una o más unidades de medida no son válidas',
  UNIT_NOT_FOUND: 'Unidad de medida no encontrada',
  INCOMPATIBLE_UNIT: 'La unidad de medida no es compatible con el ingrediente',

  CALCULATION_ERROR: 'Error al calcular la información nutricional',

  INVALID_CATEGORY: 'Una o más categorías no son válidas',
  CATEGORY_NOT_FOUND: 'Categoría no encontrada',
}

export default MEAL_MESSAGES
