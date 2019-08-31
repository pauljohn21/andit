import { UserEntity } from './user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessagesDto } from '../dtos/messages.dto';
@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({
    type: 'text',
  })
  text: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToOne(type => UserEntity, user => user.messages)
  user: UserEntity;

  toResponseObject(): MessagesDto {
    const { id, text, createdAt, updatedAt } = this;
    const responseObject: MessagesDto = {
      id,
      text,
      createdAt,
      updatedAt,
    };
    if (this.user) {
      responseObject.user = this.user;
    }
    return responseObject;
  }
}
