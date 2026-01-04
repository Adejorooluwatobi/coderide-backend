import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { Vehicle } from "./vehicle.entity";
import { Ride } from "./ride.entity";
import { DocumentStatus } from "../enums/document-status.enum";
import { ApiProperty } from "@nestjs/swagger";

export class Driver extends BaseEntity {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    user?: User;

    @ApiProperty()
    licenseNumber: string;

    @ApiProperty()
    licenseExpiry: Date;

    @ApiProperty()
    rating?: number;

    @ApiProperty()
    totalRides: number;

    @ApiProperty()
    totalEarnings: number;

    @ApiProperty()
    isOnline: boolean;

    @ApiProperty()
    latitude?: number;

    @ApiProperty()
    longitude?: number;

    @ApiProperty()
    documentStatus: DocumentStatus;

    @ApiProperty()
    bankAccountDetails?: unknown; // JSON

    @ApiProperty()
    ownedVehicles?: Vehicle[];

    @ApiProperty()
    assignedVehicles?: Vehicle[];

    @ApiProperty()
    rides?: Ride[];

    constructor(data: Partial<Driver>) {
        super();
        Object.assign(this, data);
    }
}