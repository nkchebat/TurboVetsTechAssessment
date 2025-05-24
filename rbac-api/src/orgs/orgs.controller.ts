import { Controller, Post, Body, Get } from '@nestjs/common';
import { OrgsService } from './orgs.service';
import { Organization } from './org.entity';

@Controller('orgs')
export class OrgsController {
  constructor(private readonly orgsService: OrgsService) {}

  @Post()
  async create(@Body() orgData: Partial<Organization>) {
  console.log('🚀 Controller received:', orgData);
  try {
    const result = await this.orgsService.create(orgData);
    console.log('✅ Org created:', result);
    return result;
  } catch (err) {
    console.error('❌ Error in POST /orgs:', err);
    throw err;
  }
}


  @Get()
  findAll() {
    return this.orgsService.findAll();
  }
}
