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
import { IngredientsService } from './ingredients.service'
import { CreateIngredientDto } from './dto/create-ingredient.dto'
import { UpdateIngredientDto } from './dto/update-ingredient.dto'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('ingredients')
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @ApiOperation({ summary: 'Create a new ingredient' })
  @ApiResponse({
    status: 201,
    description: 'The ingredient has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ingredient data provided.',
  })
  @ApiResponse({
    status: 409,
    description: 'An ingredient with this name already exists.',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientsService.create(createIngredientDto)
  }

  @ApiOperation({ summary: 'Get all ingredients' })
  @ApiResponse({
    status: 200,
    description: 'List of all active ingredients.',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.ingredientsService.findAll()
  }

  @ApiOperation({ summary: 'Get an ingredient by id' })
  @ApiResponse({
    status: 200,
    description: 'The ingredient has been found.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ingredient not found.',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.ingredientsService.findOne(+id)
  }

  @ApiOperation({ summary: 'Update an ingredient' })
  @ApiResponse({
    status: 200,
    description: 'The ingredient has been successfully updated.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ingredient not found.',
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return this.ingredientsService.update(+id, updateIngredientDto)
  }

  @ApiOperation({ summary: 'Delete an ingredient' })
  @ApiResponse({
    status: 200,
    description: 'The ingredient has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ingredient not found.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.ingredientsService.remove(+id)
  }
}
