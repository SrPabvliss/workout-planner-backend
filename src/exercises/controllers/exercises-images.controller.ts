import {
  Controller,
  Param,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common'
import { ExerciseImagesService } from '../services/exercises-images.service'
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger'

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
