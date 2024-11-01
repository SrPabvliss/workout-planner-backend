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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { ExercisesService } from '../services/exercises.service'
import { CreateExerciseDto } from '../dto/create-exercise.dto'
import { UpdateExerciseDto } from '../dto/update-exercise.dto'
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger'

@ApiTags('exercises')
@ApiBearerAuth()
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createExerciseDto: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const parsedDto = {
      ...createExerciseDto,
      categories: JSON.parse(createExerciseDto.categories || '[]'),
      mainImageIndexes: JSON.parse(createExerciseDto.mainImageIndexes || '[]'),
      images: files,
    }

    return await this.exercisesService.create(parsedDto, 1)
  }

  @ApiOperation({ summary: 'Actualizar un ejercicio' })
  @ApiResponse({
    status: 200,
    description: 'El ejercicio ha sido actualizado exitosamente.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        youtube_url: { type: 'string' },
        categories: {
          type: 'array',
          items: { type: 'number' },
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        mainImageIndexes: {
          type: 'array',
          items: { type: 'number' },
        },
      },
    },
  })
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 10))
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExerciseDto: UpdateExerciseDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const categories = updateExerciseDto.categories
      ? JSON.parse(updateExerciseDto.categories as unknown as string)
      : undefined

    const mainImageIndexes = updateExerciseDto.mainImageIndexes
      ? JSON.parse(updateExerciseDto.mainImageIndexes as unknown as string)
      : []

    return await this.exercisesService.update(id, {
      ...updateExerciseDto,
      categories,
      mainImageIndexes,
      images: files,
    })
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.exercisesService.findAll()
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.exercisesService.findOne(id)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.exercisesService.remove(id)
  }
}
