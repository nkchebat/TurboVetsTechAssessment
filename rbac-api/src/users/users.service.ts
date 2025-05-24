import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async create(data: Partial<User>) {
    const user = this.usersRepo.create(data);
    const saved = await this.usersRepo.save(user);

    console.log(`[AUDIT] Created user ${saved.name}`, {
      email: saved.email,
      orgId:
        saved.organization?.id ?? (data as any).organizationId ?? 'unknown',
      timestamp: new Date().toISOString(),
    });

    return saved;
  }

  findAll() {
    return this.usersRepo.find();
  }
}
