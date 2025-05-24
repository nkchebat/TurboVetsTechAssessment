import { FakeAuthMiddleware } from './fake-auth.middleware';
import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Request, Response, NextFunction } from 'express';

describe('FakeAuthMiddleware', () => {
  let middleware: FakeAuthMiddleware;
  let mockDataSource: Partial<DataSource>;

  beforeEach(() => {
    mockDataSource = {
      getRepository: jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null), // Simulate user not found
      }),
    };

    middleware = new FakeAuthMiddleware(mockDataSource as DataSource);
  });

  it('should return 401 if user is not found', async () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    await middleware.use(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'User not found. Create user with id = 1.',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
