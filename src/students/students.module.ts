import { Module } from '@nestjs/common'
import { StudentsService } from './students.service'
import { StudentsController } from './students.controller'
import { UsersModule } from 'src/users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Student } from './entities/student.entity'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'
import { ResponseService } from 'src/shared/response-format/response.service'
import { TrainersService } from 'src/trainers/trainers.service'
import { TrainersModule } from 'src/trainers/trainers.module'
import { EmailModule } from 'src/email/email.module'

@Module({
  controllers: [StudentsController],
  providers: [
    StudentsService,
    UsersService,
    ResponseService,
    TrainersService,
  ],
  exports: [StudentsService],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User, Student]),
    TrainersModule,
    EmailModule,
  ],
})
export class StudentsModule {}
