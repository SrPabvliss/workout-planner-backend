import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp()
    const request = httpContext.getRequest()

    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse()
        const statusCode =
          this.reflector.get<number>('__httpCode__', context.getHandler()) ||
          response.statusCode

        if (data && typeof data === 'object' && 'success' in data) {
          return {
            ...data,
            statusCode,
            metadata: {
              timestamp: new Date().toISOString(),
              path: request.url,
            },
          }
        }

        return {
          success: true,
          data,
          message: 'Operation successful',
          statusCode,
          metadata: {
            timestamp: new Date().toISOString(),
            path: request.url,
          },
        }
      }),
    )
  }
}
