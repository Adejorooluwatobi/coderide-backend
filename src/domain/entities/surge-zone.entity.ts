import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

export class SurgeZone extends BaseEntity {
    @ApiProperty()
    name: string;

    @ApiProperty()
    polygon: any;

    @ApiProperty()
    multiplier: number;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    startTime: Date;

    @ApiProperty()
    endTime?: Date;

    constructor(data: Partial<SurgeZone>) {
        super();
        Object.assign(this, data);
    }
}
