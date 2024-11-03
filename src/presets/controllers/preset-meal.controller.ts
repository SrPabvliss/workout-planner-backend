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
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreatePresetMealDto } from '../dto/meals/create-preset-meal.dto'
import { UpdatePresetMealDto } from '../dto/meals/update-preset-meal.dto'
import { PresetMealsService } from '../services/preset-meal.service'

@ApiTags('preset-meals')
@Controller('preset-meals')
export class PresetMealsController {
  constructor(private readonly presetMealsService: PresetMealsService) {}

  @ApiOperation({ summary: 'Create a preset meal' })
  @ApiResponse({
    status: 201,
    description: 'The preset meal has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'The preset meal was not created.',
  })
  @ApiResponse({
    status: 404,
    description: 'One or more meals not found.',
  })
  @ApiBody({ type: CreatePresetMealDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPresetMealDto: CreatePresetMealDto) {
    // temporalmente se asigna el id 1 al usuario creador
    return this.presetMealsService.create(createPresetMealDto, 1)
  }

  @ApiOperation({ summary: 'Get all preset meals' })
  @ApiResponse({
    status: 200,
    description: 'The preset meals have been successfully retrieved.',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.presetMealsService.findAll()
  }

  @ApiOperation({ summary: 'Get a preset meal by id' })
  @ApiResponse({
    status: 200,
    description: 'The preset meal has been successfully retrieved.',
  })
  @ApiResponse({
    status: 404,
    description: 'The preset meal with the given id does not exist.',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.presetMealsService.findOne(+id)
  }

  @ApiOperation({ summary: 'Update a preset meal' })
  @ApiResponse({
    status: 200,
    description: 'The preset meal has been successfully updated.',
  })
  @ApiResponse({
    status: 404,
    description: 'The preset meal with the given id does not exist.',
  })
  @ApiBody({ type: UpdatePresetMealDto })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: number,
    @Body() updatePresetMealDto: UpdatePresetMealDto,
  ) {
    return this.presetMealsService.update(id, updatePresetMealDto)
  }

  @ApiOperation({ summary: 'Delete a preset meal' })
  @ApiResponse({
    status: 200,
    description: 'The preset meal has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'The preset meal with the given id does not exist.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: number) {
    return this.presetMealsService.remove(id)
  }
}
