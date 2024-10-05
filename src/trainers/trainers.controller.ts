import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { TrainersService } from './trainers.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @ApiOperation({ summary: 'Create a trainer' })
  @ApiResponse({
    status: 201,
    description: 'The trainer has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'The trainer was not created.',
  })
  @ApiResponse({
    status: 409,
    description: 'The trainer already exists.',
  })
  @ApiBody({ type: CreateTrainerDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTrainerDto: CreateTrainerDto) {
    return this.trainersService.create(createTrainerDto);
  }

  @ApiOperation({ summary: 'Get all trainers' })
  @ApiResponse({
    status: 200,
    description: 'The trainers have been successfully retrieved.',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.trainersService.findAll();
  }

  @ApiOperation({ summary: 'Get a trainer by id' })
  @ApiResponse({
    status: 200,
    description: 'The trainer has been successfully retrieved.',
  })
  @ApiResponse({
    status: 404,
    description: 'The trainer with the given id does not exist.',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.trainersService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a trainer' })
  @ApiResponse({
    status: 200,
    description: 'The trainer has been successfully updated.',
  })
  @ApiResponse({
    status: 404,
    description: 'The trainer with the given id does not exist.',
  })
  @ApiBody({ type: UpdateTrainerDto })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateTrainerDto: UpdateTrainerDto) {
    return this.trainersService.update(+id, updateTrainerDto);
  }

  @ApiOperation({ summary: 'Delete a trainer' })
  @ApiResponse({
    status: 200,
    description: 'The trainer has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'The trainer with the given id does not exist.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.trainersService.remove(+id);
  }
}
