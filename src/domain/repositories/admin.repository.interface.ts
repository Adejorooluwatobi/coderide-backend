import { CreateAdminParams, UpdateAdminParams } from '../../utils/type';
import { Admin } from '../entities/admin.entity';

export interface IAdminRepository {
  findById(id: string): Promise<Admin | null>;
  findAll(): Promise<Admin[]>;
  findByUsername(username: string): Promise<Admin | null>;
  create(admin: CreateAdminParams): Promise<Admin>;
  update(id: string, admin: Partial<UpdateAdminParams>): Promise<Admin>;
  updateStatus(id: string, status: string): Promise<Admin>;
  delete(id: string): Promise<void>;
}
