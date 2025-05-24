import { Test, TestingModule } from '@nestjs/testing';
import { OrgsService } from './orgs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Organization } from './org.entity';

describe('OrgsService', () => {
  let service: OrgsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrgsService,
        {
          provide: getRepositoryToken(Organization),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrgsService>(OrgsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
