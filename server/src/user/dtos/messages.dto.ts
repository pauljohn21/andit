import { UserEntity } from '../entities/user.entity';

export class MessagesDto {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  user?: UserEntity;
}

export class PageInfo {
  page: number;
  limit: number;
}

export class MessageConnection {
  edges: MessagesDto[];
  pageInfo: PageInfo;
}
