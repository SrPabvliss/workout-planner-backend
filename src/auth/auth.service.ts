import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from 'src/users/users.service'
import { TrainersService } from 'src/trainers/trainers.service'
import { StudentsService } from 'src/students/students.service'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { UpdateAuthDto } from './dto/update-password.dto'
import { AuthDto } from './dto/auth.dto'
import { ResponseService } from 'src/shared/response-format/response.service'
import USER_MESSAGES from 'src/users/messages/user-messages'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private trainersService: TrainersService,
    private studentsService: StudentsService,
    private jwtService: JwtService,
    private responseService: ResponseService,
  ) {}

  async login({ username, password }: AuthDto) {
    const user = await this.usersService.findByUsername(username)

    if (!user) return

    const areCredentialsValid = await bcrypt.compare(
      password,
      user.data.password,
    )

    if (!areCredentialsValid)
      return this.responseService.error(USER_MESSAGES.INVALID_CREDENTIALS)

    let role = ''
    let trainer = false

    try {
      await this.trainersService.findOneByUserId(user.data.id)
      role = 'trainer'
      trainer = true
    } catch (error) {
      console.log(error)
      role = ''
      trainer = false
    }

    if (!trainer) {
      console.log(trainer)
      try {
        console.log(user.data.id)
        await this.studentsService.findOneByUserId(user.data.id)
        console.log('student')
        role = 'student'
        console.log(role)
      } catch (error) {
        console.log(error)
        role = ''
      }
    }

    const { password: _password, ...result } = user.data

    return this.responseService.success(
      {
        access_token: this.jwtService.sign({ ...result, role }),
      },
      USER_MESSAGES.LOGIN_SUCCESS,
    )
  }

  async logout(
  ) {
    // this method should invalidate the token
  }

  async changePassword({ username, password, newPassword }: UpdateAuthDto) {}
}
