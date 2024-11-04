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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RoutineStatus } from '../enums/routine.enum'
import { RoutineExercisesService } from '../services/routine-exercises.service'
import { CreateRoutineExerciseDto } from '../dto/exercises/create-routine-exercise.dto'
import { UpdateRoutineExerciseDto } from '../dto/exercises/update-routine-exercise.dto'

@ApiTags('routine-exercises')
@Controller('routine-exercises')
export class RoutineExercisesController {
  constructor(
    private readonly routineExercisesService: RoutineExercisesService,
  ) {}

  @ApiOperation({ summary: 'Create a routine exercise from scratch' })
  @ApiResponse({ status: 201, description: 'Routine successfully created.' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRoutineExerciseDto: CreateRoutineExerciseDto) {
    return this.routineExercisesService.create(createRoutineExerciseDto)
  }

  @ApiOperation({ summary: 'Create a routine exercise from preset' })
  @ApiResponse({
    status: 201,
    description: 'Routine successfully created from preset.',
  })
  @Post('from-preset/:presetId')
  @HttpCode(HttpStatus.CREATED)
  createFromPreset(
    @Param('presetId') presetId: number,
    @Body() body: { startDate: string; studentId: number },
  ) {
    return this.routineExercisesService.createFromPreset(
      presetId,
      new Date(body.startDate),
      body.studentId,
    )
  }

  @ApiOperation({ summary: 'Get all exercise routines' })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.routineExercisesService.findAll()
  }

  @ApiOperation({ summary: 'Get all exercise routines by student' })
  @Get('student/:studentId')
  @HttpCode(HttpStatus.OK)
  findAllByStudent(@Param('studentId') studentId: number) {
    return this.routineExercisesService.findAllByStudent(studentId)
  }

  @ApiOperation({ summary: 'Get all active exercise routines by student' })
  @Get('student/:studentId/active')
  @HttpCode(HttpStatus.OK)
  findActiveByStudent(@Param('studentId') studentId: number) {
    return this.routineExercisesService.findActiveByStudent(studentId)
  }

  @ApiOperation({ summary: 'Get exercise routine by id' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: number) {
    return this.routineExercisesService.findOne(id)
  }

  @ApiOperation({ summary: 'Update exercise routine' })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: number,
    @Body() updateRoutineExerciseDto: UpdateRoutineExerciseDto,
  ) {
    return this.routineExercisesService.update(id, updateRoutineExerciseDto)
  }

  @ApiOperation({ summary: 'Mark exercise as completed' })
  @Patch(':routineId/exercises/:exerciseId/complete')
  @HttpCode(HttpStatus.OK)
  markExerciseCompleted(
    @Param('routineId') routineId: number,
    @Param('exerciseId') exerciseId: number,
  ) {
    return this.routineExercisesService.markExerciseCompleted(
      routineId,
      exerciseId,
    )
  }

  @ApiOperation({ summary: 'Mark exercise as uncompleted' })
  @Patch(':routineId/exercises/:exerciseId/uncomplete')
  @HttpCode(HttpStatus.OK)
  markExerciseUncompleted(
    @Param('routineId') routineId: number,
    @Param('exerciseId') exerciseId: number,
  ) {
    return this.routineExercisesService.markExerciseUncompleted(
      routineId,
      exerciseId,
    )
  }

  @ApiOperation({ summary: 'Change routine status' })
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  changeStatus(
    @Param('id') id: number,
    @Body() body: { status: RoutineStatus },
  ) {
    return this.routineExercisesService.changeStatus(id, body.status)
  }

  @ApiOperation({ summary: 'Delete exercise routine' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: number) {
    return this.routineExercisesService.remove(id)
  }
}
