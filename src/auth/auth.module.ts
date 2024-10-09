import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from 'src/users/users.module'
import { TrainersModule } from 'src/trainers/trainers.module'
import { StudentsModule } from 'src/students/students.module'
import { JwtModule } from '@nestjs/jwt'
import { ResponseService } from 'src/shared/response-format/response.service'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  controllers: [AuthController],
  providers: [AuthService, ResponseService],
  exports: [AuthService],
  imports: [
    UsersModule,
    TrainersModule,
    StudentsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
