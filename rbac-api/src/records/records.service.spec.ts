import { Test, TestingModule } from '@nestjs/testing';
import { RecordsService } from './records.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PatientRecord } from './patient-record.entity';

describe('RecordsService', () => {
  let service: RecordsService;

  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordsService,
        {
          provide: getRepositoryToken(PatientRecord),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<RecordsService>(RecordsService);
  });

  describe('canAccess', () => {
    const org1 = { id: 1 };
    const org2 = { id: 2 };

    const record = {
      id: 1,
      owner: { id: 5 },
      organization: org1,
    };

    it('allows owner access', () => {
      const user = { id: 5, role: 'Owner', organization: org1 };
      expect(service.canAccess(user, record)).toBe(true);
    });

    it('allows admin in same org', () => {
      const user = { id: 2, role: 'Admin', organization: org1 };
      expect(service.canAccess(user, record)).toBe(true);
    });

    it('allows viewer in same org (read-only)', () => {
      const user = { id: 3, role: 'Viewer', organization: org1 };
      expect(service.canAccess(user, record)).toBe(true);
    });

    it('blocks user from different org', () => {
      const user = { id: 6, role: 'Admin', organization: org2 };
      expect(service.canAccess(user, record)).toBe(false);
    });

    it('blocks viewer from different org', () => {
      const user = { id: 7, role: 'Viewer', organization: org2 };
      expect(service.canAccess(user, record)).toBe(false);
    });
  });
});
