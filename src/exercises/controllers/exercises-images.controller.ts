import {
  Controller,
  Param,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  UploadedFiles,
  Body,
  UseInterceptors,
} from '@nestjs/common'
import { ExerciseImagesService } from '../services/exercises-images.service'
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger'
import { CreateExerciseImageDto } from '../dto/create-exercise-image.dto'
import { FilesInterceptor } from '@nestjs/platform-express'

@ApiTags('exercise-images')
@ApiBearerAuth()
@Controller('exercises/:exerciseId/images')
export class ExerciseImagesController {
  constructor(private readonly exerciseImagesService: ExerciseImagesService) {}

  @ApiOperation({ summary: 'Establecer imagen principal' })
  @ApiResponse({
    status: 200,
    description: 'La imagen principal ha sido establecida exitosamente.',
  })
  @Patch(':imageId/main')
  @HttpCode(HttpStatus.OK)
  async setMainImage(
    @Param('exerciseId', ParseIntPipe) exerciseId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return await this.exerciseImagesService.setMainImage(imageId, exerciseId)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiOperation({ summary: 'Upload multiple images for an exercise' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'exerciseId', description: 'Exercise ID', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        mainImageIndexes: {
          type: 'array',
          items: {
            type: 'number',
          },
          description:
            'Array of indexes indicating which images should be marked as main',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Images have been successfully uploaded',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request or file upload error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Exercise not found',
  })
  async uploadImages(
    @Param('exerciseId', ParseIntPipe) exerciseId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('mainImageIndexes') mainImageIndexes?: string,
  ) {
    const parsedMainImageIndexes = mainImageIndexes
      ? (JSON.parse(mainImageIndexes) as number[])
      : []

    const createImagesDto: CreateExerciseImageDto[] = files.map(
      (file, index) => ({
        file,
        is_main: parsedMainImageIndexes.includes(index),
      }),
    )

    return this.exerciseImagesService.createMany(createImagesDto, exerciseId)
  }

  @ApiOperation({ summary: 'Eliminar una imagen' })
  @ApiResponse({
    status: 200,
    description: 'La imagen ha sido eliminada exitosamente.',
  })
  @Delete(':imageId')
  @HttpCode(HttpStatus.OK)
  async removeImage(
    @Param('exerciseId', ParseIntPipe) exerciseId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return await this.exerciseImagesService.removeImage(imageId, exerciseId)
  }
}
