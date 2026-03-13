import { IsEnum, Min, IsDateString, IsOptional, Max } from "class-validator";
import { CouponStatus, CouponType } from "src/constants";
import { StringRequired, StringOptional, NumberOptional, NumberRequired, BooleanOptional } from "src/decorators/dto.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateCouponDto {
  @StringRequired('Coupon Code')
  @ApiProperty({ example: 'SUMMER2024', description: 'Unique coupon code' })
  code: string;

  @StringOptional()
  @ApiProperty({ required: false, example: 'Summer Sale' })
  name?: string;

  @StringOptional()
  @ApiProperty({ required: false, example: 'Save up to 50% on selected items' })
  description?: string;

  @ApiProperty({ enum: CouponType, example: CouponType.PERCENT })
  @IsEnum(CouponType, { message: 'Type must be one of: fixed, percent, shipping' })
  type: CouponType;

  @NumberRequired('Discount Value', 0)
  @ApiProperty({ example: 10, description: 'Discount value (fixed amount or percentage)' })
  value: number;

  @NumberRequired('Minimum Order Amount', 0)
  @ApiProperty({ example: 100000, description: 'Minimum order amount to apply coupon' })
  minOrderAmount: number;

  @NumberRequired('Maximum Discount Amount', 0)
  @ApiProperty({ example: 50000, description: 'Maximum discount cap (for percent type)' })
  maxDiscountAmount: number;

  @NumberRequired('Maximum Uses', 0)
  @ApiProperty({ example: 100, description: '0 = unlimited' })
  maxUses: number;

  @NumberRequired('Per User Limit', 0)
  @ApiProperty({ example: 2, description: '0 = unlimited per user' })
  perUserLimit: number;

  @NumberOptional()
  @ApiProperty({ required: false, description: 'Applicable product ID (if scope is product)' })
  applicableProduct?: number;

  @IsDateString({}, { message: 'startDate must be a valid ISO 8601 date string' })
  @ApiProperty({ example: '2024-06-01T00:00:00Z', description: 'Coupon start date (ISO 8601)' })
  startDate: string;

  @IsDateString({}, { message: 'endDate must be a valid ISO 8601 date string' })
  @ApiProperty({ example: '2024-08-31T23:59:59Z', description: 'Coupon end date (ISO 8601)' })
  endDate: string;

  @IsOptional()
  @IsEnum(CouponStatus, { message: 'Status must be one of: active, expired, inactive' })
  @ApiProperty({ enum: CouponStatus, required: false, example: CouponStatus.ACTIVE })
  status?: CouponStatus;

  @BooleanOptional()
  @ApiProperty({ required: false, example: true, description: 'If true, visible to all users' })
  isPublic?: boolean;
}