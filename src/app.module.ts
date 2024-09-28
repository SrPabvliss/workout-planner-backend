import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import { PresetsModule } from './presets/presets.module'
import { AuthModule } from './auth/auth.module'
import { RoutinesModule } from './routines/routines.module'
import { MealsModule } from './meals/meals.module'
import { ExercisesModule } from './exercises/exercises.module'
import { StudentsModule } from './students/students.module';
import { TrainersModule } from './trainers/trainers.module';
import typeormConfig from 'ormconfig'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeormConfig),
    TypeOrmModule.forFeature([]),
    UsersModule,
    ExercisesModule,
    MealsModule,
    RoutinesModule,
    AuthModule,
    PresetsModule,
    StudentsModule,
    TrainersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
