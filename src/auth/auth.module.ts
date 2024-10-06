import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from 'src/users/users.module'
import { TrainersModule } from 'src/trainers/trainers.module'
import { StudentsModule } from 'src/students/students.module'
import { JwtModule } from '@nestjs/jwt'

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
  imports: [UsersModule, TrainersModule, StudentsModule, JwtModule],
})
export class AuthModule {}
