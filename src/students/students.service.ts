import { Injectable } from '@nestjs/common'
import { CreateStudentDto } from './dto/create-student.dto'
import { UpdateStudentDto } from './dto/update-student.dto'
import { UsersService } from 'src/users/users.service'
import { ResponseService } from 'src/shared/response-format/response.service'
import { Repository } from 'typeorm'
import { Student } from './entities/student.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { TrainersService } from 'src/trainers/trainers.service'
import STUDENT_MESSAGES from './messages/student-messages'

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    private readonly usersService: UsersService,
    private readonly responseService: ResponseService,
    private readonly trainersService: TrainersService,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const {
      trainer: trainerId,
      height,
      weight,
      medical_conditions,
      trained_before,
      ...rest
    } = createStudentDto

    const trainer = await this.trainersService.findOne(trainerId)

    if (!trainer) return

    const user = await this.usersService.create({
      ...rest,
    })

    if (!user) return

    const student = await this.studentsRepository.create({
      user: user.data,
      trainer: trainer.data,
      height,
      weight,
      medical_conditions,
      trained_before,
    })

    return this.responseService.success(
      await this.studentsRepository.save(student),
      STUDENT_MESSAGES.CREATED,
    )
  }

  async findAll() {
    const students = await this.studentsRepository.find({
      relations: ['user', 'trainer'],
    })

    if (!students)
      return this.responseService.error(STUDENT_MESSAGES.MANY_NOT_FOUND)

    return this.responseService.success(students, STUDENT_MESSAGES.FOUND_MANY)
  }

  async findOne(id: number) {
    const student = await this.studentsRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.user', 'user')
      .leftJoinAndSelect('student.trainer', 'trainer')
      .where('student.id = :id', { id })
      .getOne()

    if (!student) return this.responseService.error(STUDENT_MESSAGES.NOT_FOUND)

    return this.responseService.success(student, STUDENT_MESSAGES.FOUND)
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const student = await this.findOne(id)

    if (!student) return

    const {
      trainer: trainerId,
      height,
      weight,
      medical_conditions,
      trained_before,
      ...rest
    } = updateStudentDto

    if (Object.keys(rest).length > 0) {
      const userUpdateResult = await this.usersService.update(
        student.data.user.id,
        rest,
      )
      if (!userUpdateResult) return
    }

    student.data.trainer = trainerId ?? student.data.trainer
    student.data.height = height ?? student.data.height
    student.data.weight = weight ?? student.data.weight
    student.data.medical_conditions =
      medical_conditions ?? student.data.medical_conditions
    student.data.trained_before = trained_before ?? student.data.trained_before

    const updatedStudent = await this.studentsRepository.save(student.data)

    if (!updatedStudent)
      return this.responseService.error(STUDENT_MESSAGES.UPDATE_ERROR)

    return this.responseService.success(
      await this.findOne(id),
      STUDENT_MESSAGES.UPDATED,
    )
  }

  async remove(id: number) {
    const student = await this.findOne(id)

    if (!student) return

    const deleted = await this.studentsRepository.delete(id)

    if (!deleted)
      return this.responseService.error(STUDENT_MESSAGES.DELETE_ERROR)

    const userDeleted = await this.usersService.remove(student.data.user.id)

    if (!userDeleted) return

    return this.responseService.success(student.data, STUDENT_MESSAGES.DELETED)
  }
}
