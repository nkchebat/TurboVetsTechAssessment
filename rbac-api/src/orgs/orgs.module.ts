import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrgsService } from './orgs.service';
import { OrgsController } from './orgs.controller';
import { Organization } from './org.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  providers: [OrgsService],
  controllers: [OrgsController],
  exports: [TypeOrmModule],
})
export class OrgsModule {}
