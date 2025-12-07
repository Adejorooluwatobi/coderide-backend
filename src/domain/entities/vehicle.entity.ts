import { VehicleCategory } from "../enums/vehicle-category.enum";
import { BaseEntity } from "./base.entity";
import { Driver } from "./driver.entity";


export class Vehicle extends BaseEntity {
    driverId: string;
    driver?: Driver;
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
