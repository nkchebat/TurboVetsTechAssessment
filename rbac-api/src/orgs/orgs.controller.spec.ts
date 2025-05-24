import { Test, TestingModule } from '@nestjs/testing';
import { OrgsController } from './orgs.controller';
import { OrgsService } from './orgs.service';

describe('OrgsController', () => {
  let controller: OrgsController;
  let mockService: Partial<OrgsService>;

  beforeEach(async () => {
    mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgsController],
      providers: [
        {
          provide: OrgsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<OrgsController>(OrgsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll on GET /orgs', async () => {
    const fakeOrgs = [{ id: 1, name: 'Test Org' }];
    (mockService.findAll as jest.Mock).mockResolvedValue(fakeOrgs);

    const result = await controller.findAll();

    expect(mockService.findAll).toHaveBeenCalled();
    expect(result).toEqual(fakeOrgs);
  });
});
