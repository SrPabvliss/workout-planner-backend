import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { CategoryType } from '../enums/category-type.enum'

@Injectable()
export class CategoryTypePipe implements PipeTransform<string, CategoryType> {
  transform(value: string): CategoryType {
    const type = value.toUpperCase()
    if (!(type in CategoryType)) {
      throw new BadRequestException(
        `El tipo "${value}" no es válido. Debe ser EXERCISE o MEAL`,
      )
    }
    return CategoryType[type]
  }
}
