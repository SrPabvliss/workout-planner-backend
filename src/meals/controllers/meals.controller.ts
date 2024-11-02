import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common'
import { MealsService } from '../services/meals.service'
import { CreateMealDto } from '../dto/create-meal.dto'
import { UpdateMealDto } from '../dto/update-meal.dto'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'

@ApiTags('meals')
@ApiBearerAuth()
@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @ApiOperation({ summary: 'Create a new meal' })
  @ApiResponse({
    status: 201,
    description: 'The meal has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid meal data provided.',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @Request() req,
  create( @Body() createMealDto: CreateMealDto) {
    try {
      // temporal hasta agregar auth
      return this.mealsService.create(createMealDto, 1)
    } catch (e) {
      console.log(e)
    }
  }

  @ApiOperation({ summary: 'Get all meals' })
  @ApiResponse({
    status: 200,
    description: 'List of all meals.',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.mealsService.findAll()
  }

  @ApiOperation({ summary: 'Get nutritional information for a meal' })
  @ApiResponse({
    status: 200,
    description: 'The meal with calculated nutritional information.',
  })
  @ApiResponse({
    status: 404,
    description: 'Meal not found.',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.mealsService.findOne(+id)
  }

  @ApiOperation({ summary: 'Update a meal' })
  @ApiResponse({
    status: 200,
    description: 'The meal has been successfully updated.',
  })
  @ApiResponse({
    status: 404,
    description: 'Meal not found.',
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateMealDto: UpdateMealDto) {
    return this.mealsService.update(+id, updateMealDto)
  }

  @ApiOperation({ summary: 'Delete a meal' })
  @ApiResponse({
    status: 200,
    description: 'The meal has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Meal not found.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.mealsService.remove(+id)
  }
}
