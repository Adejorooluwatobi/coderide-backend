import { VehicleCategory } from "../enums/vehicle-category.enum";
import { VehicleOwnership } from "../enums/vehicle-ownership.enum";
import { BaseEntity } from "./base.entity";
import { Driver } from "./driver.entity";



export class Vehicle extends BaseEntity {
    ownershipType: VehicleOwnership;
    owner: Driver;
    ownerId?: string;
    licensePlate: string;
    make: string;
    model: string;
    year: number;
    color: string;
    category: VehicleCategory;
    seats: number;
    insuranceExpiry: Date;
    vehiclePhotos: string[];
    isActive: boolean;

    constructor(data: Partial<Vehicle>) {
        super();
        Object.assign(this, data);
    }
}
