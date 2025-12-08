import { CreateCompanyDriverParams, CreateDriverApplicationParams, UpdateDriverParams } from '../../utils/type';
import { Driver } from '../entities/driver.entity';

export interface IDriverRepository {
  findById(id: string): Promise<Driver | null>;
  findAll(): Promise<Driver[]>;
  findByUserId(userId: string): Promise<Driver | null>;
  findByLicenseNumber(licenseNumber: string): Promise<Driver | null>;
  createApplication(driver: CreateDriverApplicationParams): Promise<Driver>;
  createCompanyDriver(driver: CreateCompanyDriverParams): Promise<Driver>;
  update(id: string, driver: Partial<UpdateDriverParams>): Promise<Driver>;
  delete(id: string): Promise<void>;
}
