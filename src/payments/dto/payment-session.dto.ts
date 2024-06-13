import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsPositive,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';

export class PaymentSessionDto {
  @IsString()
  orderId: string;
  @IsString()
  currency: string;
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PaymenSessionItemDto)
  items: PaymenSessionItemDto[];
}

export class PaymenSessionItemDto {
  @IsString()
  name: string;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsNumber()
  @IsPositive()
  quantity: number;
}
