import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CloudinaryService } from './cloudinary.service'
import { CloudinaryController } from './cloudinary.controller'
import { ResponseService } from '../response-format/response.service'

@Module({
  imports: [ConfigModule],
  controllers: [CloudinaryController],
  providers: [CloudinaryService, ResponseService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
