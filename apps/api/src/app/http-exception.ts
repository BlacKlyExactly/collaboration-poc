import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { ZodSerializationException } from 'nestjs-zod';
import { ZodError } from 'zod';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    if (exception instanceof ZodSerializationException) {
      const zodError = exception.getZodError();

      if (zodError instanceof ZodError) {
        const req = host.switchToHttp().getRequest<FastifyRequest>();
        const route = req.routeOptions?.url ?? req.url;

        this.logger.error(
          `ZodSerializationException [${req.method} ${route}] (url: ${req.url})\n` +
            zodError.issues
              .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
              .join('\n'),
        );
      }
    }

    super.catch(exception, host);
  }
}
