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
import { MealCategory } from 'src/category/entities/meal-category.entity'
import { Category } from 'src/category/entities/category.entity'

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
    @InjectRepository(MealCategory)
    private readonly mealCategoriesRepository: Repository<MealCategory>,
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

      if (createMealDto.categories?.length) {
        const mealCategories = createMealDto.categories.map((categoryId) =>
          this.mealCategoriesRepository.create({
            meal: savedMeal,
            category: { id: categoryId },
          }),
        )
        await this.mealCategoriesRepository.save(mealCategories)
      }

      const created = await this.findOne(savedMeal.id)

      if (!created) return

      return this.responseService.success(created.data, MEAL_MESSAGES.CREATED)
    } catch (e) {
      console.log(e)
      return this.responseService.error(MEAL_MESSAGES.CREATE_ERROR)
    }
  }

  async findAll() {
    const meals = await this.mealsRepository.find({
      relations: [
        'meal_ingredients',
        'meal_ingredients.ingredient',
        'meal_ingredients.unit',
        'meal_categories',
        'meal_categories.category',
      ],
    })

    if (!meals?.length) {
      return this.responseService.error(MEAL_MESSAGES.MANY_NOT_FOUND)
    }

    const mealsWithNutritionalInfo = await Promise.all(
      meals.map(async (meal) => {
        const nutritionalInfo = await this.calculateNutritionalInfo(meal)

        return { ...meal, nutritional_info: nutritionalInfo }
      }),
    )

    return this.responseService.success(
      mealsWithNutritionalInfo,
      MEAL_MESSAGES.FOUND_MANY,
    )
  }

  async findOne(id: number) {
    const meal = await this.mealsRepository.findOne({
      where: { id },
      relations: [
        'meal_ingredients',
        'meal_ingredients.ingredient',
        'meal_ingredients.unit',
        'meal_categories',
        'meal_categories.category',
      ],
    })

    if (!meal) {
      return this.responseService.error(MEAL_MESSAGES.NOT_FOUND)
    }

    const nutritionalInfo = await this.calculateNutritionalInfo(meal)

    return this.responseService.success(
      { ...meal, nutritional_info: nutritionalInfo },
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

    for (const mealIngredient of meal.meal_ingredients) {
      const { nutritional_info: ingredientInfo } = mealIngredient.ingredient
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
    try {
      const mealResult = await this.findOne(id)
      if (!mealResult) return

      const originalMeal = await this.mealsRepository.findOne({
        where: { id },
        relations: [
          'meal_ingredients',
          'meal_ingredients.ingredient',
          'meal_ingredients.unit',
          'meal_categories',
          'meal_categories.category',
        ],
      })

      if (!originalMeal) {
        return this.responseService.error(MEAL_MESSAGES.NOT_FOUND)
      }

      const updatedMealData = {
        ...originalMeal,
        name: updateMealDto.name || originalMeal.name,
        description: updateMealDto.description || originalMeal.description,
        preparation: updateMealDto.preparation || originalMeal.preparation,
      }

      delete updatedMealData.meal_categories
      delete updatedMealData.meal_ingredients

      const updatedMeal = await this.mealsRepository.save(updatedMealData)

      if (updateMealDto.categories) {
        await this.mealCategoriesRepository.query(
          `DELETE FROM meal_categories WHERE meal_id = $1`,
          [id],
        )

        if (updateMealDto.categories.length > 0) {
          const values = updateMealDto.categories
            .map((categoryId) => `(${id}, ${categoryId})`)
            .join(',')

          await this.mealCategoriesRepository.query(
            `INSERT INTO meal_categories (meal_id, category_id) VALUES ${values}`,
          )
        }
      }

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
              meal: updatedMeal,
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

      const updated = await this.findOne(id)

      if (!updated) return

      return this.responseService.success(updated.data, MEAL_MESSAGES.UPDATED)
    } catch (error) {
      console.log(error)
      return this.responseService.error(MEAL_MESSAGES.UPDATE_ERROR)
    }
  }

  async remove(id: number) {
    const meal = await this.findOne(id)

    if (!meal) return

    await this.mealsRepository.remove(meal.data)

    return this.responseService.success(meal.data, MEAL_MESSAGES.DELETED)
  }
}
