import { BaseEntity } from './base.entity';
import { Driver } from './driver.entity';

export class DriverSchedule extends BaseEntity {
    driver: Driver;
    driverId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;

    constructor(data: Partial<DriverSchedule>) {
        super();
        Object.assign(this, data);
    }
}
