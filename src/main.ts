import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger, ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './shared/filters/all-exceptions.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()

  app.useLogger(app.get(Logger))

  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  })

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

  await app.listen(3000)
}
bootstrap()
