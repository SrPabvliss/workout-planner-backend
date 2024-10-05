import { Module } from '@nestjs/common'
import { TrainersService } from './trainers.service'
import { TrainersController } from './trainers.controller'
import { UsersService } from 'src/users/users.service'
import { UsersModule } from 'src/users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Trainer } from './entities/trainer.entity'
import { User } from 'src/users/entities/user.entity'
import { ResponseService } from 'src/shared/response-format/response.service'

@Module({
  controllers: [TrainersController],
  providers: [TrainersService, ResponseService, UsersService],
  imports: [UsersModule, TypeOrmModule.forFeature([User, Trainer])],
  exports: [TrainersService, UsersService, TypeOrmModule],
})
export class TrainersModule {}
