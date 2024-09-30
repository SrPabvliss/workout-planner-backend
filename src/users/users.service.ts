import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { ResponseService } from 'src/shared/response-format/response.service'
import USER_MESSAGES from './messages/user-messages'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly responseService: ResponseService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    })

    if (user) return this.responseService.error(USER_MESSAGES.ALREADY_EXISTS)

    const created = this.usersRepository.create(createUserDto)

    return this.responseService.success(
      await this.usersRepository.save(created),
      USER_MESSAGES.CREATED,
    )
  }

  async findAll() {
    const users = await this.usersRepository.find()

    if (!users) return this.responseService.error(USER_MESSAGES.MANY_NOT_FOUND)

    return this.responseService.success(users, USER_MESSAGES.FOUND_MANY)
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id })

    if (!user) return this.responseService.error(USER_MESSAGES.NOT_FOUND)

    return this.responseService.success(user, USER_MESSAGES.FOUND)
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id)

    if (!user) return this.responseService.error(USER_MESSAGES.NOT_FOUND)

    return this.responseService.success(
      await this.usersRepository.save({
        ...user,
        ...updateUserDto,
        id,
      }),
      USER_MESSAGES.UPDATED,
    )
  }

  async remove(id: number) {
    const user = await this.findOne(id)

    if (!user) return this.responseService.error(USER_MESSAGES.NOT_FOUND)

    const deleted = await this.usersRepository.delete(id)

    if (!deleted) return this.responseService.error(USER_MESSAGES.DELETE_ERROR)

    return this.responseService.success(user.data, USER_MESSAGES.DELETED)
  }
}
