import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { Ingredient } from './entities/ingredient.entity'
import { NutritionalInfo } from './entities/nutritional-info.entity'
import { CreateIngredientDto } from './dto/create-ingredient.dto'
import { UpdateIngredientDto } from './dto/update-ingredient.dto'
import { ResponseService } from '../shared/response-format/response.service'
import INGREDIENT_MESSAGES from './messages/ingredient-messages'

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientsRepository: Repository<Ingredient>,
    @InjectRepository(NutritionalInfo)
    private readonly nutritionalInfoRepository: Repository<NutritionalInfo>,
    private readonly responseService: ResponseService,
  ) {}

  async create(createIngredientDto: CreateIngredientDto) {
    const normalized_name = createIngredientDto.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '')
      .trim()

    const existing = await this.ingredientsRepository.findOne({
      where: { normalized_name },
    })

    if (existing) {
      return this.responseService.error(INGREDIENT_MESSAGES.ALREADY_EXISTS)
    }

    const ingredient = this.ingredientsRepository.create({
      name: createIngredientDto.name,
      normalized_name,
    })

    const savedIngredient = await this.ingredientsRepository.save(ingredient)

    const nutritionalInfo = this.nutritionalInfoRepository.create({
      ...createIngredientDto.nutritional_info,
      ingredient: savedIngredient,
    })

    await this.nutritionalInfoRepository.save(nutritionalInfo)

    const saved = await this.findOne(savedIngredient.id)

    if (!saved) return

    return this.responseService.success(saved.data, INGREDIENT_MESSAGES.CREATED)
  }

  async findAll() {
    const ingredients = await this.ingredientsRepository.find({
      where: { is_active: true },
      relations: ['nutritional_info'],
    })

    if (!ingredients?.length) {
      return this.responseService.error(INGREDIENT_MESSAGES.MANY_NOT_FOUND)
    }

    return this.responseService.success(
      ingredients.map((ingredient) => ({
        ...ingredient,
        nutritional_info: ingredient.nutritional_info,
      })),
      INGREDIENT_MESSAGES.FOUND_MANY,
    )
  }

  async findOne(id: number) {
    const ingredient = await this.ingredientsRepository.findOne({
      where: { id, is_active: true },
      relations: ['nutritional_info'],
    })

    if (!ingredient) {
      return this.responseService.error(INGREDIENT_MESSAGES.NOT_FOUND)
    }

    return this.responseService.success(
      {
        ...ingredient,
        nutritional_info: ingredient.nutritional_info,
      },
      INGREDIENT_MESSAGES.FOUND,
    )
  }

  async update(id: number, updateIngredientDto: UpdateIngredientDto) {
    const ingredient = await this.findOne(id)

    if (!ingredient) return

    if (updateIngredientDto.name) {
      const normalized_name = updateIngredientDto.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '')
        .trim()

      const existing = await this.ingredientsRepository.findOne({
        where: { normalized_name, id: Not(id) },
      })

      if (existing) {
        return this.responseService.error(INGREDIENT_MESSAGES.ALREADY_EXISTS)
      }

      ingredient.data.name = updateIngredientDto.name
      ingredient.data.normalized_name = normalized_name
    }

    if (updateIngredientDto.nutritional_info) {
      await this.nutritionalInfoRepository.update(
        ingredient.data.nutritionalInfo.id,
        updateIngredientDto.nutritional_info,
      )
    }

    const updated = await this.ingredientsRepository.save(ingredient.data)

    const saved = await this.findOne(updated.id)

    if (!saved) return
    return this.responseService.success(saved.data, INGREDIENT_MESSAGES.UPDATED)
  }

  async remove(id: number) {
    const ingredient = await this.findOne(id)

    if (!ingredient) return

    ingredient.data.is_active = false
    await this.ingredientsRepository.save(ingredient.data)

    return this.responseService.success(
      { ...ingredient.data, nutritional_info: ingredient.data.nutritionalInfo },
      INGREDIENT_MESSAGES.DELETED,
    )
  }
}
