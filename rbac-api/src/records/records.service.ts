import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientRecord } from './patient-record.entity';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(PatientRecord)
    private recordRepo: Repository<PatientRecord>,
  ) {}

  create(data: Partial<PatientRecord>) {
    const record = this.recordRepo.create(data);
    return this.recordRepo.save(record);
  }

  findAll() {
    return this.recordRepo.find({ relations: ['owner', 'organization'] });
  }

  findById(id: number) {
    return this.recordRepo.findOne({
      where: { id },
      relations: ['owner', 'organization'],
    });
  }

  canAccess(user: any, record: any): boolean {
    // Rule 1: Owners always have access
    if (record.owner.id === user.id) return true;

    // Rule 2: Admins in the same org can access
    if (
      user.role === 'Admin' &&
      user.organization?.id === record.organization?.id
    ) {
      return true;
    }

    // Rule 3: Viewers can see (but not edit) if in same org
    if (
      user.role === 'Viewer' &&
      user.organization?.id === record.organization?.id
    ) {
      return true;
    }

    // Otherwise: no access
    return false;
  }

  findVisibleRecords(user: any) {
    if (user.role === 'Admin' || user.role === 'Viewer') {
      return this.recordRepo.find({
        where: {
          organization: { id: user.organization.id },
        },
        relations: ['owner', 'organization'],
      });
    }

    // If Owner, return only their own records
    return this.recordRepo.find({
      where: {
        owner: { id: user.id },
      },
      relations: ['owner', 'organization'],
    });
  }

  async update(id: number, user: any, updates: Partial<any>) {
    const record = await this.findById(id);

    if (!record) {
      throw new NotFoundException('Record not found');
    }

    if (!this.canAccess(user, record) || user.role === 'Viewer') {
      throw new ForbiddenException('You do not have permission to edit this record.');
    }

    Object.assign(record, updates);
    return this.recordRepo.save(record);
  }
}
