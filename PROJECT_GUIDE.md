# CodeRide - Ride-Hailing Platform

## 🎯 Project Overview

**CodeRide** is a comprehensive ride-hailing platform similar to Uber, Bolt, or Lyft, designed specifically for the Nigerian market. The platform connects riders with drivers for on-demand transportation services.

### Core Purpose
Enable users to:
- **As Riders**: Request rides, track drivers in real-time, make payments, and rate experiences
- **As Drivers**: Accept ride requests, earn money, manage their vehicles or use company vehicles
- **As Company**: Manage a fleet of vehicles, assign drivers, process payments, and provide customer support

---

## 🏗️ Business Model

CodeRide supports **TWO** distinct business models:

### 1. Marketplace Model (Like Uber)
- Independent drivers own their vehicles
- They register on the platform
- Platform takes a commission per ride
- Drivers manage their own vehicles

### 2. Fleet Operations Model (Like Traditional Taxi Companies)
- **Company owns 1,000+ vehicles**
- Company employs drivers
- **Flexible assignments**: Drivers can be assigned different vehicles daily/weekly
- Full control over fleet operations
- Track vehicle usage, mileage, fuel consumption

---

## 👥 User Types

### 1. Rider (Customer)
- Books rides
- Makes payments
- Rates drivers
- Uses promotions/referral codes
- Saves favorite locations
- Can also be a driver (dual role)

### 2. Driver
- Accepts ride requests
- Earns money per ride
- Can own personal vehicle OR drive company vehicles
- Maintains rating
- Tracks earnings and payouts
- Manages availability schedule

### 3. Admin
- Manages platform operations
- Approves driver documents
- Assigns company vehicles to drivers
- Handles support tickets
- Configures surge pricing
- Processes driver payouts

---

## 🔄 Core Workflows

### Ride Request Flow
```
1. Rider opens app → Enters pickup & destination
2. System calculates fare estimate
3. Rider confirms booking
4. System finds nearest available driver
5. Driver accepts ride
6. Driver arrives at pickup location
7. Ride starts
8. Real-time GPS tracking during ride
9. Ride completes at destination
10. Payment processed
11. Both parties rate each other
12. Driver earnings calculated (gross - platform fee = net)
```

### Fleet Management Flow (Company Vehicles)
```
1. Admin adds vehicle to fleet (marks as COMPANY_OWNED)
2. Admin assigns vehicle to driver for the day/week
3. Driver records starting mileage & fuel level
4. Driver uses vehicle for rides
5. At end of shift, driver returns vehicle
6. Driver records ending mileage & fuel level
7. System tracks vehicle usage history
8. Next day, same vehicle can be assigned to different driver
```

### Document Verification Flow
```
1. Driver uploads documents (license, insurance, photos, etc.)
2. Documents marked as PENDING
3. Admin reviews each document
4. Admin APPROVES or REJECTS with reason
5. Driver status updated
6. System tracks document expiry dates
7. Notifications sent before expiry
```

---

## 📊 Entity Relationships & Logic

### User → Rider/Driver (One-to-One Optional)
**Logic**: A User can be BOTH a Rider AND a Driver simultaneously
- User signs up → Creates User account
- User can activate Rider profile → Becomes a customer
- User can activate Driver profile → Becomes a driver
- Same person can request rides during the day, drive at night

### Vehicle → Driver (Ownership Types)
**Logic**: Vehicles have TWO ownership models

#### Driver-Owned Vehicles:
```
Vehicle.ownershipType = DRIVER_OWNED
Vehicle.ownerId = specific driver
Relationship: Permanent (1 driver = 1 vehicle)
```

#### Company-Owned Vehicles:
```
Vehicle.ownershipType = COMPANY_OWNED
Vehicle.ownerId = null
Relationship: Flexible via VehicleAssignment
```

### VehicleAssignment → Vehicle + Driver (Many-to-Many History)
**Logic**: Tracks who drove which company vehicle when
- One vehicle can have multiple assignments over time
- One driver can have multiple vehicle assignments over time
- `returnedAt = null` means currently assigned
- `returnedAt = timestamp` means assignment completed
- Tracks mileage and fuel for accountability

**Example:**
```
Monday: Vehicle #123 → Driver John (6am-6pm)
Tuesday: Vehicle #123 → Driver Sarah (6am-6pm)
Wednesday: Vehicle #123 → Driver Mike (6am-6pm)
```

### Ride → Rider + Driver (Many-to-One)
**Logic**: Core transaction entity
- One Rider can have many Rides
- One Driver can have many Rides
- Each Ride has ONE Rider and ONE Driver
- Ride lifecycle: REQUESTED → ACCEPTED → ARRIVING → IN_PROGRESS → COMPLETED/CANCELLED

### Payment → Ride (One-to-One)
**Logic**: Each ride has exactly one payment
- Payment linked to Ride
- Payment linked to Rider (for history)
- Supports: CASH, CARD, WALLET
- Status: PENDING → COMPLETED/FAILED/REFUNDED

### Earning → Ride + Driver (One-to-One)
**Logic**: Driver earnings breakdown per ride
- Each completed ride generates one Earning record
- `grossAmount` = Total ride fare
- `platformFee` = Your commission (e.g., 20%)
- `netAmount` = Driver's take-home (grossAmount - platformFee)
- `payoutStatus` tracks payment to driver: PENDING → PROCESSING → PAID

**Example:**
```
Ride fare: ₦5,000
Platform fee (20%): ₦1,000
Driver earns: ₦4,000
```

### Promotion → PromotionUsage → Ride (One-to-Many)
**Logic**: Track promotion usage
- One Promotion can be used multiple times (up to usageLimit)
- Each usage creates a PromotionUsage record
- Links: Promotion → Rider → Ride
- Prevents fraud (can't use same promo twice on same ride)
- Tracks discount amount applied

### Rating → Ride + User (Bidirectional)
**Logic**: Both riders and drivers rate each other
- Each Ride can have 2 Ratings (rider rates driver, driver rates rider)
- `raterType` = RIDER or DRIVER
- `rater` = User who gave rating
- `ratee` = User who received rating
- Builds trust and accountability

### SupportTicket → User + Ride (Many-to-One)
**Logic**: Customer support system
- User creates ticket (optional: linked to specific Ride)
- Ticket assigned to Admin
- TicketMessages track conversation
- Status: OPEN → IN_PROGRESS → RESOLVED → CLOSED
- Priority: LOW, MEDIUM, HIGH, URGENT

### Referral → User (Self-Referencing)
**Logic**: Viral growth mechanism
- User A (referrer) invites User B (referred)
- User B signs up with User A's referral code
- Status: PENDING → COMPLETED (when B completes first ride) → REWARDED (when rewards paid)
- Both users get rewards (e.g., free rides, discounts)

### DriverDocument → Driver (One-to-Many)
**Logic**: Track individual documents
- One Driver has multiple documents (license, insurance, photos, etc.)
- Each document has its own approval status
- Track expiry dates for licenses and insurance
- Admin can reject with reason

### DriverSchedule → Driver (One-to-Many)
**Logic**: Driver availability patterns
- Driver sets availability for each day of week
- `dayOfWeek`: 0=Sunday, 1=Monday, ..., 6=Saturday
- `startTime`: "09:00", `endTime`: "17:00"
- Helps predict driver availability for demand forecasting

### Notification → User (One-to-Many)
**Logic**: Push notifications
- Types: RIDE_REQUEST, RIDE_ACCEPTED, PAYMENT, PROMO, SYSTEM
- `actionUrl`: Deep link to specific screen (e.g., "coderide://ride/123")
- `imageUrl`: Rich notifications with images
- `expiresAt`: Auto-expire promotional notifications
- `readAt`: Track engagement

### SurgeZone (Standalone)
**Logic**: Dynamic pricing
- Define geographic zones (GeoJSON polygon)
- Set price multiplier (1.5x, 2.0x, 3.0x)
- Active during specific times (rush hour, events)
- When rider requests ride in surge zone, price multiplied

---

## 💰 Revenue Model

### Platform Commission
- Take 15-25% commission on each ride
- Example: ₦5,000 ride → ₦1,000 platform fee → ₦4,000 to driver

### Surge Pricing
- Increase prices during high demand
- Platform earns more per ride
- Incentivizes more drivers to come online

### Subscription (Future)
- Premium riders: Lower fees, priority matching
- Premium drivers: Lower commission rates

### Advertising (Future)
- In-app ads for riders during wait times
- Sponsored locations

---

## 🔐 Security & Compliance

### Document Verification
- All drivers must upload and get approved:
  - Driver's license
  - Vehicle registration
  - Insurance
  - Profile photo
  - Vehicle photos
  - Background check

### Payment Security
- Integration with payment gateways (Paystack for Nigeria)
- Secure card tokenization
- Transaction references for tracking

### Data Privacy
- Soft deletes (User.deletedAt) for GDPR compliance
- Personal data can be anonymized
- Audit trails for all transactions

---

## 📈 Key Performance Indicators (KPIs)

### Rider Metrics
- Total rides requested
- Conversion rate (estimates → bookings)
- Average rating given to drivers
- Promotion usage rate
- Referral conversion rate

### Driver Metrics
- Total rides completed
- Earnings (gross, net, platform fee)
- Average rating from riders
- Online hours vs. ride hours (utilization)
- Vehicle assignment history (for company drivers)

### Business Metrics
- Total revenue (platform fees)
- Active riders/drivers
- Ride completion rate
- Average ride value
- Surge pricing effectiveness
- Support ticket resolution time

---

## 🚀 Competitive Advantages

### 1. Dual Business Model
- **Unique**: Support both independent drivers AND company fleet
- Competitors typically choose one model
- Flexibility to serve different market segments

### 2. Comprehensive Fleet Management
- Track vehicle assignments with mileage and fuel
- Optimize vehicle utilization
- Reduce operational costs

### 3. Transparent Earnings
- Drivers see exact breakdown: gross, fee, net
- Builds trust and reduces disputes
- Clear payout tracking

### 4. Built-in Support System
- Professional ticketing system
- Faster issue resolution
- Better customer satisfaction

### 5. Referral Program
- Viral growth mechanism
- Lower customer acquisition cost
- Engaged user base

### 6. Surge Pricing
- Maximize revenue during peak demand
- Balance supply and demand
- Incentivize driver availability

---

## 🎯 Target Market

### Primary: Nigeria
- Currency: NGN (Nigerian Naira)
- Large urban centers: Lagos, Abuja, Port Harcourt
- Growing middle class
- High smartphone penetration
- Traffic congestion (need for reliable transport)

### Expansion: West Africa
- Ghana, Kenya, South Africa
- Similar market dynamics
- Multi-currency support (future)

---

## 🛠️ Technology Stack

### Backend (Current)
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Language**: TypeScript
- **Architecture**: Domain-Driven Design (DDD)

### Key Integrations (Planned)
- **Payment**: Paystack (Nigerian payment gateway)
- **Maps**: Google Maps API (routing, geocoding)
- **SMS**: Termii (OTP, notifications)
- **Push Notifications**: Firebase Cloud Messaging
- **File Storage**: AWS S3 or Cloudinary (document uploads)
- **Real-time**: Socket.io (live tracking)

---

## 📱 Platform Components

### 1. Rider Mobile App (iOS/Android)
- Request rides
- Track driver in real-time
- Make payments
- Rate drivers
- View ride history
- Manage payment methods
- Use promo codes
- Refer friends

### 2. Driver Mobile App (iOS/Android)
- Accept ride requests
- Navigate to pickup/destination
- Track earnings
- View payout history
- Manage availability
- Upload documents
- View assigned vehicle (company drivers)

### 3. Admin Web Dashboard
- Manage drivers (approve/reject)
- Manage vehicles (add, assign)
- View all rides (real-time)
- Process payouts
- Handle support tickets
- Configure surge zones
- View analytics/reports
- Manage promotions

### 4. Backend API (This Project)
- RESTful API
- WebSocket for real-time updates
- Authentication & Authorization
- Business logic
- Database operations

---

## 🔄 Data Flow Examples

### Example 1: Rider Books a Ride
```
1. Rider App → API: POST /rides/estimate
   Body: { pickup, destination, vehicleCategory }
   
2. API → FareEstimate table: Save estimate
   API → Response: { estimatedPrice, distance, duration }

3. Rider confirms → API: POST /rides
   Body: { pickup, destination, vehicleCategory }
   
4. API creates Ride (status: REQUESTED)
   API finds nearest available Driver
   API → Driver App: Push notification

5. Driver accepts → API: PATCH /rides/:id/accept
   Ride.status = ACCEPTED
   Ride.acceptedAt = now()
   
6. Driver arrives → API: PATCH /rides/:id/start
   Ride.status = IN_PROGRESS
   Ride.startedAt = now()
   
7. During ride → Driver App sends GPS updates
   API: POST /rides/:id/tracking
   Creates RideTracking records
   
8. Ride ends → API: PATCH /rides/:id/complete
   Ride.status = COMPLETED
   Ride.completedAt = now()
   
9. API creates Payment (status: PENDING)
   API processes payment via Paystack
   Payment.status = COMPLETED
   
10. API creates Earning record
    grossAmount = ride.actualPrice
    platformFee = grossAmount * 0.20
    netAmount = grossAmount - platformFee
    
11. Both users rate each other
    API: POST /ratings
    Creates 2 Rating records
```

### Example 2: Admin Assigns Company Vehicle
```
1. Admin Dashboard → API: POST /vehicle-assignments
   Body: { vehicleId, driverId, startMileage, fuelLevelStart }
   
2. API validates:
   - Vehicle exists and is COMPANY_OWNED
   - Vehicle not currently assigned (no active assignment)
   - Driver exists and is approved
   
3. API creates VehicleAssignment
   assignedAt = now()
   returnedAt = null (currently assigned)
   
4. Driver App shows assigned vehicle details
   
5. End of shift → Driver returns vehicle
   API: PATCH /vehicle-assignments/:id/return
   Body: { endMileage, fuelLevelEnd, notes }
   
6. API updates VehicleAssignment
   returnedAt = now()
   Calculates: distance = endMileage - startMileage
   
7. Vehicle now available for next assignment
```

---

## 🎓 Development Guidelines

### Entity Relationships Rules

1. **User is the root entity**
   - Everything connects back to User
   - User can have Rider profile, Driver profile, or both

2. **Ride is the core transaction**
   - Most entities relate to Ride
   - Payment, Rating, Earning, Tracking all link to Ride

3. **Vehicle ownership is flexible**
   - Check `ownershipType` before operations
   - DRIVER_OWNED: Use `ownerId`
   - COMPANY_OWNED: Use `VehicleAssignment`

4. **Always track history**
   - Don't delete, use soft deletes
   - Keep assignment history
   - Maintain audit trails

5. **Indexes are critical**
   - All foreign keys are indexed
   - Frequently queried fields are indexed
   - Composite indexes for common queries

### Business Logic Rules

1. **Driver can't accept ride without approved documents**
   - Check: `Driver.documentStatus = APPROVED`

2. **Company vehicle can't be assigned if already assigned**
   - Check: No active VehicleAssignment (returnedAt = null)

3. **Promotion can't be used if expired or limit reached**
   - Check: validFrom ≤ now ≤ validUntil
   - Check: usedCount < usageLimit

4. **Earnings calculated only for COMPLETED rides**
   - Check: Ride.status = COMPLETED
   - Check: Payment.status = COMPLETED

5. **Surge pricing applies based on location and time**
   - Check if pickup location is in active SurgeZone
   - Multiply base price by zone multiplier

---

## 📚 Quick Reference

### Find Available Company Vehicles
```sql
SELECT v.* FROM Vehicle v
LEFT JOIN VehicleAssignment va 
  ON v.id = va.vehicleId AND va.returnedAt IS NULL
WHERE v.ownershipType = 'COMPANY_OWNED'
  AND va.id IS NULL
```

### Find Driver's Current Vehicle Assignment
```sql
SELECT * FROM VehicleAssignment
WHERE driverId = 'driver-id'
  AND returnedAt IS NULL
```

### Calculate Driver's Total Earnings (This Month)
```sql
SELECT 
  SUM(netAmount) as totalEarnings,
  SUM(platformFee) as totalFees,
  COUNT(*) as totalRides
FROM Earning
WHERE driverId = 'driver-id'
  AND createdAt >= '2025-12-01'
  AND payoutStatus = 'PAID'
```

### Find Nearest Available Drivers
```sql
SELECT d.*, 
  (6371 * acos(cos(radians(:pickupLat)) 
    * cos(radians(d.latitude)) 
    * cos(radians(d.longitude) - radians(:pickupLng)) 
    + sin(radians(:pickupLat)) 
    * sin(radians(d.latitude)))) AS distance
FROM Driver d
WHERE d.isOnline = true
  AND d.documentStatus = 'APPROVED'
ORDER BY distance
LIMIT 10
```

---

## 🎯 Success Metrics

### Launch Goals (First 6 Months)
- 1,000 active riders
- 200 active drivers
- 10,000 completed rides
- 95% ride completion rate
- 4.5+ average rating

### Growth Goals (Year 1)
- 10,000 active riders
- 1,000 active drivers
- 100,000 completed rides
- Expand to 3 cities
- Break even on operations

---

## 🤝 Support & Maintenance

### Regular Tasks
- Monitor driver document expiry dates
- Process driver payouts weekly
- Review and resolve support tickets
- Analyze surge pricing effectiveness
- Track promotion ROI
- Monitor fleet vehicle maintenance schedules

### Scaling Considerations
- Database indexing optimization
- Caching frequently accessed data (Redis)
- Load balancing for API servers
- CDN for static assets
- Database read replicas
- Microservices architecture (future)

---

**Remember**: This is a comprehensive platform. Start with core features (ride booking, payments) and gradually add advanced features (fleet management, surge pricing, referrals). Focus on user experience and reliability above all else.

**Good luck building CodeRide! 🚀**
