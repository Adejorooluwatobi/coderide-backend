import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { DriverScheduleService } from '../../domain/services/driver-schedule.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateDriverScheduleDto } from 'src/application/DTO/driver-schedule/create-driver-schedule.dto';
import { UpdateDriverScheduleDto } from 'src/application/DTO/driver-schedule/update-driver-schedule.dto';

@Controller('driver-schedule')
export class DriverScheduleController {
  constructor(private readonly driverScheduleService: DriverScheduleService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get driver schedule by ID' })
  async getById(@Param('id') id: string) {
    const schedule = await this.driverScheduleService.findById(id);
    if (!schedule) throw new NotFoundException(`Driver schedule with ID ${id} not found`);
    return { succeeded: true, message: 'Driver schedule retrieved successfully', resultData: schedule };
  }

  @Get()
  @ApiOperation({ summary: 'Get all driver schedules' })
  async getAll() {
    const schedules = await this.driverScheduleService.findAll();
    return { succeeded: true, message: 'Driver schedules retrieved successfully', resultData: schedules };
  }

  @Get('driver/:driverId')
  @ApiOperation({ summary: 'Get schedules by driver ID' })
  async getByDriverId(@Param('driverId') driverId: string) {
    const schedules = await this.driverScheduleService.findByDriverId(driverId);
    return { succeeded: true, message: 'Driver schedules retrieved successfully', resultData: schedules };
  }

  @Post()
  @ApiOperation({ summary: 'Create driver schedule' })
  async create(@Body(new ValidationPipe()) data: CreateDriverScheduleDto) {
    const schedule = await this.driverScheduleService.create(data);
    return { succeeded: true, message: 'Driver schedule created successfully', resultData: schedule };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update driver schedule' })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) data: Partial<UpdateDriverScheduleDto>) {
    const schedule = await this.driverScheduleService.update(id, data);
    return { succeeded: true, message: 'Driver schedule updated successfully', resultData: schedule };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete driver schedule' })
  async delete(@Param('id') id: string) {
    await this.driverScheduleService.delete(id);
    return { succeeded: true, message: 'Driver schedule deleted successfully' };
  }
}
