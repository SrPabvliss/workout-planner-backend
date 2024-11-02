import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Meal } from '../entities/meal.entity'
import { MealIngredient } from '../entities/meal-ingredient.entity'
import { CreateMealDto } from '../dto/create-meal.dto'
import { UpdateMealDto } from '../dto/update-meal.dto'
import { ResponseService } from '../../shared/response-format/response.service'
import { IngredientsService } from '../../ingredients/ingredients.service'
import { Unit } from '../entities/units.entity'
import MEAL_MESSAGES from '../messages/meal-messages'

interface NutritionalCalculation {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
  sodium?: number
}

@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Meal)
    private readonly mealsRepository: Repository<Meal>,
    @InjectRepository(MealIngredient)
    private readonly mealIngredientsRepository: Repository<MealIngredient>,
    @InjectRepository(Unit)
    private readonly unitsRepository: Repository<Unit>,
    private readonly ingredientsService: IngredientsService,
    private readonly responseService: ResponseService,
  ) {}

  async create(createMealDto: CreateMealDto, userId: number = 1) {
    try {
      const meal = this.mealsRepository.create({
        name: createMealDto.name,
        description: createMealDto.description,
        preparation: createMealDto.preparation,
        created_by: { id: userId },
      })

      const savedMeal = await this.mealsRepository.save(meal)

      const mealIngredients = await Promise.all(
        createMealDto.ingredients.map(async (ingredientDto) => {
          const ingredient = await this.ingredientsService.findOne(
            ingredientDto.ingredient_id,
          )
          const unit = await this.unitsRepository.findOneBy({
            id: ingredientDto.unit_id,
          })

          if (!ingredient || !unit) return null

          return this.mealIngredientsRepository.create({
            meal: savedMeal,
            ingredient: ingredient.data,
            unit,
            quantity: ingredientDto.quantity,
          })
        }),
      )

      const validMealIngredients = mealIngredients.filter(
        (mi): mi is MealIngredient => mi !== null,
      )
      await this.mealIngredientsRepository.save(validMealIngredients)

      return this.responseService.success(
        await this.findOne(savedMeal.id),
        MEAL_MESSAGES.CREATED,
      )
    } catch (e) {
      console.log(e)
      return this.responseService.error(MEAL_MESSAGES.CREATE_ERROR)
    }
  }

  async findAll() {
    const meals = await this.mealsRepository.find({
      relations: [
        'mealIngredients',
        'mealIngredients.ingredient',
        'mealIngredients.unit',
      ],
    })

    if (!meals?.length) {
      return this.responseService.error(MEAL_MESSAGES.MANY_NOT_FOUND)
    }

    return this.responseService.success(meals, MEAL_MESSAGES.FOUND_MANY)
  }

  async findOne(id: number) {
    const meal = await this.mealsRepository.findOne({
      where: { id },
      relations: [
        'mealIngredients',
        'mealIngredients.ingredient',
        'mealIngredients.unit',
      ],
    })

    if (!meal) {
      return this.responseService.error(MEAL_MESSAGES.NOT_FOUND)
    }

    const nutritionalInfo = await this.calculateNutritionalInfo(meal)

    return this.responseService.success(
      { ...meal, nutritionalInfo },
      MEAL_MESSAGES.FOUND,
    )
  }

  private async calculateNutritionalInfo(
    meal: Meal,
  ): Promise<NutritionalCalculation> {
    const nutritionalInfo: NutritionalCalculation = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    }

    for (const mealIngredient of meal.mealIngredients) {
      const { nutritionalInfo: ingredientInfo } = mealIngredient.ingredient
      const proportion = this.calculateProportion(
        mealIngredient.quantity,
        mealIngredient.unit,
        ingredientInfo.serving_size,
        ingredientInfo.serving_unit,
      )

      nutritionalInfo.calories += ingredientInfo.calories * proportion
      nutritionalInfo.protein += ingredientInfo.protein * proportion
      nutritionalInfo.carbs += ingredientInfo.carbs * proportion
      nutritionalInfo.fat += ingredientInfo.fat * proportion
      if (ingredientInfo.fiber)
        nutritionalInfo.fiber += ingredientInfo.fiber * proportion
      if (ingredientInfo.sugar)
        nutritionalInfo.sugar += ingredientInfo.sugar * proportion
      if (ingredientInfo.sodium)
        nutritionalInfo.sodium += ingredientInfo.sodium * proportion
    }

    return {
      calories: Math.round(nutritionalInfo.calories * 100) / 100,
      protein: Math.round(nutritionalInfo.protein * 100) / 100,
      carbs: Math.round(nutritionalInfo.carbs * 100) / 100,
      fat: Math.round(nutritionalInfo.fat * 100) / 100,
      fiber: nutritionalInfo.fiber
        ? Math.round(nutritionalInfo.fiber * 100) / 100
        : undefined,
      sugar: nutritionalInfo.sugar
        ? Math.round(nutritionalInfo.sugar * 100) / 100
        : undefined,
      sodium: nutritionalInfo.sodium
        ? Math.round(nutritionalInfo.sodium * 100) / 100
        : undefined,
    }
  }
  private calculateProportion(
    quantity: number,
    unit: Unit,
    servingSize: number,
    servingUnit: string,
  ): number {
    // TODO: Implementar conversiones entre unidades
    return quantity / servingSize
  }

  async update(id: number, updateMealDto: UpdateMealDto) {
    const meal = await this.findOne(id)

    if (!meal) return

    if (updateMealDto.name) meal.data.name = updateMealDto.name
    if (updateMealDto.description)
      meal.data.description = updateMealDto.description
    if (updateMealDto.preparation)
      meal.data.preparation = updateMealDto.preparation

    if (updateMealDto.ingredients) {
      await this.mealIngredientsRepository.delete({ meal: { id } })

      const mealIngredients = await Promise.all(
        updateMealDto.ingredients.map(async (ingredientDto) => {
          const ingredient = await this.ingredientsService.findOne(
            ingredientDto.ingredient_id,
          )
          const unit = await this.unitsRepository.findOneBy({
            id: ingredientDto.unit_id,
          })

          if (!ingredient || !unit) return null

          return this.mealIngredientsRepository.create({
            meal: meal.data,
            ingredient: ingredient.data,
            unit,
            quantity: ingredientDto.quantity,
          })
        }),
      )

      const validMealIngredients = mealIngredients.filter(
        (mi): mi is MealIngredient => mi !== null,
      )
      await this.mealIngredientsRepository.save(validMealIngredients)
    }

    const updatedMeal = await this.mealsRepository.save(meal.data)

    return this.responseService.success(
      await this.findOne(updatedMeal.id),
      MEAL_MESSAGES.UPDATED,
    )
  }

  async remove(id: number) {
    const meal = await this.findOne(id)

    if (!meal) return

    await this.mealsRepository.remove(meal.data)

    return this.responseService.success(meal.data, MEAL_MESSAGES.DELETED)
  }
}
