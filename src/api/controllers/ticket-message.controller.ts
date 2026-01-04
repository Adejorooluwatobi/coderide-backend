import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, NotFoundException } from '@nestjs/common';
import { TicketMessageService } from '../../domain/services/ticket-message.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTicketMessageDto } from 'src/application/DTO/ticket-message/create-ticket-message.dto';
import { UpdateTicketMessageDto } from 'src/application/DTO/ticket-message/update-ticket-message.dto';
import { TicketMessage } from '@prisma/client';
import { TicketMessage as TicketMessageEntity } from 'src/domain/entities/ticket-message.entity';

@Controller('ticket-message')
export class TicketMessageController {
  constructor(private readonly ticketMessageService: TicketMessageService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket message by ID' })
  @ApiResponse({ status: 200, description: 'Ticket message retrieved successfully', type: TicketMessageEntity })
  async getById(@Param('id') id: string) {
    const message = await this.ticketMessageService.findById(id);
    if (!message) throw new NotFoundException(`Ticket message with ID ${id} not found`);
    return { succeeded: true, message: 'Ticket message retrieved successfully', resultData: message };
  }

  @Get()
  @ApiOperation({ summary: 'Get all ticket messages' })
  @ApiResponse({ status: 200, description: 'Ticket messages retrieved successfully', type: [TicketMessageEntity] })
  async getAll() {
    const messages = await this.ticketMessageService.findAll();
    return { succeeded: true, message: 'Ticket messages retrieved successfully', resultData: messages };
  }

  @Get('ticket/:ticketId')
  @ApiOperation({ summary: 'Get messages by ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket messages retrieved successfully', type: [TicketMessageEntity] })
  async getByTicketId(@Param('ticketId') ticketId: string) {
    const messages = await this.ticketMessageService.findByTicketId(ticketId);
    return { succeeded: true, message: 'Ticket messages retrieved successfully', resultData: messages };
  }

  @Post()
  @ApiOperation({ summary: 'Create ticket message' })
  @ApiResponse({ status: 201, description: 'Ticket message created successfully', type: TicketMessageEntity })
  async create(@Body(new ValidationPipe()) data: CreateTicketMessageDto) {
    const message = await this.ticketMessageService.create(data as TicketMessage);
    return { succeeded: true, message: 'Ticket message created successfully', resultData: message };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update ticket message' })
  @ApiResponse({ status: 200, description: 'Ticket message updated successfully', type: TicketMessageEntity })
  async update(@Param('id') id: string, @Body(new ValidationPipe()) data: Partial<UpdateTicketMessageDto>) {
    const message = await this.ticketMessageService.update(id, data);
    return { succeeded: true, message: 'Ticket message updated successfully', resultData: message };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete ticket message' })
  @ApiResponse({ status: 200, description: 'Ticket message deleted successfully' })
  async delete(@Param('id') id: string) {
    await this.ticketMessageService.delete(id);
    return { succeeded: true, message: 'Ticket message deleted successfully' };
  }
}
