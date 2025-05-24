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

  create(orgData: Partial<Organization>) {
  console.log('📥 Service received orgData:', orgData);

  const org = this.orgRepo.create(orgData);
  console.log('🧱 Org entity created:', org);

  return this.orgRepo.save(org); // this is where failure likely happens
}


  findAll() {
    return this.orgRepo.find({ relations: ['parent', 'children', 'users'] });
  }
}
