# Driver Registration - Two Separate Flows

## Overview

CodeRide now has **TWO distinct driver registration flows** to handle different business scenarios:

1. **Independent Drivers** (Own their vehicles) - Self-service application
2. **Company Drivers** (Drive company vehicles) - Admin-created accounts

---

## 1. Independent Driver Application (Self-Service)

### DTO: `CreateDriverApplicationDto`
**Location**: `src/application/DTO/driver/create-driver-application.dto.ts`

**Who uses it**: Independent drivers applying through the mobile app

**Fields**:
- `licenseNumber` - Driver's license number
- `licenseExpiry` - License expiry date
- `bankAccountDetails` - For payout processing
- `driversLicenseUrl` - URL to uploaded license photo
- `profilePhotoUrl` - URL to uploaded profile photo
- `vehicleRegistrationUrl` - URL to vehicle registration (optional)
- `insuranceUrl` - URL to insurance document (optional)
- `backgroundCheckUrl` - URL to background check (optional)

**Params**: `CreateDriverApplicationParams`
```typescript
CreateDriverApplicationDto & { userId: string } // userId from JWT
```

**Flow**:
```
1. User signs up → Creates User account
2. User clicks "Become a Driver"
3. User uploads documents (license, photos, etc.)
4. User submits application
5. Controller extracts userId from JWT
6. Service creates Driver with status: PENDING
7. Admin reviews documents remotely
8. Admin approves/rejects
9. If approved: Driver can add vehicle and start accepting rides
```

**Controller Example**:
```typescript
@Post('apply')
@UseGuards(JwtAuthGuard)
async applyAsDriver(
  @Body() dto: CreateDriverApplicationDto,
  @GetUser() user: User
) {
  const params: CreateDriverApplicationParams = {
    ...dto,
    userId: user.id // From JWT
  };
  return this.driverService.createApplication(params);
}
```

---

## 2. Company Driver Creation (Admin Only)

### DTO: `CreateCompanyDriverDto`
**Location**: `src/application/DTO/driver/create-company-driver.dto.ts`

**Who uses it**: Admins creating accounts for company-employed drivers

**Fields**:
- `userId` - User ID of the employee (admin provides)
- `licenseNumber` - Driver's license number
- `licenseExpiry` - License expiry date
- `bankAccountDetails` - For payout processing
- `documentStatus` - Can be set to APPROVED immediately (optional)
- `latitude` - Initial location (optional)
- `longitude` - Initial location (optional)

**Params**: `CreateCompanyDriverParams`
```typescript
CreateCompanyDriverDto // No modification needed, userId already in DTO
```

**Flow**:
```
1. Person visits office or meets agent
2. Admin verifies documents in person
3. Admin creates User account (if doesn't exist)
4. Admin creates Driver profile using CreateCompanyDriverDto
5. Admin sets documentStatus = APPROVED
6. Admin assigns company vehicle via VehicleAssignment
7. Driver can start accepting rides immediately
```

**Controller Example**:
```typescript
@Post('company-driver')
@UseGuards(JwtAuthGuard, AdminGuard)
async createCompanyDriver(
  @Body() dto: CreateCompanyDriverDto
) {
  // Admin provides userId, no JWT extraction needed
  return this.driverService.createCompanyDriver(dto);
}
```

---

## Comparison

| Aspect | Independent Driver | Company Driver |
|--------|-------------------|----------------|
| **DTO** | `CreateDriverApplicationDto` | `CreateCompanyDriverDto` |
| **Who creates** | Driver (self-service) | Admin (after in-person verification) |
| **userId source** | JWT token | Admin provides |
| **Initial status** | PENDING | APPROVED |
| **Document upload** | Driver uploads online | Admin verifies in person |
| **Approval process** | Admin reviews remotely | Instant (already verified) |
| **Vehicle** | Driver-owned (adds later) | Company-owned (assigned by admin) |
| **Office visit** | Not required | Required |

---

## Type Definitions (type.ts)

```typescript
// Independent drivers (self-service)
export type CreateDriverApplicationParams = CreateDriverApplicationDto & { userId: string };

// Company drivers (admin creates)
export type CreateCompanyDriverParams = CreateCompanyDriverDto; // userId already in DTO

// Deprecated (use specific types above)
export type CreateDriverParams = CreateDriverDto & { userId: string };
```

---

## Service Layer

Your service should have two methods:

```typescript
class DriverService {
  // For independent driver applications
  async createApplication(params: CreateDriverApplicationParams) {
    return this.prisma.driver.create({
      data: {
        userId: params.userId, // From JWT
        licenseNumber: params.licenseNumber,
        licenseExpiry: params.licenseExpiry,
        bankAccountDetails: params.bankAccountDetails,
        documentStatus: DocumentStatus.PENDING, // Awaiting admin review
        rating: null,
        totalRides: 0,
        totalEarnings: 0,
        isOnline: false,
      }
    });
  }

  // For company-employed drivers
  async createCompanyDriver(dto: CreateCompanyDriverDto) {
    return this.prisma.driver.create({
      data: {
        userId: dto.userId, // Admin provides
        licenseNumber: dto.licenseNumber,
        licenseExpiry: dto.licenseExpiry,
        bankAccountDetails: dto.bankAccountDetails,
        documentStatus: dto.documentStatus || DocumentStatus.APPROVED, // Pre-approved
        rating: null,
        totalRides: 0,
        totalEarnings: 0,
        isOnline: false,
        latitude: dto.latitude,
        longitude: dto.longitude,
      }
    });
  }
}
```

---

## API Endpoints

### Independent Driver Application
```http
POST /api/drivers/apply
Headers:
  Authorization: Bearer <jwt-token>
  Content-Type: application/json

Body:
{
  "licenseNumber": "ABC123456",
  "licenseExpiry": "2027-12-31",
  "bankAccountDetails": { "accountNumber": "1234567890", "bankName": "GTBank" },
  "driversLicenseUrl": "https://s3.amazonaws.com/docs/license.jpg",
  "profilePhotoUrl": "https://s3.amazonaws.com/docs/profile.jpg",
  "vehicleRegistrationUrl": "https://s3.amazonaws.com/docs/vehicle-reg.jpg",
  "insuranceUrl": "https://s3.amazonaws.com/docs/insurance.pdf"
}
```

### Company Driver Creation (Admin)
```http
POST /api/drivers/company-driver
Headers:
  Authorization: Bearer <admin-jwt-token>
  Content-Type: application/json

Body:
{
  "userId": "user-123",
  "licenseNumber": "XYZ789012",
  "licenseExpiry": "2026-06-30",
  "bankAccountDetails": { "accountNumber": "0987654321", "bankName": "Access Bank" },
  "documentStatus": "APPROVED",
  "latitude": 6.5244,
  "longitude": 3.3792
}
```

---

## Benefits of Separate DTOs

✅ **Clear separation of concerns** - No confusion about which flow to use  
✅ **Type safety** - Compiler catches incorrect usage  
✅ **Better documentation** - Each DTO clearly states its purpose  
✅ **Easier testing** - Test each flow independently  
✅ **Maintainability** - Changes to one flow don't affect the other  
✅ **Security** - Independent drivers can't bypass approval process  

---

## Migration Path

If you have existing code using `CreateDriverDto`:

1. **For independent drivers**: Replace with `CreateDriverApplicationDto`
2. **For company drivers**: Replace with `CreateCompanyDriverDto`
3. **Update imports** in controllers and services
4. **Update tests** to use new DTOs

The old `CreateDriverDto` is marked as deprecated but kept for backward compatibility.
