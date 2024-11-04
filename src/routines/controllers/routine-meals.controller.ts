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
import { RoutineStatus } from '../enums/routine.enum'
import { RoutineMealsService } from '../services/routine-meals.service'
import { CreateRoutineMealDto } from '../dto/meals/create-routine-meal.dto'
import { UpdateRoutineMealDto } from '../dto/meals/update-routine-meal.dto'

@ApiTags('routine-meals')
@Controller('routine-meals')
export class RoutineMealsController {
  constructor(private readonly routineMealsService: RoutineMealsService) {}

  @ApiOperation({ summary: 'Create a meal routine from scratch' })
  @ApiResponse({ status: 201, description: 'Routine successfully created.' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRoutineMealDto: CreateRoutineMealDto) {
    return this.routineMealsService.create(createRoutineMealDto)
  }

  @ApiOperation({ summary: 'Create a meal routine from preset' })
  @ApiResponse({
    status: 201,
    description: 'Routine successfully created from preset.',
  })
  @Post('from-preset/:presetId')
  @HttpCode(HttpStatus.CREATED)
  createFromPreset(
    @Param('presetId') presetId: number,
    @Body() body: { startDate: Date; studentId: number; trainerId: number },
  ) {
    return this.routineMealsService.createFromPreset(
      presetId,
      body.startDate,
      body.studentId,
      body.trainerId,
    )
  }

  @ApiOperation({ summary: 'Get all meal routines' })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.routineMealsService.findAll()
  }

  @ApiOperation({ summary: 'Get all meal routines by student' })
  @Get('student/:studentId')
  @HttpCode(HttpStatus.OK)
  findAllByStudent(@Param('studentId') studentId: number) {
    return this.routineMealsService.findAllByStudent(studentId)
  }

  @ApiOperation({ summary: 'Get all active meal routines by student' })
  @Get('student/:studentId/active')
  @HttpCode(HttpStatus.OK)
  findActiveByStudent(@Param('studentId') studentId: number) {
    return this.routineMealsService.findActiveByStudent(studentId)
  }

  @ApiOperation({ summary: 'Get meal routine by id' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: number) {
    return this.routineMealsService.findOne(id)
  }

  @ApiOperation({ summary: 'Update meal routine' })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: number,
    @Body() updateRoutineMealDto: UpdateRoutineMealDto,
  ) {
    return this.routineMealsService.update(id, updateRoutineMealDto)
  }

  @ApiOperation({ summary: 'Mark meal as consumed' })
  @Patch(':routineId/meals/:mealId/consume')
  @HttpCode(HttpStatus.OK)
  markMealConsumed(
    @Param('routineId') routineId: number,
    @Param('mealId') mealId: number,
  ) {
    return this.routineMealsService.markMealConsumed(routineId, mealId)
  }

  @ApiOperation({ summary: 'Mark meal as not consumed' })
  @Patch(':routineId/meals/:mealId/unconsume')
  @HttpCode(HttpStatus.OK)
  markMealUnconsumed(
    @Param('routineId') routineId: number,
    @Param('mealId') mealId: number,
  ) {
    return this.routineMealsService.markMealUnconsumed(routineId, mealId)
  }

  @ApiOperation({ summary: 'Change routine status' })
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  changeStatus(
    @Param('id') id: number,
    @Body() body: { status: RoutineStatus },
  ) {
    return this.routineMealsService.changeStatus(id, body.status)
  }

  @ApiOperation({ summary: 'Delete meal routine' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: number) {
    return this.routineMealsService.remove(id)
  }
}
