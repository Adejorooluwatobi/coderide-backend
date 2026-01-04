import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { VehicleAssignmentService } from '../../domain/services/vehicle-assignment.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateVehicleAssignmentDto } from 'src/application/DTO/vehicle-assignment/create-vehicle-assignment.dto';
import { UpdateVehicleAssignmentDto } from 'src/application/DTO/vehicle-assignment/update-vehicle-assignment.dto';
import { VehicleAssignment } from 'src/domain/entities/vehicle-assignment.entity';

@Controller('vehicle-assignment')
export class VehicleAssignmentController {
  constructor(private readonly vehicleAssignmentService: VehicleAssignmentService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle assignment by ID' })
  @ApiResponse({ status: 200, description: 'Vehicle assignment retrieved successfully', type: VehicleAssignment })
  async getById(@Param('id') id: string) {
    const assignment = await this.vehicleAssignmentService.findById(id);
    if (!assignment) throw new NotFoundException(`Vehicle assignment with ID ${id} not found`);
    return { succeeded: true, message: 'Vehicle assignment retrieved successfully', resultData: assignment };
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicle assignments' })
  @ApiResponse({ status: 200, description: 'Vehicle assignments retrieved successfully', type: [VehicleAssignment] })
  async getAll() {
    const assignments = await this.vehicleAssignmentService.findAll();
    return { succeeded: true, message: 'Vehicle assignments retrieved successfully', resultData: assignments };
  }

  @Get('active/driver/:driverId')
  @ApiOperation({ summary: 'Get active assignment by driver ID' })
  @ApiResponse({ status: 200, description: 'Active assignment retrieved successfully', type: VehicleAssignment })
  async getActiveByDriverId(@Param('driverId') driverId: string) {
    const assignment = await this.vehicleAssignmentService.findActiveByDriverId(driverId);
    if (!assignment) throw new NotFoundException(`No active assignment for driver ${driverId}`);
    return { succeeded: true, message: 'Active assignment retrieved successfully', resultData: assignment };
  }

  @Get('active/vehicle/:vehicleId')
  @ApiOperation({ summary: 'Get active assignment by vehicle ID' })
  @ApiResponse({ status: 200, description: 'Active assignment retrieved successfully', type: VehicleAssignment })
  async getActiveByVehicleId(@Param('vehicleId') vehicleId: string) {
    const assignment = await this.vehicleAssignmentService.findActiveByVehicleId(vehicleId);
    if (!assignment) throw new NotFoundException(`No active assignment for vehicle ${vehicleId}`);
    return { succeeded: true, message: 'Active assignment retrieved successfully', resultData: assignment };
  }

  @Get('driver/:driverId')
  @ApiOperation({ summary: 'Get all assignments by driver ID' })
  @ApiResponse({ status: 200, description: 'Assignments retrieved successfully', type: [VehicleAssignment] })
  async getByDriverId(@Param('driverId') driverId: string) {
    const assignments = await this.vehicleAssignmentService.findByDriverId(driverId);
    return { succeeded: true, message: 'Assignments retrieved successfully', resultData: assignments };
  }

  @Get('vehicle/:vehicleId')
  @ApiOperation({ summary: 'Get all assignments by vehicle ID' })
  @ApiResponse({ status: 200, description: 'Assignments retrieved successfully', type: [VehicleAssignment] })
  async getByVehicleId(@Param('vehicleId') vehicleId: string) {
    const assignments = await this.vehicleAssignmentService.findByVehicleId(vehicleId);
    return { succeeded: true, message: 'Assignments retrieved successfully', resultData: assignments };
  }

  @Post()
  @ApiOperation({ summary: 'Create vehicle assignment' })
  @ApiResponse({ status: 201, description: 'Vehicle assignment created successfully', type: VehicleAssignment })
  async create(@Body(new ValidationPipe()) data: CreateVehicleAssignmentDto) {
    const assignment = await this.vehicleAssignmentService.create(data);
    return { succeeded: true, message: 'Vehicle assignment created successfully', resultData: assignment };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update vehicle assignment' })
  @ApiResponse({ status: 200, description: 'Vehicle assignment updated successfully', type: VehicleAssignment })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) data: Partial<UpdateVehicleAssignmentDto>) {
    const assignment = await this.vehicleAssignmentService.update(id, data);
    return { succeeded: true, message: 'Vehicle assignment updated successfully', resultData: assignment };
  }

  @Put(':id/end')
  @ApiOperation({ summary: 'End vehicle assignment' })
  @ApiResponse({ status: 200, description: 'Vehicle assignment ended successfully', type: VehicleAssignment })
  async endAssignment(@Param('id') id: string, @Body() body: { returnDate: Date }) {
    const assignment = await this.vehicleAssignmentService.endAssignment(id, body.returnDate);
    return { succeeded: true, message: 'Vehicle assignment ended successfully', resultData: assignment };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete vehicle assignment' })
  @ApiResponse({ status: 200, description: 'Vehicle assignment deleted successfully' })
  async delete(@Param('id') id: string) {
    await this.vehicleAssignmentService.delete(id);
    return { succeeded: true, message: 'Vehicle assignment deleted successfully' };
  }
}
