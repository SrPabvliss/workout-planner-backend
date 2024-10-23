import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Not, Repository } from 'typeorm'
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

    const usernameExists = await this.usersRepository.findOneBy({
      username: createUserDto.username,
    })

    if (usernameExists)
      return this.responseService.error(USER_MESSAGES.USERNAME_ALREADY_EXISTS)

    const randomPassword = await this.generateRandomPassword()
    const hashedPassword = await this.hashPassword(randomPassword)

    const newUser = this.usersRepository.create({
      ...createUserDto,
      avatar_url: createUserDto.avatar_url
        ? createUserDto.avatar_url
        : 'https://api.dicebear.com/9.x/avataaars/svg?accessories=kurt&eyes=default&facialHair=beardLight&hairColor=4a312c&skinColor=ae5d29&top=bigHair&clothing=blazerAndShirt&clothesColor=3c4f5c',
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

    if (updateUserDto.username) {
      const usernameExists = await this.usersRepository.findOneBy({
        username: updateUserDto.username,
        id: Not(id),
      })

      if (usernameExists)
        return this.responseService.error(USER_MESSAGES.USERNAME_ALREADY_EXISTS)
    }

    if (updateUserDto.email) {
      const emailExists = await this.usersRepository.findOneBy({
        email: updateUserDto.email,
        id: Not(id),
      })

      if (emailExists)
        return this.responseService.error(USER_MESSAGES.EMAIL_ALREADY_EXISTS)
    }

    try {
      const userData = {
        id: user.data.id,
        first_name: user.data.first_name,
        last_name: user.data.last_name,
        email: user.data.email,
        username: user.data.username,
        ...updateUserDto,
      }

      const updatedUser = await this.usersRepository.save(userData)

      return this.responseService.success(updatedUser, USER_MESSAGES.UPDATED)
    } catch (error) {
      return this.responseService.error(USER_MESSAGES.UPDATE_ERROR)
    }
  }

  async remove(id: number) {
    const user = await this.findOne(id)

    if (!user) return

    const deleted = await this.usersRepository.delete(id)

    if (!deleted) return this.responseService.error(USER_MESSAGES.DELETE_ERROR)

    return this.responseService.success(user.data, USER_MESSAGES.DELETED)
  }
}
