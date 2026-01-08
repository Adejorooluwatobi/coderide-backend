import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { AdminService } from '../../domain/services/admin.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAdminDto } from 'src/application/DTO/admin/create-admin.dto';
import { UpdateAdminDto } from 'src/application/DTO/admin/update-admin.dto';
import { UpdateStatusDto } from 'src/application/DTO/common/update-status.dto';
import { Admin } from 'src/domain/entities/admin.entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiResponse({ status: 200, description: 'Admin retrieved successfully', type: Admin })
  async getAdminById(@Param('id') id: string) {
    const admin = await this.adminService.findById(id);
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return { succeeded: true, message: 'Admin retrieved successfully', resultData: admin };
  }

  @Get()
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'Admins retrieved successfully', type: [Admin] })
  async getAllAdmins() {
    const admins = await this.adminService.findAll();
    return { succeeded: true, message: 'Admins retrieved successfully', resultData: admins };
  }

  @Get('username/:username')
  @ApiOperation({ summary: 'Get admin by username' })
  @ApiResponse({ status: 200, description: 'Admin retrieved successfully', type: Admin })
  async getAdminByUsername(@Param('username') username: string) {
    const admin = await this.adminService.findByUsername(username);
    if (!admin) {
      throw new NotFoundException(`Admin with username ${username} not found`);
    }
    return { succeeded: true, message: 'Admin retrieved successfully', resultData: admin };
  }

  @Post()
  @ApiOperation({ summary: 'Create admin' })
  @ApiResponse({ status: 201, description: 'Admin created successfully', type: Admin })
  async createAdmin(@Body(new ValidationPipe()) adminData: CreateAdminDto) {
    const admin = await this.adminService.create(adminData);
    return { succeeded: true, message: 'Admin created successfully', resultData: admin };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update admin' })
  @ApiResponse({ status: 200, description: 'Admin updated successfully', type: Admin })
  async updateAdmin(@Param('id') id: string, @Body(new ValidationPipe()) adminData: Partial<UpdateAdminDto>) {
    const admin = await this.adminService.update(id, adminData);
    return { succeeded: true, message: 'Admin updated successfully', resultData: admin };
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update admin status' })
  @ApiResponse({ status: 200, description: 'Admin status updated successfully', type: Admin })
  async updateStatus(@Param('id') id: string, @Body(new ValidationPipe()) statusData: UpdateStatusDto) {
    const admin = await this.adminService.updateStatus(id, statusData.status);
    return { succeeded: true, message: 'Admin status updated successfully', resultData: admin };
  }

  @Post('approve-driver/:id')
  @ApiOperation({ summary: 'Approve a driver application' })
  @ApiResponse({ status: 200, description: 'Driver approved successfully' })
  async approveDriver(@Param('id') id: string) {
    const result = await this.adminService.approveDriver(id);
    return { succeeded: true, ...result };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete admin' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
  async deleteAdmin(@Param('id') id: string) {
    await this.adminService.delete(id);
    return { succeeded: true, message: 'Admin deleted successfully' };
  }
}
