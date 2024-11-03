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
import { PresetExercisesService } from '../services/presets-exercise.service'
import { CreatePresetExerciseDto } from '../dto/exercises/create-preset-exercise.dto'
import { UpdatePresetExerciseDto } from '../dto/exercises/update-preset-exercise.dto'

@ApiTags('preset-exercises')
@Controller('preset-exercises')
export class PresetExercisesController {
  constructor(
    private readonly presetExercisesService: PresetExercisesService,
  ) {}

  @ApiOperation({ summary: 'Create a preset exercise' })
  @ApiResponse({
    status: 201,
    description: 'The preset exercise has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'The preset exercise was not created.',
  })
  @ApiResponse({
    status: 404,
    description: 'One or more exercises not found.',
  })
  @ApiBody({ type: CreatePresetExerciseDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPresetExerciseDto: CreatePresetExerciseDto) {
    // temporalmente se asigna el id 1 al usuario creador
    return this.presetExercisesService.create(createPresetExerciseDto, 1)
  }

  @ApiOperation({ summary: 'Get all preset exercises' })
  @ApiResponse({
    status: 200,
    description: 'The preset exercises have been successfully retrieved.',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.presetExercisesService.findAll()
  }

  @ApiOperation({ summary: 'Get a preset exercise by id' })
  @ApiResponse({
    status: 200,
    description: 'The preset exercise has been successfully retrieved.',
  })
  @ApiResponse({
    status: 404,
    description: 'The preset exercise with the given id does not exist.',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.presetExercisesService.findOne(+id)
  }

  @ApiOperation({ summary: 'Update a preset exercise' })
  @ApiResponse({
    status: 200,
    description: 'The preset exercise has been successfully updated.',
  })
  @ApiResponse({
    status: 404,
    description: 'The preset exercise with the given id does not exist.',
  })
  @ApiBody({ type: UpdatePresetExerciseDto })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: number,
    @Body() updatePresetExerciseDto: UpdatePresetExerciseDto,
  ) {
    return this.presetExercisesService.update(id, updatePresetExerciseDto)
  }

  @ApiOperation({ summary: 'Delete a preset exercise' })
  @ApiResponse({
    status: 200,
    description: 'The preset exercise has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'The preset exercise with the given id does not exist.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: number) {
    return this.presetExercisesService.remove(id)
  }
}
