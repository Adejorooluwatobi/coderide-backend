import { BaseEntity } from './base.entity';

export class SurgeZone extends BaseEntity {
    name: string;
    polygon: any;
    multiplier: number;
    isActive: boolean;
    startTime: Date;
    endTime?: Date;

    constructor(data: Partial<SurgeZone>) {
        super();
        Object.assign(this, data);
    }
}
