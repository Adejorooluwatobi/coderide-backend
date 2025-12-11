import { Inject, Injectable, Logger } from '@nestjs/common';
import { Admin } from '../entities/admin.entity';
import type { IAdminRepository } from '../repositories/admin.repository.interface';
import { CreateAdminParams, UpdateAdminParams } from 'src/utils/type';
import * as bcrypt from 'bcrypt'; // Added bcrypt import

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  constructor(
    @Inject('IAdminRepository')
    private readonly adminRepository: IAdminRepository,
  ) {}

  async findById(id: string): Promise<Admin | null> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.adminRepository.findById(id);
  }

  async findAll(): Promise<Admin[]> {
    this.logger.log('Fetching all admins');
    return this.adminRepository.findAll();
  }

  async findByUsername(username: string): Promise<Admin | null> {
    if (!username || typeof username !== 'string') {
      this.logger.warn(`Invalid username provided: ${username}`);
      return null;
    }
    return this.adminRepository.findByUsername(username);
  }

  async create(admin: CreateAdminParams): Promise<Admin> {
    if (!admin.username || !admin.password) {
      this.logger.error('Username and password are required');
      throw new Error('Username and password are required');
    }
    const existingAdmin = await this.adminRepository.findByUsername(admin.username);
    if (existingAdmin) {
      this.logger.error(`Admin with username ${admin.username} already exists`);
      throw new Error('Admin with this username already exists');
    }
    if (admin.password) {
      admin.password = await bcrypt.hash(admin.password, 10);
    }
    this.logger.log(`Creating admin with username: ${admin.username}`);
    return this.adminRepository.create(admin);
  }

  async update(id: string, admin: Partial<UpdateAdminParams>): Promise<Admin> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      throw new Error('Invalid id');
    }
    return this.adminRepository.update(id, admin);
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      throw new Error('Invalid id');
    }
    return this.adminRepository.delete(id);
  }

}
