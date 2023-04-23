import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    // Hash the password
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    return new UserEntity(
      await this.prisma.user.create({ data: createUserDto }),
    );
    // return this.prisma.user.create({ data: createUserDto });
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => new UserEntity(user));
    // return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return new UserEntity(user);
    // return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    return new UserEntity(user);
    // return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  async remove(id: number) {
    return new UserEntity(await this.prisma.user.delete({ where: { id } }));
    // return this.prisma.user.delete({ where: { id } });
  }
}
