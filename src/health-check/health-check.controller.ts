import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthCheckController {
  @Get()
  findAll() {
    return 'status its alive payments-ms';
  }
}
