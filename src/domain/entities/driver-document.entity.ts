import { BaseEntity } from './base.entity';
import { Driver } from './driver.entity';
import { DocumentType } from '../enums/document-type.enum';
import { DocumentStatus } from '../enums/document-status.enum';

export class DriverDocument extends BaseEntity {
    driver: Driver;
    driverId: string;
    documentType: DocumentType;
    documentUrl: string;
    documentNumber?: string;
    expiryDate?: Date;
    status: DocumentStatus;
    rejectionReason?: string;
    uploadedAt: Date;
    verifiedAt?: Date;

    constructor(data: Partial<DriverDocument>) {
        super();
        Object.assign(this, data);
    }
}
