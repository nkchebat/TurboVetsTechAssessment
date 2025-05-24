import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { PatientRecord } from './patient-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PatientRecord])],
  providers: [RecordsService],
  controllers: [RecordsController],
})
export class RecordsModule {}
