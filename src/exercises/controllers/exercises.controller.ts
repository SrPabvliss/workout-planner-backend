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
  ParseIntPipe,
  Req,
} from '@nestjs/common'
import { ExercisesService } from '../services/exercises.service'
import { CreateExerciseDto } from '../dto/create-exercise.dto'
import { UpdateExerciseDto } from '../dto/update-exercise.dto'
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger'

@ApiTags('exercises')
@ApiBearerAuth()
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @ApiOperation({ summary: 'Crear un ejercicio' })
  @ApiResponse({
    status: 201,
    description: 'El ejercicio ha sido creado exitosamente.',
  })
  @ApiBody({ type: CreateExerciseDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createExerciseDto: CreateExerciseDto) {
    // Por ahora pasamos un ID fijo como creador
    return await this.exercisesService.create(createExerciseDto, 1) // ID 1 como ejemplo
  }

  @ApiOperation({ summary: 'Obtener todos los ejercicios' })
  @ApiResponse({
    status: 200,
    description: 'Los ejercicios han sido recuperados exitosamente.',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.exercisesService.findAll()
  }

  @ApiOperation({ summary: 'Obtener un ejercicio por id' })
  @ApiResponse({
    status: 200,
    description: 'El ejercicio ha sido recuperado exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'El ejercicio con el id proporcionado no existe.',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.exercisesService.findOne(id)
  }

  @ApiOperation({ summary: 'Actualizar un ejercicio' })
  @ApiResponse({
    status: 200,
    description: 'El ejercicio ha sido actualizado exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'El ejercicio con el id proporcionado no existe.',
  })
  @ApiBody({ type: UpdateExerciseDto })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return await this.exercisesService.update(id, updateExerciseDto)
  }

  @ApiOperation({ summary: 'Eliminar un ejercicio' })
  @ApiResponse({
    status: 200,
    description: 'El ejercicio ha sido eliminado exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'El ejercicio con el id proporcionado no existe.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.exercisesService.remove(id)
  }
}
