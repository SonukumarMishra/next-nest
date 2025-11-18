import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findAllSimple() {
     return this.roleRepository.find();
   }

  async findAll(dto: { page: number; pageSize: number; search?: string }) {
  const { page, pageSize, search } = dto;

  const skip = (page - 1) * pageSize;

  const where: any = {};

  if (search && search.trim() !== "") {
    where.name = ILike(`%${search}%`);
  }

  const [data, total] = await this.roleRepository.findAndCount({
    where,
    order: { id: "DESC" },
    skip,
    take: pageSize,
  });

  return {
    data,
    total,
    page,
    pageSize,
  };
}

  async changeStatus(id: number, status: number) {
    return this.roleRepository.update(id, { status });
  }

  async findOne(id: number) {
    return this.roleRepository.findOneBy({ id });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.roleRepository.update(id, updateRoleDto);
  }

  async remove(id: number) {
    return this.roleRepository.delete(id);
  }
}
