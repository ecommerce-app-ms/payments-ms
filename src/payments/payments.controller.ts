import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Post('create-payment-session')
  async createPaymentSsesion(@Body() paymentSessionDto: PaymentSessionDto) {
    return await this.paymentsService.createPaymentSsesion(paymentSessionDto);
  }
  @Get('success')
  success() {
    return {
      ok: true,
      messaje: 'payment succesfull',
    };
  }
  @Get('cancel')
  cancel() {
    return {
      ok: false,
      messaje: 'payment cancelled',
    };
  }
  @Post('webhook')
  async StripeWebhook(@Req() req: Request, @Res() res: Response) {
    return this.paymentsService.webhookStripeHandler(req, res);
  }
}
