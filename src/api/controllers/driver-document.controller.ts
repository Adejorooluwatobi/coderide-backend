import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { DriverDocumentService } from '../../domain/services/driver-document.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateDriverDocumentDto } from 'src/application/DTO/driver-document/create-driver-document.dto';
import { UpdateDriverDocumentDto } from 'src/application/DTO/driver-document/update-driver-document.dto';

@Controller('driver-document')
export class DriverDocumentController {
  constructor(private readonly driverDocumentService: DriverDocumentService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get driver document by ID' })
  async getById(@Param('id') id: string) {
    const doc = await this.driverDocumentService.findById(id);
    if (!doc) throw new NotFoundException(`Driver document with ID ${id} not found`);
    return { succeeded: true, message: 'Driver document retrieved successfully', resultData: doc };
  }

  @Get()
  @ApiOperation({ summary: 'Get all driver documents' })
  async getAll() {
    const docs = await this.driverDocumentService.findAll();
    return { succeeded: true, message: 'Driver documents retrieved successfully', resultData: docs };
  }

  @Get('driver/:driverId')
  @ApiOperation({ summary: 'Get documents by driver ID' })
  async getByDriverId(@Param('driverId') driverId: string) {
    const docs = await this.driverDocumentService.findByDriverId(driverId);
    return { succeeded: true, message: 'Driver documents retrieved successfully', resultData: docs };
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get documents by status' })
  async getByStatus(@Param('status') status: string) {
    const docs = await this.driverDocumentService.findByStatus(status);
    return { succeeded: true, message: 'Driver documents retrieved successfully', resultData: docs };
  }

  @Post()
  @ApiOperation({ summary: 'Create driver document' })
  async create(@Body(new ValidationPipe()) data: CreateDriverDocumentDto) {
    const doc = await this.driverDocumentService.create(data);
    return { succeeded: true, message: 'Driver document created successfully', resultData: doc };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update driver document' })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) data: Partial<UpdateDriverDocumentDto>) {
    const doc = await this.driverDocumentService.update(id, data);
    return { succeeded: true, message: 'Driver document updated successfully', resultData: doc };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete driver document' })
  async delete(@Param('id') id: string) {
    await this.driverDocumentService.delete(id);
    return { succeeded: true, message: 'Driver document deleted successfully' };
  }
}
