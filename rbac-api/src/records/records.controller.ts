import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RecordsService } from './records.service';
import { PatientRecord } from './patient-record.entity';
import { Request } from 'express';
import { Req, ForbiddenException } from '@nestjs/common';
import { Patch } from '@nestjs/common';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  create(@Body() data: Partial<PatientRecord>) {
    return this.recordsService.create(data);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = req['user'];
    return this.recordsService.findVisibleRecords(user);
  }

  @Get(':id')
  async findById(@Param('id') id: number, @Req() req: Request) {
    const user = req['user'];
    const record = await this.recordsService.findById(id);

    if (!record) {
      throw new ForbiddenException('Record not found');
    }

    const hasAccess = this.recordsService.canAccess(user, record);

    if (!hasAccess) {
      throw new ForbiddenException(
        'You do not have permission to view this record.',
      );
    }

    return record;
  }

  @Patch(':id')
  update(@Param('id') id: number, @Req() req: Request, @Body() updates: any) {
    const user = req['user'];
    return this.recordsService.update(+id, user, updates);
  }
}
