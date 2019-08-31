import { UserEntity } from '../entities/user.entity';

export class RoleDto {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  users?: UserEntity[];
}
