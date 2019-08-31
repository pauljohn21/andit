import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { RoleEntity } from './role.entity';
import { MessageEntity } from './message.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { environment } from '../../environment/environment';
import { UserDto } from '../dtos/user.dto';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({
    type: 'text',
  })
  firstName: string;
  @Column({
    type: 'text',
  })
  lastName: string;
  @Column({
    type: 'text',
  })
  @Column({
    type: 'text',
    unique: true,
  })
  username: string;
  @IsEmail()
  email: string;
  @Column('text')
  @Length(7, 100)
  password: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToOne(type => RoleEntity, role => role.users)
  role: RoleEntity;
  @OneToMany(type => MessageEntity, messages => messages.user, {
    cascade: true,
  })
  messages: MessageEntity[];

  @BeforeInsert()
  async hashPassword() {
    const salt = bcrypt.genSaltSync(environment.saltOrRounds);
    this.password = await bcrypt.hashSync(this.password, salt);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return bcrypt.compareSync(attempt, this.password);
  }

  toResponseObject(showToken: boolean = true): UserDto {
    const {
      id,
      firstName,
      lastName,
      username,
      email,
      createdAt,
      updatedAt,
      token,
    } = this;
    const responseObject: UserDto = {
      id,
      firstName,
      lastName,
      username,
      email,
      createdAt,
      updatedAt,
    };
    if (this.messages) {
      responseObject.messages = this.messages;
    }
    if (this.role) {
      responseObject.role = this.role;
    }
    if (showToken) {
      responseObject.token = token;
    }
    return responseObject;
  }

  private get token(): string {
    const { id, username, role } = this;
    return jwt.sign(
      {
        id,
        username,
        roleName: role.name,
      },
      environment.secret,
      { expiresIn: environment.expiresIn },
    );
  }
}
