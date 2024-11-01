import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v2 as cloudinary } from 'cloudinary'
import { ResponseService } from '../response-format/response.service'
import { CloudinaryResponse } from './interfaces/cloudinary-response.inteface'

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly responseService: ResponseService,
  ) {
    const cloudName = this.configService.get('CLOUDINARY_CLOUD_NAME')
    const apiKey = this.configService.get('CLOUDINARY_API_KEY')
    const apiSecret = this.configService.get('CLOUDINARY_API_SECRET')

    if (!cloudName || !apiKey || !apiSecret) {
      this.logger.error('Missing Cloudinary credentials')
      throw new Error('Missing Cloudinary credentials')
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    })
  }

  async uploadFile(file: Express.Multer.File, folder = 'exercises') {
    try {
      const uploadResponse = await this.uploadToCloudinary(file, folder)
      return this.responseService.success(
        uploadResponse,
        'Imagen subida exitosamente',
      )
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error)
      return this.responseService.error('Error al subir la imagen')
    }
  }

  async uploadUrl(imageUrl: string, folder = 'exercises') {
    try {
      const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
        folder,
      })

      const response: CloudinaryResponse = {
        secure_url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
      }

      return this.responseService.success(
        response,
        'Imagen subida exitosamente',
      )
    } catch (error) {
      console.error('Error uploading URL to Cloudinary:', error)
      return this.responseService.error('Error al subir la imagen')
    }
  }

  async deleteFile(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId)
      return this.responseService.success(null, 'Imagen eliminada exitosamente')
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error)
      return this.responseService.error('Error al eliminar la imagen')
    }
  }

  private async uploadToCloudinary(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
        },
        (error, result) => {
          if (error) return reject(error)
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          })
        },
      )

      uploadStream.end(file.buffer)
    })
  }
}
