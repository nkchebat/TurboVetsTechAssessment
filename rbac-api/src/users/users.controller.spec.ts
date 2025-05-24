import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let mockService: Partial<UsersService>;

  beforeEach(async () => {
    mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user', async () => {
    const data = { name: 'Bob', email: 'bob@example.com', organizationId: 1 };
    const createdUser = { id: 1, ...data };

    (mockService.create as jest.Mock).mockResolvedValue(createdUser);

    const result = await controller.create(data);
    expect(result).toEqual(createdUser);
  });
});
