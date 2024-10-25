import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger, ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './shared/filters/all-exceptions.filter'
import { runSeed } from './database/seeds/user-seed'
import { DataSource } from 'typeorm'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()

  app.useLogger(app.get(Logger))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  app.useGlobalFilters(new HttpExceptionFilter())

  const config = new DocumentBuilder()
    .setTitle('Gym API')
    .setDescription('The Gym API description')
    .setVersion('1.0')
    .addTag('gym')
    .build()

  const logger = new Logger('Config')
  logger.log(`JWT_SECRET: ${process.env.JWT_SECRET}`)
  logger.log(`JWT_EXPIRES_IN: ${process.env.JWT_EXPIRES_IN}`)

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api', app, document)

  // const AppDatasource = new DataSource({
  //   type: 'postgres',
  //   host: process.env.DATABASE_HOST,
  //   port: parseInt(process.env.DATABASE_PORT, 10),
  //   username: process.env.DATABASE_USERNAME,
  //   password: process.env.DATABASE_PASSWORD,
  //   database: process.env.DATABASE_NAME,
  //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
  //   synchronize: true,
  // })

  // runSeed(AppDatasource)

  await app.listen(3000)
}
bootstrap()
