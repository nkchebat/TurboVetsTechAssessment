import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './org.entity';

@Injectable()
export class OrgsService {
  constructor(
    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,
  ) {}

  async create(data: Partial<Organization>) {
    const org = this.orgRepo.create(data);
    const saved = await this.orgRepo.save(org);

    // Audit log stub
    console.log(`[AUDIT] Created organization ${saved.name}`, {
      orgId: saved.id,
      timestamp: new Date().toISOString(),
    });

    return saved;
  }

  findAll() {
    return this.orgRepo.find({ relations: ['parent', 'children', 'users'] });
  }
}
