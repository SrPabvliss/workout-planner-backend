import { Injectable, HttpStatus, HttpException } from '@nestjs/common'

@Injectable()
export class ResponseService {
  success(data: any, message: string = 'Operation successful') {
    return {
      success: true,
      data,
      message,
    }
  }

  error(
    message: string = 'An error occurred',
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    throw new HttpException(
      {
        success: false,
        message,
        data: null,
      },
      status,
    )
  }
}
