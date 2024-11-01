import { Inject, Injectable, Logger } from '@nestjs/common';
import { NAST_SERVICE, envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {
  private readonly stripeKey: string = envs.stripe_api_key;
  private readonly stripe = new Stripe(this.stripeKey);
  private readonly logger = new Logger('PaymentService');

  constructor(@Inject(NAST_SERVICE) private readonly client: ClientProxy) {}

  async createPaymentSsesion(paymentSessionDto: PaymentSessionDto) {
    const { currency, items, orderId } = paymentSessionDto;
    const lineItems = items.map((item) => {
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), /// equivale 20$// 20 dolares 2000 /100 =20.00
        },
        quantity: item.quantity,
      };
    });
    const session = await this.stripe.checkout.sessions.create({
      ///colocar id de la orden
      payment_intent_data: {
        metadata: {
          orderId: orderId,
        },
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: envs.stripe_success_url,
      cancel_url: envs.stripe_cancel_urL,
    });
    // return session;
    return {
      cancelUrl: session.cancel_url,
      successurl: session.success_url,
      url: session.url,
    };
  }

  async webhookStripeHandler(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;
    const endpointSecret = envs.stripe_endpoint_secret;
    try {
      //console.log(req);
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
        600000000000,
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    switch (event.type) {
      case 'charge.succeeded':
        //llamar al micro servicio
        const chargeSucceeded = event.data.object;
        /* console.log({
          metadata: chargeSucceeded.metadata,
          orderId: chargeSucceeded.metadata.orderId,
        });*/

        const payload = {
          stripePaymentId: chargeSucceeded.id,
          orderId: chargeSucceeded.metadata.orderId,
          receipUrl: chargeSucceeded.receipt_url,
        };
        this.logger.log({ payload });
        this.client.emit('payment.succeeded', payload);
        break;

      default:
        console.log(`event ${event.type} no handled`);
    }
    console.log({ event });
    return res.status(200).json({ sig });
  }
}
