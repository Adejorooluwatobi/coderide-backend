import { BaseEntity } from './base.entity';
import { Driver } from './driver.entity';
import { DocumentType } from '../enums/document-type.enum';
import { DocumentStatus } from '../enums/document-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class DriverDocument extends BaseEntity {
    @ApiProperty()
    driver: Driver;

    @ApiProperty()
    driverId: string;

    @ApiProperty()
    documentType: DocumentType;
    
    @ApiProperty()
    documentUrl: string;

    @ApiProperty()
    documentNumber?: string;

    @ApiProperty()
    expiryDate?: Date;

    @ApiProperty()
    status: DocumentStatus;

    @ApiProperty()
    rejectionReason?: string;

    @ApiProperty()
    uploadedAt: Date;

    @ApiProperty()
    verifiedAt?: Date;

    constructor(data: Partial<DriverDocument>) {
        super();
        Object.assign(this, data);
    }
}
