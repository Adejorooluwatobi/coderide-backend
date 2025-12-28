import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException, UseGuards, ForbiddenException } from '@nestjs/common';
import { NotificationService } from '../../domain/services/notification.service';
import { User } from 'src/shared/common/decorators/user.decorator';
import { UserGuard } from '../auth/guards/user.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateNotificationDto } from 'src/application/DTO/notification/create-notification.dto';
import { UpdateNotificationDto } from 'src/application/DTO/notification/update-notification.dto';

@Controller('notification')
@UseGuards(UserGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  async getById(@Param('id') id: string) {
    const notification = await this.notificationService.findById(id);
    if (!notification) throw new NotFoundException(`Notification with ID ${id} not found`);
    return { succeeded: true, message: 'Notification retrieved successfully', resultData: notification };
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  async getAll() {
    const notifications = await this.notificationService.findAll();
    return { succeeded: true, message: 'Notifications retrieved successfully', resultData: notifications };
  }

  @Get('user/me')
  @ApiOperation({ summary: 'Get notifications for logged-in user' })
  async getMyNotifications(@User() user: any) {
    const notifications = await this.notificationService.findByUserId(user.sub);
    return { succeeded: true, message: 'Notifications retrieved successfully', resultData: notifications };
  }

  @Post()
  @ApiOperation({ summary: 'Create notification' })
  async create(@Body(new ValidationPipe()) data: CreateNotificationDto) {
    const notification = await this.notificationService.create(data);
    return { succeeded: true, message: 'Notification created successfully', resultData: notification };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update notification' })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) data: Partial<UpdateNotificationDto>) {
    const notification = await this.notificationService.update(id, data);
    return { succeeded: true, message: 'Notification updated successfully', resultData: notification };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  async delete(@Param('id') id: string) {
    await this.notificationService.delete(id);
    return { succeeded: true, message: 'Notification deleted successfully' };
  }
}
