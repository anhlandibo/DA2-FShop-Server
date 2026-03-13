import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Req, Query, Get, Param } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dtos';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/constants/role.enum';
import { ApiOperation, ApiBearerAuth, ApiBadRequestResponse, ApiCreatedResponse, ApiConflictResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { QueryCouponDto } from './dtos/query-coupon.dto';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create a new coupon (Admin only)',
    description: 'Creates a new coupon with the specified rules. Only admins can create coupons.'
  })
  @ApiCreatedResponse({ 
    description: 'Coupon created successfully',
    schema: {
      example: {
        id: 1,
        code: 'SUMMER2024',
        name: 'Summer Sale',
        description: 'Save up to 50% on selected items',
        type: 'percent',
        value: 10,
        minOrderAmount: 100000,
        maxDiscountAmount: 50000,
        maxUses: 100,
        perUserLimit: 2,
        usedCount: 0,
        applicableProduct: null,
        startDate: '2024-06-01T00:00:00.000Z',
        endDate: '2024-08-31T23:59:59.000Z',
        status: 'active',
        isPublic: true,
        isActive: true,
        createdAt: '2024-03-13T10:00:00.000Z',
        updatedAt: '2024-03-13T10:00:00.000Z'
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input or business rule violation',
    schema: {
      example: {
        statusCode: 400,
        message: 'startDate must be before endDate',
        error: 'Bad Request'
      }
    }
  })
  @ApiConflictResponse({
    description: 'Coupon code already exists',
    schema: {
      example: {
        statusCode: 400,
        message: 'Coupon code already exists',
        error: 'Bad Request'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated or insufficient permissions',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized'
      }
    }
  })
  async create(
    @Req() req: Request,
    @Body() createCouponDto: CreateCouponDto,
  ) {
    return this.couponsService.create(createCouponDto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all coupons' })
  getAll(@Query() query: QueryCouponDto) {
    return this.couponsService.getAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get coupon by ID' })
  @ApiNotFoundResponse({description: 'Coupon not found'})
  getOne(@Param('id') id: number) {
    return this.couponsService.getOne(id);
  }
}
