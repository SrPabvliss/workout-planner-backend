import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Student } from '../students/entities/student.entity'
import { User } from './entities/user.entity'
import { Trainer } from '../trainers/entities/trainer.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Student, User, Trainer])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
