import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from 'src/users/users.service'
import { TrainersService } from 'src/trainers/trainers.service'
import { StudentsService } from 'src/students/students.service'
import { CreateUserDto } from 'src/users/dto/create-user.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private trainersService: TrainersService,
    private studentsService: StudentsService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username)

    if (!user) return

    if (user.data && (await bcrypt.compare(password, user.data.password))) {
      const { password, ...result } = user.data
      return result
    }
    return null
  }

  async login(username: string, password: string) {
    const user = await this.usersService.findByUsername(username)

    if (!user) return

    if (user.data && (await bcrypt.compare(password, user.data.password))) {
      const { password, ...result } = user.data
      return result
    }

    const trainer = await this.trainersService.findOne(user.data.id)

    let role = 'user'
    if (trainer) {
      role = 'trainer' as const
      return {
        access_token: this.jwtService.sign({ ...user.data, role }),
      }
    }

    const student = await this.studentsService.findOne(user.data.id)
    if (student) {
      role = 'student' as const
      return {
        access_token: this.jwtService.sign({ ...user.data, role }),
      }
    }

    return
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersService.findOne(userId)
    if (user && (await bcrypt.compare(oldPassword, user.data.password))) {
      user.data.password = await bcrypt.hash(newPassword, 10)
      return this.usersService.update(userId, user.data)
    }
    return null
  }
}
