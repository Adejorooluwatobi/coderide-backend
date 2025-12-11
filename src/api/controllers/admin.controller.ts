import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { AdminService } from '../../domain/services/admin.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateAdminDto } from 'src/application/DTO/admin/create-admin.dto';
import { UpdateAdminDto } from 'src/application/DTO/admin/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get admin by ID' })
  async getAdminById(@Param('id') id: string) {
    const admin = await this.adminService.findById(id);
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return { succeeded: true, message: 'Admin retrieved successfully', resultData: admin };
  }

  @Get()
  @ApiOperation({ summary: 'Get all admins' })
  async getAllAdmins() {
    const admins = await this.adminService.findAll();
    return { succeeded: true, message: 'Admins retrieved successfully', resultData: admins };
  }

  @Get('username/:username')
  @ApiOperation({ summary: 'Get admin by username' })
  async getAdminByUsername(@Param('username') username: string) {
    const admin = await this.adminService.findByUsername(username);
    if (!admin) {
      throw new NotFoundException(`Admin with username ${username} not found`);
    }
    return { succeeded: true, message: 'Admin retrieved successfully', resultData: admin };
  }

  @Post()
  @ApiOperation({ summary: 'Create admin' })
  async createAdmin(@Body(new ValidationPipe()) adminData: CreateAdminDto) {
    const admin = await this.adminService.create(adminData);
    return { succeeded: true, message: 'Admin created successfully', resultData: admin };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update admin' })
  async updateAdmin(@Param('id') id: string, @Body(new ValidationPipe()) adminData: Partial<UpdateAdminDto>) {
    const admin = await this.adminService.update(id, adminData);
    return { succeeded: true, message: 'Admin updated successfully', resultData: admin };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete admin' })
  async deleteAdmin(@Param('id') id: string) {
    await this.adminService.delete(id);
    return { succeeded: true, message: 'Admin deleted successfully' };
  }
}
