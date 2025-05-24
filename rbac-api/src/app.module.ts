import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrgsModule } from './orgs/orgs.module';
import { Organization } from './orgs/org.entity';
import { User } from './users/user.entity';
import { RecordsModule } from './records/records.module';
import { PatientRecord } from './records/patient-record.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'rbac.sqlite',
      entities: [User, Organization, PatientRecord],
      synchronize: true,
    }),
    UsersModule,
    OrgsModule,
    RecordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
