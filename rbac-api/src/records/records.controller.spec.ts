import { Test, TestingModule } from '@nestjs/testing';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { ForbiddenException } from '@nestjs/common';

describe('RecordsController', () => {
  let controller: RecordsController;
  let mockService: Partial<RecordsService>;

  beforeEach(async () => {
    mockService = {
      findById: jest.fn(),
      update: jest.fn(),
      canAccess: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordsController],
      providers: [
        {
          provide: RecordsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<RecordsController>(RecordsController);
  });

  describe('GET /records/:id', () => {
    it('should allow an owner to view their own record', async () => {
      const user = { id: 1, role: 'Owner', organization: { id: 1 } };
      const record = { id: 1, owner: { id: 1 }, organization: { id: 1 } };

      (mockService.findById as jest.Mock).mockResolvedValue(record);
      (mockService.canAccess as jest.Mock).mockReturnValue(true);

      const result = await controller.findById(1, { user } as any);
      expect(result).toEqual(record);
    });

    it('should throw ForbiddenException if user lacks access', async () => {
      const user = { id: 2, role: 'Admin', organization: { id: 2 } };
      const record = { id: 1, owner: { id: 1 }, organization: { id: 1 } };

      (mockService.findById as jest.Mock).mockResolvedValue(record);
      (mockService.canAccess as jest.Mock).mockReturnValue(false);

      await expect(controller.findById(1, { user } as any)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('PATCH /records/:id', () => {
    it('should allow authorized user to update record', async () => {
      const user = { id: 1, role: 'Admin', organization: { id: 1 } };
      const updates = { diagnosis: 'Updated' };

      (mockService.update as jest.Mock).mockResolvedValue({
        id: 1,
        ...updates,
      });

      const result = await controller.update(1, { user } as any, updates);
      expect(result.diagnosis).toEqual('Updated');
    });

    it('should create a new patient record', async () => {
      const data = { name: 'Jane Doe', diagnosis: 'Stress' };
      const created = { id: 1, ...data };

      (mockService.create as jest.Mock).mockResolvedValue(created);

      const result = await controller.create(data);
      expect(result).toEqual(created);
    });
  });
});
