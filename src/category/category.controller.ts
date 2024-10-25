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
  Query,
  ParseIntPipe,
} from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { CategoryType } from './enums/category-type.enum'
import { CategoryTypePipe } from './pipes/category-type.pipe'

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Crear una categoría' })
  @ApiResponse({
    status: 201,
    description: 'La categoría ha sido creada exitosamente.',
  })
  @ApiBody({ type: CreateCategoryDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto)
  }

  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({
    status: 200,
    description: 'Las categorías han sido recuperadas exitosamente.',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.categoryService.findAll()
  }

  @ApiOperation({ summary: 'Obtener categorías por tipo' })
  @ApiResponse({
    status: 200,
    description: 'Las categorías han sido recuperadas exitosamente.',
  })
  @ApiQuery({ name: 'type', enum: CategoryType })
  @Get('type/:type')
  @HttpCode(HttpStatus.OK)
  async findAllByType(@Param('type', CategoryTypePipe) type: CategoryType) {
    return await this.categoryService.findAllByType(type)
  }

  @ApiOperation({ summary: 'Obtener una categoría por id' })
  @ApiResponse({
    status: 200,
    description: 'La categoría ha sido recuperada exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'La categoría con el id proporcionado no existe.',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number) {
    return await this.categoryService.findOne(id)
  }

  @ApiOperation({ summary: 'Actualizar una categoría' })
  @ApiResponse({
    status: 200,
    description: 'La categoría ha sido actualizada exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'La categoría con el id proporcionado no existe.',
  })
  @ApiBody({ type: UpdateCategoryDto })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(id, updateCategoryDto)
  }

  @ApiOperation({ summary: 'Eliminar una categoría' })
  @ApiResponse({
    status: 200,
    description: 'La categoría ha sido eliminada exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'La categoría con el id proporcionado no existe.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.remove(id)
  }
}
