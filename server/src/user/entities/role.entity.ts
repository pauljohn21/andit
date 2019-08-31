import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { RoleDto } from '../dtos/role.dto';
@Entity('role')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'text',
  })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(type => UserEntity, user => user.role)
  users: UserEntity[];

  toResponseObject(): RoleDto {
    const { id, name, createdAt, updatedAt } = this;
    const responseObject: RoleDto = {
      id,
      name,
      createdAt,
      updatedAt,
    };

    if (this.users) {
      responseObject.users = this.users;
    }

    return responseObject;
  }
}
