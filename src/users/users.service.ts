import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { ResponseService } from 'src/shared/response-format/response.service'
import USER_MESSAGES from './messages/user-messages'
import * as crypto from 'crypto'
import * as bcrypt from 'bcrypt'
import { EmailService } from 'src/email/email.service'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly responseService: ResponseService,
    private readonly emailService: EmailService,
  ) {}

  async generateRandomPassword(): Promise<string> {
    return crypto.randomBytes(8).toString('hex')
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    })

    if (user) return this.responseService.error(USER_MESSAGES.ALREADY_EXISTS)

    const randomPassword = await this.generateRandomPassword()
    const hashedPassword = await this.hashPassword(randomPassword)

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    })

    await this.emailService.sendEmail(
      createUserDto.email,
      createUserDto.username,
      randomPassword,
    )

    await this.usersRepository.save(newUser)

    return this.responseService.success(newUser, USER_MESSAGES.CREATED)
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

  async findByUsername(username: string) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne()

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

    if (!user) return

    const deleted = await this.usersRepository.delete(id)

    if (!deleted) return this.responseService.error(USER_MESSAGES.DELETE_ERROR)

    return this.responseService.success(user.data, USER_MESSAGES.DELETED)
  }
}
