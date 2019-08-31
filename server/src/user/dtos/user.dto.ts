import { RoleEntity } from '../entities/role.entity';
import { MessageEntity } from '../entities/message.entity';
import { IsNotEmpty, Length } from 'class-validator';

export class UserDto {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  token?: string;
  role?: RoleEntity;
  messages?: MessageEntity[];
}

export class SignUpUserDto {
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  username: string;
  @Length(7, 100)
  password: string;
}

export class SignInUserDto {
  @IsNotEmpty()
  login: string;
  @Length(7, 100)
  password: string;
}

export class CreateUpdateUserDto {
  id?: string;
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastanme: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  username: string;

  password?: string;

  roleName?: string;
}

export class CreateUser {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public username: string,
    public createAt: Date,
  ) {}
}

export class Token {
  token: string;
}
