import { Entity, Column, PrimaryGeneratedColumn, Generated } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Generated()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  location: string;

  @Column({ default: true })
  isActive: boolean;
}
