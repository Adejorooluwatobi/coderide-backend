import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { DriverDocumentService } from '../../domain/services/driver-document.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateDriverDocumentDto } from 'src/application/DTO/driver-document/create-driver-document.dto';
import { UpdateDriverDocumentDto } from 'src/application/DTO/driver-document/update-driver-document.dto';
import { UpdateStatusDto } from 'src/application/DTO/common/update-status.dto';
import { DriverDocument } from 'src/domain/entities/driver-document.entity';

@Controller('driver-document')
export class DriverDocumentController {
  constructor(private readonly driverDocumentService: DriverDocumentService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get driver document by ID' })
  @ApiResponse({ status: 200, description: 'Driver document retrieved successfully', type: DriverDocument })
  async getById(@Param('id') id: string) {
    const doc = await this.driverDocumentService.findById(id);
    if (!doc) throw new NotFoundException(`Driver document with ID ${id} not found`);
    return { succeeded: true, message: 'Driver document retrieved successfully', resultData: doc };
  }

  @Get()
  @ApiOperation({ summary: 'Get all driver documents' })
  @ApiResponse({ status: 200, description: 'Driver documents retrieved successfully', type: [DriverDocument] })
  async getAll() {
    const docs = await this.driverDocumentService.findAll();
    return { succeeded: true, message: 'Driver documents retrieved successfully', resultData: docs };
  }

  @Get('driver/:driverId')
  @ApiOperation({ summary: 'Get documents by driver ID' })
  @ApiResponse({ status: 200, description: 'Driver documents retrieved successfully', type: [DriverDocument] })
  async getByDriverId(@Param('driverId') driverId: string) {
    const docs = await this.driverDocumentService.findByDriverId(driverId);
    return { succeeded: true, message: 'Driver documents retrieved successfully', resultData: docs };
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get documents by status' })
  @ApiResponse({ status: 200, description: 'Driver documents retrieved successfully', type: [DriverDocument] })
  async getByStatus(@Param('status') status: string) {
    const docs = await this.driverDocumentService.findByStatus(status);
    return { succeeded: true, message: 'Driver documents retrieved successfully', resultData: docs };
  }

  @Post()
  @ApiOperation({ summary: 'Create driver document' })
  @ApiResponse({ status: 200, description: 'Driver document created successfully', type: DriverDocument })
  async create(@Body(new ValidationPipe()) data: CreateDriverDocumentDto) {
    const doc = await this.driverDocumentService.create(data);
    return { succeeded: true, message: 'Driver document created successfully', resultData: doc };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update driver document' })
  @ApiResponse({ status: 200, description: 'Driver document updated successfully', type: DriverDocument })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) data: Partial<UpdateDriverDocumentDto>) {
    const doc = await this.driverDocumentService.update(id, data);
    return { succeeded: true, message: 'Driver document updated successfully', resultData: doc };
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update driver document status' })
  @ApiResponse({ status: 200, description: 'Driver document status updated successfully', type: DriverDocument })
  async updateStatus(@Param('id') id: string, @Body(new ValidationPipe()) statusData: UpdateStatusDto) {
    const doc = await this.driverDocumentService.updateStatus(id, statusData.status);
    return { succeeded: true, message: 'Driver document status updated successfully', resultData: doc };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete driver document' })
  @ApiResponse({ status: 200, description: 'Driver document deleted successfully' })
  async delete(@Param('id') id: string) {
    await this.driverDocumentService.delete(id);
    return { succeeded: true, message: 'Driver document deleted successfully' };
  }
}
