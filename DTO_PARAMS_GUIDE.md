# DTO & Params Pattern Guide

## Overview

This guide explains the DTO (Data Transfer Object) and Params pattern used in CodeRide for secure JWT-based authentication.

## The Pattern

### DTOs (What the client sends)
- **Purpose**: Define what data the client (mobile app/web) sends in API requests
- **Security**: Should NOT include `userId` or other sensitive IDs that can be forged
- **Location**: `src/application/DTO/`

### Params (What the service receives)
- **Purpose**: Define what data the service layer receives (DTO + extracted JWT data)
- **Security**: Includes `userId` extracted from JWT token by the controller
- **Location**: `src/utils/type.ts`

## Pattern: DTO → Controller → Params → Service

```typescript
// 1. Client sends DTO (no userId)
POST /api/riders
Body: { preferredLanguage: "en", savedLocations: {...} }

// 2. Controller extracts userId from JWT and creates Params
@Post('register')
@UseGuards(JwtAuthGuard)
async registerAsRider(
  @Body() dto: CreateRiderDto,
  @GetUser() user: User // Custom decorator extracts user from JWT
) {
  // Combine DTO + userId = Params
  const params: CreateRiderParams = {
    ...dto,
    userId: user.id // From JWT token
  };
  return this.riderService.create(params);
}

// 3. Service receives Params (with userId)
async create(params: CreateRiderParams) {
  // params.userId is safe - came from verified JWT token
  // params.preferredLanguage came from client
}
```

## Updated DTOs (User-Facing - Use JWT)

### ✅ CreateRiderDto
**Removed**: `userId` (from JWT), `rating`, `totalRides` (system-managed)  
**Kept**: `preferredLanguage`, `savedLocations`, `defaultPaymentMethodId`

```typescript
// DTO (client sends)
{
  preferredLanguage?: string;
  savedLocations?: any;
}

// Params (service receives)
{
  userId: string; // From JWT
  preferredLanguage?: string;
  savedLocations?: any;
}
```

### ✅ CreateDriverDto
**Removed**: `userId` (from JWT), `rating`, `totalRides`, `totalEarnings`, `isOnline`, `documentStatus` (all system-managed)  
**Kept**: `licenseNumber`, `licenseExpiry`, `bankAccountDetails`

```typescript
// DTO (client sends - driver application)
{
  licenseNumber: string;
  licenseExpiry: Date;
  bankAccountDetails?: any;
}

// Params (service receives)
{
  userId: string; // From JWT
  licenseNumber: string;
  licenseExpiry: Date;
  bankAccountDetails?: any;
}
```

### ✅ CreateRideDto
**Removed**: `riderId` (from JWT), `driverId`, `status`, all timestamps, pricing (all system-managed)  
**Kept**: `pickup`, `destination`, `rideType`, `promotionCode`

```typescript
// DTO (client sends - book ride)
{
  pickupLatitude: number;
  pickupLongitude: number;
  pickupAddress: string;
  destinationLatitude: number;
  destinationLongitude: number;
  destinationAddress: string;
  rideType: VehicleCategory;
  promotionCode?: string;
}

// Params (service receives)
{
  riderId: string; // From JWT
  pickupLatitude: number;
  // ... all other fields
}
```

### ✅ CreatePaymentMethodDto
**Removed**: `userId` (from JWT), `isDefault` (set separately)  
**Kept**: `type`, `cardLast4`, `cardBrand`, `paymentGatewayToken`

```typescript
// DTO (client sends)
{
  type: PaymentMethodType;
  cardLast4?: string;
  cardBrand?: string;
  paymentGatewayToken: string;
}

// Params (service receives)
{
  userId: string; // From JWT
  type: PaymentMethodType;
  // ... other fields
}
```

### ✅ CreateSupportTicketDto
**Removed**: `userId` (from JWT), `status`, `priority`, `adminId`, `resolvedAt` (all system-managed)  
**Kept**: `rideId`, `category`, `subject`, `description`

```typescript
// DTO (client sends)
{
  rideId?: string;
  category: TicketCategory;
  subject: string;
  description: string;
}

// Params (service receives)
{
  userId: string; // From JWT
  rideId?: string;
  category: TicketCategory;
  subject: string;
  description: string;
}
```

### ✅ CreateReferralDto
**Removed**: `referrerId`, `referredId` (both from JWT/lookup), `status`, `rewardAmount`, `rewardedAt` (all system-managed)  
**Kept**: `code` (referral code only)

```typescript
// DTO (client sends - new user signs up)
{
  code: string; // Referral code from existing user
}

// Params (service receives)
{
  referredId: string; // New user's ID from JWT
  code: string;
}
```

### ✅ CreateTicketMessageDto
**Added to Params**: `senderId` (from JWT)

```typescript
// Params (service receives)
{
  senderId: string; // From JWT
  ticketId: string;
  message: string;
  // ... other fields
}
```

## DTOs That Keep userId (Admin/System Operations)

These DTOs are used by admins or system processes, NOT by regular users:

### ❌ CreateEarningDto
**Reason**: System creates earnings automatically after ride completion  
**userId**: Not applicable (uses `driverId` and `rideId`)

### ❌ CreateVehicleAssignmentDto
**Reason**: Admin assigns vehicles to drivers  
**userId**: Not applicable (uses `driverId` and `vehicleId`)

### ❌ CreateNotificationDto
**Reason**: System creates notifications  
**userId**: Included in DTO (system specifies which user to notify)

### ❌ CreatePromotionDto
**Reason**: Admin creates promotions  
**userId**: Not applicable

### ❌ CreateSurgeZoneDto
**Reason**: Admin creates surge zones  
**userId**: Not applicable

## Security Benefits

### ✅ Prevents Impersonation
```typescript
// ❌ BAD: Client could forge userId
POST /api/riders
Body: { userId: "someone-else-id", ... }

// ✅ GOOD: userId from verified JWT token
POST /api/riders
Headers: { Authorization: "Bearer <jwt-token>" }
Body: { preferredLanguage: "en" }
```

### ✅ Prevents Privilege Escalation
```typescript
// ❌ BAD: Client could set themselves as approved
POST /api/drivers
Body: { userId: "my-id", documentStatus: "APPROVED" }

// ✅ GOOD: Only driver-provided data accepted
POST /api/drivers
Body: { licenseNumber: "ABC123", licenseExpiry: "2025-12-31" }
// documentStatus set to PENDING by system
```

### ✅ Prevents Data Manipulation
```typescript
// ❌ BAD: Client could manipulate ride data
POST /api/rides
Body: { 
  riderId: "my-id",
  status: "COMPLETED", // Fraud!
  actualPrice: 0 // Free ride!
}

// ✅ GOOD: Only pickup/destination accepted
POST /api/rides
Body: {
  pickupLatitude: 6.5244,
  pickupLongitude: 3.3792,
  destinationLatitude: 6.4281,
  destinationLongitude: 3.4219,
  rideType: "ECONOMY"
}
// status, pricing, timestamps all set by system
```

## Controller Pattern

### Custom Decorator for JWT User Extraction

```typescript
// src/common/decorators/get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // Set by JwtAuthGuard
  },
);
```

### Example Controller

```typescript
// src/modules/rider/rider.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../domain/entities/user.entity';
import { CreateRiderDto } from '../application/DTO/rider/create-rider.dto';
import { CreateRiderParams } from '../utils/type';
import { RiderService } from './rider.service';

@Controller('riders')
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard) // Validates JWT token
  async registerAsRider(
    @Body() dto: CreateRiderDto,
    @GetUser() user: User // Extracts user from JWT
  ) {
    // Combine DTO + userId = Params
    const params: CreateRiderParams = {
      ...dto,
      userId: user.id
    };
    
    return this.riderService.create(params);
  }
}
```

## Quick Reference

| DTO | Removed Fields | Added to Params |
|-----|---------------|-----------------|
| CreateRiderDto | userId, rating, totalRides | userId (JWT) |
| CreateDriverDto | userId, rating, totalRides, totalEarnings, isOnline, documentStatus | userId (JWT) |
| CreateRideDto | riderId, driverId, status, timestamps, pricing | riderId (JWT) |
| CreatePaymentMethodDto | userId, isDefault | userId (JWT) |
| CreateSupportTicketDto | userId, status, priority, adminId, resolvedAt | userId (JWT) |
| CreateReferralDto | referrerId, referredId, status, rewardAmount, rewardedAt | referredId (JWT) |
| CreateTicketMessageDto | senderId | senderId (JWT) |

## Testing

### Example API Call (Postman/Insomnia)

```http
POST http://localhost:3000/api/riders/register
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json

Body:
{
  "preferredLanguage": "en",
  "savedLocations": {
    "home": { "lat": 6.5244, "lng": 3.3792, "address": "Ikeja, Lagos" },
    "work": { "lat": 6.4281, "lng": 3.4219, "address": "Victoria Island, Lagos" }
  }
}
```

### Example Service Test

```typescript
describe('RiderService', () => {
  it('should create rider with userId from params', async () => {
    const params: CreateRiderParams = {
      userId: 'user-123', // From JWT in real app
      preferredLanguage: 'en',
      savedLocations: { home: {...} }
    };

    const result = await service.create(params);
    
    expect(result.userId).toBe('user-123');
    expect(result.preferredLanguage).toBe('en');
  });
});
```

## Summary

- **DTOs**: What clients send (no userId)
- **Params**: What services receive (DTO + userId from JWT)
- **Security**: Prevents impersonation, privilege escalation, data manipulation
- **Pattern**: Consistent across all user-facing endpoints
- **Admin Operations**: Keep userId in DTO (not from JWT)

**Remember**: If a user can call the endpoint, remove userId from DTO and add to Params!
