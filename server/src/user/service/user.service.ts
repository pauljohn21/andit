import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { RoleEntity } from '../entities/role.entity';
import {
  CreateUpdateUserDto,
  SignInUserDto,
  SignUpUserDto,
  UserDto,
} from '../dtos/user.dto';
import { JwtPayload } from '../utils/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async findAll(page: number = 1, limit: number = 20, newest: boolean = true) {
    const users = await this.userRepository.find({
      relations: ['role', 'messages'],
      take: limit,
      skip: limit * (page - 1),
      order: newest && { updatedAt: 'DESC' },
    });
    return users.map(user => user.toResponseObject(false));
  }

  async findONeById(id: string) {
    const user = await this.userRepository.findOne({
      relations: ['role', 'messages'],
      where: { id },
    });
    return user.toResponseObject(false);
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    return this.findONeById(payload.id);
  }

  async read(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['role', 'messages'],
    });
    return user.toResponseObject(false);
  }

  async signIn(data: SignInUserDto) {
    const { login, password } = data;
    const user = await this.userRepository.findOne({
      where: [{ username: login }, { email: login }],
      relations: ['role'],
    });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.toResponseObject();
  }

  async signUp(data: SignUpUserDto) {
    const { username, email } = data;
    let user = await this.userRepository.findOne({
      where: [{ username }, { email }],
      relations: ['role'],
    });
    if (user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }

    const role = await this.roleRepository.findOne({
      name: 'USER',
    });
    user = await this.userRepository.create({ ...data, role });
    await this.userRepository.save(user);
    return user.toResponseObject();
  }

  async createUser(data: CreateUpdateUserDto) {
    const { username, email, roleName } = data;
    let user = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const role = roleName
      ? await this.roleRepository.findOne({
          name: roleName,
        })
      : await this.roleRepository.findOne({
          name: 'USER',
        });
    // TODO generate random password
    const password = '12345678';
    data.password = password;

    delete data.roleName;

    user = await this.userRepository.create({ ...data, role });
    await this.userRepository.save(user);
    return user.toResponseObject();
  }

  async updateUser(data: CreateUpdateUserDto) {
    const { id, roleName } = data;
    let user = await this.userRepository.findOne({
      where: { id },
    });
    const role = await this.roleRepository.findOne({
      name: roleName,
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    delete data.roleName;
    delete data.id;

    await this.userRepository.update({ id }, { ...data, role });
    user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'messages'],
    });
    return user.toResponseObject();
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const deleteUser = await this.userRepository.remove(user);
    return !deleteUser.id;
  }
}
