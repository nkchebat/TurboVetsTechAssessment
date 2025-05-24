import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Organization } from '../orgs/org.entity';

@Entity()
export class PatientRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  diagnosis: string;

  @ManyToOne(() => User)
  owner: User;

  @ManyToOne(() => Organization)
  organization: Organization;
}
