import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ManyToOne } from 'typeorm';
import { Organization } from '../orgs/org.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  role: 'Owner' | 'Admin' | 'Viewer';

  @ManyToOne(() => Organization, (org) => org.users, { nullable: true })
  organization: Organization;
}

