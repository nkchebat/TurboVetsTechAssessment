import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../src/users/user.entity';

describe('RBAC E2E (POST /records)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a patient record for an existing user and org', async () => {
    // Step 1: Confirm user with ID = 1 exists and has organization
    const userRepo = dataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: 1 },
      relations: ['organization'],
    });

    if (!user || !user.organization) {
      throw new Error('Test setup failed: user or organization missing');
    }

    // Step 2: POST /records to create a new record
    const response = await request(app.getHttpServer())
      .post('/records')
      .send({
        name: 'Test Patient',
        diagnosis: 'Anxiety',
        owner: user.id,
        organization: user.organization.id,
      })
      .expect(201);

    // Step 3: Verify response
    expect(response.body.name).toEqual('Test Patient');
    expect(response.body.diagnosis).toEqual('Anxiety');
    expect(response.body.organization.id).toEqual(user.organization.id);
    expect(response.body.owner.id).toEqual(user.id);
  });
});
