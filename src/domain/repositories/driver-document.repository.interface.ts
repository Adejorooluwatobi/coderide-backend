import { CreateDriverDocumentParams, UpdateDriverDocumentParams } from '../../utils/type';
import { DriverDocument } from '../entities/driver-document.entity';

export interface IDriverDocumentRepository {
  findById(id: string): Promise<DriverDocument | null>;
  findAll(): Promise<DriverDocument[]>;
  findByDriverId(driverId: string): Promise<DriverDocument[]>;
  findByStatus(status: string): Promise<DriverDocument[]>;
  create(driverDocument: CreateDriverDocumentParams): Promise<DriverDocument>;
  update(id: string, driverDocument: Partial<UpdateDriverDocumentParams>): Promise<DriverDocument>;
  updateStatus(id: string, status: string): Promise<DriverDocument>;
  delete(id: string): Promise<void>;
}
