import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class FakeAuthMiddleware implements NestMiddleware {
  constructor(private dataSource: DataSource) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Simulate logged-in user (user with ID = 1)
    const user = await this.dataSource.getRepository(User).findOne({
      where: { id: 1 },
      relations: ['organization'],
    });

    if (!user) {
      return res
        .status(401)
        .json({ error: 'User not found. Create user with id = 1.' });
    }

    req['user'] = user; // Attach to request
    console.log('Logged-in user:', user);
    next();
  }
}
