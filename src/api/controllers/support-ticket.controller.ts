import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { SupportTicketService } from '../../domain/services/support-ticket.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateSupportTicketDto } from 'src/application/DTO/support-ticket/create-support-ticket.dto';
import { UpdateSupportTicketDto } from 'src/application/DTO/support-ticket/update-support-ticket.dto';

@Controller('support-ticket')
export class SupportTicketController {
  constructor(private readonly supportTicketService: SupportTicketService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get support ticket by ID' })
  async getById(@Param('id') id: string) {
    const ticket = await this.supportTicketService.findById(id);
    if (!ticket) throw new NotFoundException(`Support ticket with ID ${id} not found`);
    return { succeeded: true, message: 'Support ticket retrieved successfully', resultData: ticket };
  }

  @Get()
  @ApiOperation({ summary: 'Get all support tickets' })
  async getAll() {
    const tickets = await this.supportTicketService.findAll();
    return { succeeded: true, message: 'Support tickets retrieved successfully', resultData: tickets };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get tickets by user ID' })
  async getByUserId(@Param('userId') userId: string) {
    const tickets = await this.supportTicketService.findByUserId(userId);
    return { succeeded: true, message: 'Support tickets retrieved successfully', resultData: tickets };
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get tickets by status' })
  async getByStatus(@Param('status') status: string) {
    const tickets = await this.supportTicketService.findByStatus(status);
    return { succeeded: true, message: 'Support tickets retrieved successfully', resultData: tickets };
  }

  @Post()
  @ApiOperation({ summary: 'Create support ticket' })
  async create(@Body(new ValidationPipe()) data: CreateSupportTicketDto) {
    const ticket = await this.supportTicketService.create(data as any);
    return { succeeded: true, message: 'Support ticket created successfully', resultData: ticket };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update support ticket' })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) data: Partial<UpdateSupportTicketDto>) {
    const ticket = await this.supportTicketService.update(id, data);
    return { succeeded: true, message: 'Support ticket updated successfully', resultData: ticket };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete support ticket' })
  async delete(@Param('id') id: string) {
    await this.supportTicketService.delete(id);
    return { succeeded: true, message: 'Support ticket deleted successfully' };
  }
}
