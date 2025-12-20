import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { Vehicle } from "./vehicle.entity";
import { Ride } from "./ride.entity";
import { DocumentStatus } from "../enums/document-status.enum";

export class Driver extends BaseEntity {
    userId: string;
    user?: User;
    licenseNumber: string;
    licenseExpiry: Date;
    rating?: number;
    totalRides: number;
    totalEarnings: number;
    isOnline: boolean;
    latitude?: number;
    longitude?: number;
    documentStatus: DocumentStatus;
    bankAccountDetails?: unknown; // JSON

    ownedVehicles?: Vehicle[];
    assignedVehicles?: Vehicle[];
    rides?: Ride[];

    constructor(data: Partial<Driver>) {
        super();
        Object.assign(this, data);
    }
}