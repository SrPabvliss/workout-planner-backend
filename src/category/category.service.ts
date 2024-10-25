import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { Category } from './entities/category.entity'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { ResponseService } from 'src/shared/response-format/response.service'
import { CategoryType } from './enums/category-type.enum'
import CATEGORY_MESSAGES from './messages/category-messages'
import { normalizeString } from 'src/shared/utils/string-utils'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly responseService: ResponseService,
  ) {}

  private async checkCategoryExists(
    name: string,
    type: string,
    excludeId?: number,
  ) {
    const normalizedName = normalizeString(name)

    const query = this.categoryRepository
      .createQueryBuilder('category')
      .where('LOWER(category.name) = LOWER(:name)', { name: normalizedName })
      .andWhere('category.type = :type', { type })

    if (excludeId) {
      query.andWhere('category.id != :id', { id: excludeId })
    }

    return await query.getOne()
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.checkCategoryExists(
      createCategoryDto.name,
      createCategoryDto.type,
    )

    if (existingCategory) {
      return this.responseService.error(CATEGORY_MESSAGES.ALREADY_EXISTS)
    }

    const newCategory = this.categoryRepository.create({
      ...createCategoryDto,
      name: normalizeString(createCategoryDto.name), // Normalizar al crear
    })

    try {
      const savedCategory = await this.categoryRepository.save(newCategory)
      return this.responseService.success(
        savedCategory,
        CATEGORY_MESSAGES.CREATED,
      )
    } catch (error) {
      console.error('Error creating category:', error)
      return this.responseService.error('Error al crear la categoría')
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id)
    if (!category) {
      return this.responseService.error(CATEGORY_MESSAGES.NOT_FOUND)
    }

    if (updateCategoryDto.name) {
      const existingCategory = await this.checkCategoryExists(
        updateCategoryDto.name,
        category.data.type,
        id,
      )

      if (existingCategory) {
        return this.responseService.error(CATEGORY_MESSAGES.ALREADY_EXISTS)
      }

      // Normalizar el nombre al actualizar
      updateCategoryDto.name = normalizeString(updateCategoryDto.name)
    }

    try {
      const categoryData = {
        ...category.data,
        ...updateCategoryDto,
      }

      const updatedCategory = await this.categoryRepository.save(categoryData)

      return this.responseService.success(
        updatedCategory,
        CATEGORY_MESSAGES.UPDATED,
      )
    } catch (error) {
      console.error('Error updating category:', error)
      return this.responseService.error(CATEGORY_MESSAGES.UPDATE_ERROR)
    }
  }

  async findAll() {
    const categories = await this.categoryRepository.find({
      order: {
        type: 'ASC',
        name: 'ASC',
      },
    })

    if (!categories)
      return this.responseService.error(CATEGORY_MESSAGES.MANY_NOT_FOUND)

    return this.responseService.success(
      categories,
      CATEGORY_MESSAGES.FOUND_MANY,
    )
  }

  async findAllByType(type: CategoryType) {
    const categories = await this.categoryRepository.find({
      where: { type },
      order: { name: 'ASC' },
    })

    if (!categories)
      return this.responseService.error(CATEGORY_MESSAGES.MANY_NOT_FOUND)

    return this.responseService.success(
      categories,
      CATEGORY_MESSAGES.FOUND_MANY,
    )
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id })

    if (!category)
      return this.responseService.error(CATEGORY_MESSAGES.NOT_FOUND)

    return this.responseService.success(category, CATEGORY_MESSAGES.FOUND)
  }

  async remove(id: number) {
    const category = await this.findOne(id)

    if (!category) return

    const deleted = await this.categoryRepository.delete(id)

    if (!deleted)
      return this.responseService.error(CATEGORY_MESSAGES.DELETE_ERROR)

    return this.responseService.success(
      category.data,
      CATEGORY_MESSAGES.DELETED,
    )
  }
}
