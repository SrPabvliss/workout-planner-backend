import { Module } from '@nestjs/common'
import { TrainersService } from './trainers.service'
import { TrainersController } from './trainers.controller'
import { UsersService } from 'src/users/users.service'
import { UsersModule } from 'src/users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Trainer } from './entities/trainer.entity'
import { User } from 'src/users/entities/user.entity'
import { ResponseService } from 'src/shared/response-format/response.service'
import { EmailModule } from 'src/email/email.module'
import { EmailService } from 'src/email/email.service'

@Module({
  controllers: [TrainersController],
  providers: [TrainersService, ResponseService, UsersService],
  exports: [TrainersService, UsersService, TypeOrmModule],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User, Trainer]),
    EmailModule,
  ],
})
export class TrainersModule {}
