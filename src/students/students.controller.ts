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
import { StudentsService } from './students.service'
import { CreateStudentDto } from './dto/create-student.dto'
import { UpdateStudentDto } from './dto/update-student.dto'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @ApiOperation({ summary: 'Create a student' })
  @ApiResponse({
    status: 201,
    description: 'The student has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'The student was not created.',
  })
  @ApiResponse({
    status: 409,
    description: 'The student already exists.',
  })
  @ApiBody({ type: CreateStudentDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto)
  }

  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({
    status: 200,
    description: 'The students have been successfully retrieved.',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.studentsService.findAll()
  }

  @ApiOperation({ summary: 'Get a student by id' })
  @ApiResponse({
    status: 200,
    description: 'The student has been successfully retrieved.',
  })
  @ApiResponse({
    status: 404,
    description: 'The student with the given id does not exist.',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id)
  }

  @ApiOperation({ summary: 'Update a student' })
  @ApiResponse({
    status: 200,
    description: 'The student has been successfully updated.',
  })
  @ApiResponse({
    status: 404,
    description: 'The student with the given id does not exist.',
  })
  @ApiBody({ type: UpdateStudentDto })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: number, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto)
  }

  @ApiOperation({ summary: 'Delete a student' })
  @ApiResponse({
    status: 200,
    description: 'The student has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'The student with the given id does not exist.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: number) {
    return this.studentsService.remove(id)
  }
}
