import { VehicleCategory } from "../enums/vehicle-category.enum";
import { VehicleOwnership } from "../enums/vehicle-ownership.enum";
import { BaseEntity } from "./base.entity";
import { Driver } from "./driver.entity";
import { ApiProperty } from "@nestjs/swagger";



export class Vehicle extends BaseEntity {
    @ApiProperty()
    ownershipType: VehicleOwnership;

    @ApiProperty({ type: () => Driver })
    owner: Driver;

    @ApiProperty()
    ownerId?: string;

    @ApiProperty()
    licensePlate: string;

    @ApiProperty()
    make: string;

    @ApiProperty()
    model: string;

    @ApiProperty()
    year: number;

    @ApiProperty()
    color: string;

    @ApiProperty()
    category: VehicleCategory;

    @ApiProperty()
    seats: number;

    @ApiProperty()
    insuranceExpiry: Date;

    @ApiProperty()
    vehiclePhotos: string[];

    @ApiProperty()
    isActive: boolean;

    constructor(data: Partial<Vehicle>) {
        super();
        Object.assign(this, data);
    }
}
