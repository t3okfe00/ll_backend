import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  async findAll(@Query() paginationQuery) {
    const { limit, offset } = paginationQuery;
    console.log(limit);
    console.log(offset);
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      console.log('typeof', typeof id);
      throw new HttpException('No such user', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('body', createUserDto);
    return createUserDto;
  }
}
