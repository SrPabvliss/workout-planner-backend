import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { CloudinaryService } from './cloudinary.service'

@Controller('cloudinary')
export class CloudinaryController {
  private readonly logger = new Logger(CloudinaryController.name)

  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    this.logger.debug('Received file:', {
      originalname: file?.originalname,
      mimetype: file?.mimetype,
      size: file?.size,
    })

    if (!file) {
      return {
        success: false,
        message: 'No se recibió ningún archivo',
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }

    if (!file.mimetype.startsWith('image/')) {
      return {
        success: false,
        message: 'El archivo debe ser una imagen',
        data: null,
        statusCode: HttpStatus.BAD_REQUEST,
      }
    }

    return this.cloudinaryService.uploadFile(file)
  }
}
