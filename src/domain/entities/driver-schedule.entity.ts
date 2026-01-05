import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { Driver } from './driver.entity';

export class DriverSchedule extends BaseEntity {
    @ApiProperty()
    driver: Driver;

    @ApiProperty()
    driverId: string;

    @ApiProperty()
    dayOfWeek: number;

    @ApiProperty()
    startTime: string;

    @ApiProperty()
    endTime: string;

    @ApiProperty()
    isActive: boolean;

    constructor(data: Partial<DriverSchedule>) {
        super();
        Object.assign(this, data);
    }
}
