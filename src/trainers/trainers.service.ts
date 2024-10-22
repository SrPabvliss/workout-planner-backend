import { Injectable } from '@nestjs/common'
import { CreateTrainerDto } from './dto/create-trainer.dto'
import { UpdateTrainerDto } from './dto/update-trainer.dto'
import { UsersService } from 'src/users/users.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Trainer } from './entities/trainer.entity'
import { Repository } from 'typeorm'
import { ResponseService } from 'src/shared/response-format/response.service'
import TRAINER_MESSAGES from './messages/trainer-messages'

@Injectable()
export class TrainersService {
  constructor(
    @InjectRepository(Trainer)
    private readonly trainersRepository: Repository<Trainer>,
    private readonly userService: UsersService,
    private readonly responseService: ResponseService,
  ) {}

  async create(createTrainerDto: CreateTrainerDto) {
    const { specialization, years_of_experience, ...rest } = createTrainerDto

    const user = await this.userService.create({
      ...rest,
    })

    if (!user) return

    const trainer = this.trainersRepository.create({
      user: user.data,
      specialization,
      years_of_experience,
    })

    return this.responseService.success(
      await this.trainersRepository.save(trainer),
      TRAINER_MESSAGES.CREATED,
    )
  }

  async findAll() {
    const trainers = await this.trainersRepository.find({
      relations: ['user'],
    })

    if (!trainers)
      return this.responseService.error(TRAINER_MESSAGES.MANY_NOT_FOUND)

    return this.responseService.success(trainers, TRAINER_MESSAGES.FOUND_MANY)
  }

  async findOne(id: number) {
    const trainer = await this.trainersRepository
      .createQueryBuilder('trainer')
      .leftJoinAndSelect('trainer.user', 'user')
      .where('trainer.id = :id', { id })
      .getOne()

    if (!trainer) return this.responseService.error(TRAINER_MESSAGES.NOT_FOUND)

    return this.responseService.success(trainer, TRAINER_MESSAGES.FOUND)
  }

  async findOneByUserId(id: number) {
    const trainer = await this.trainersRepository
      .createQueryBuilder('trainer')
      .leftJoinAndSelect('trainer.user', 'user')
      .where('user.id = :id', { id })
      .getOne()

    if (!trainer) return this.responseService.error(TRAINER_MESSAGES.NOT_FOUND)

    return this.responseService.success(trainer, TRAINER_MESSAGES.FOUND)
  }

  async update(id: number, updateTrainerDto: UpdateTrainerDto) {
    const trainer = await this.findOne(id)
    if (!trainer) return this.responseService.error(TRAINER_MESSAGES.NOT_FOUND)

    const { specialization, years_of_experience, ...userUpdateData } =
      updateTrainerDto

    try {
      if (Object.keys(userUpdateData).length > 0) {
        const userUpdateResult = await this.userService.update(
          trainer.data.user.id,
          userUpdateData,
        )

        if (!userUpdateResult || !userUpdateResult.success) {
          return userUpdateResult
        }
      }

      const trainerData = {
        id: trainer.data.id,
        user: trainer.data.user,
        specialization: specialization || trainer.data.specialization,
        years_of_experience:
          years_of_experience || trainer.data.years_of_experience,
      }

      const updatedTrainer = await this.trainersRepository.save(trainerData)

      const refreshedTrainer = await this.findOne(id)

      if (!refreshedTrainer) return

      return this.responseService.success(
        refreshedTrainer.data,
        TRAINER_MESSAGES.UPDATED,
      )
    } catch (error) {
      return this.responseService.error(TRAINER_MESSAGES.UPDATE_ERROR)
    }
  }

  async remove(id: number) {
    const trainer = await this.findOne(id)

    if (!trainer) return

    const deleted = await this.trainersRepository.delete(id)

    if (!deleted)
      return this.responseService.error(TRAINER_MESSAGES.DELETE_ERROR)

    const userDeleted = await this.userService.remove(trainer.data.user.id)

    if (!userDeleted) return

    return this.responseService.success(trainer.data, TRAINER_MESSAGES.DELETED)
  }
}
