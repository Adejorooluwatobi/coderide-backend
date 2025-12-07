// admin-permission.enum.ts

// Using a bitmask allows an admin to hold multiple permissions
// by summing the values (e.g., 1 + 2 = 3, which is System Settings + View Reports)
export enum AdminPermission {
    MANAGE_SYSTEM_SETTINGS = 1, // 2^0
    VIEW_REPORTS = 2,           // 2^1
    MANAGE_DRIVERS = 4,         // 2^2
    MANAGE_PAYMENTS = 8,        // 2^3
    MANAGE_RIDES = 16,          // 2^4
    MANAGE_USERS = 32,          // 2^5
    
    // Recommended additions for a robust system
    MANAGE_PROMOTIONS_COUPONS = 64,  // 2^6 (Marketing/Growth)
    MANAGE_SAFETY_INCIDENTS = 128,   // 2^7 (Safety/Legal)
}