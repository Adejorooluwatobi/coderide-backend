import { BaseEntity } from "./base.entity";
import { Chat } from "./chat.entity";
import { User } from "./user.entity";
import { Vehicle } from "./vehicle.entity";
import { Ride } from "./ride.entity";
import { DocumentStatus } from "../enums/document-status.enum";
import { ApiProperty } from "@nestjs/swagger";
import { DriverStatus } from "../enums/driver-status.enum";

export class Driver extends BaseEntity {
    @ApiProperty()
    userId: string;

    @ApiProperty({ type: () => User })
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
    status: DriverStatus;

    @ApiProperty()
    latitude?: number;

    @ApiProperty()
    longitude?: number;

    @ApiProperty()
    documentStatus: DocumentStatus;

    @ApiProperty()
    bankAccountDetails?: unknown; // JSON

    @ApiProperty({ type: () => [Vehicle] })
    ownedVehicles?: Vehicle[];

    @ApiProperty({ type: () => [Vehicle] })
    assignedVehicles?: Vehicle[];

    @ApiProperty({ type: () => [Ride] })
    rides?: Ride[];

    @ApiProperty({ type: () => [Chat] })
    chats?: Chat[];

    constructor(data: Partial<Driver>) {
        super();
        Object.assign(this, data);
    }
}