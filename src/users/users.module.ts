import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Student } from '../students/entities/student.entity'
import { User } from './entities/user.entity'
import { Trainer } from '../trainers/entities/trainer.entity'
import { UsersController } from './users.controller'
import { ResponseService } from 'src/shared/response-format/response.service'
import { EmailModule } from 'src/email/email.module'
import { EmailService } from 'src/email/email.service'

@Module({
  imports: [TypeOrmModule.forFeature([Student, User, Trainer]), EmailModule],
  controllers: [UsersController],
  providers: [UsersService, ResponseService],
  exports: [UsersService],
})
export class UsersModule {}
