import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '../entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async findAll(page: number = 1) {
    const roles = await this.roleRepository.find();
    return roles.map(role => role.toResponseObject());
  }

  async findOneById(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
    });
    return role.toResponseObject();
  }

  async createRole(name: string) {
    let role = await this.roleRepository.findOne({
      where: [{ name }],
    });
    if (role) {
      throw new HttpException('Role already exists', HttpStatus.BAD_REQUEST);
    }
    role = await this.roleRepository.create({ name });
    await this.roleRepository.save(role);
    return role.toResponseObject();
  }

  async updateRole(id: string) {
    let role = await this.roleRepository.findOne({
      where: { id },
    });
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    await this.roleRepository.update({ id }, { name });
    role = await this.roleRepository.findOne({
      where: { id },
    });
    return role.toResponseObject();
  }
  async deleteRole(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
    });
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    await this.roleRepository.remove(role);
    return !role.id;
  }
}
