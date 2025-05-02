import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleDec } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/user/enum/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';

@UseGuards(AuthGuard)
@ApiTags('Color')
@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @RoleDec(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorService.create(createColorDto);
  }

  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: 'Sort order',
    enum: ['asc', 'desc'],
    example: 'asc',
  })
  @ApiQuery({
    name: 'filterByName',
    required: false,
    description: 'Filter by name',
    type: String,
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
    @Query('filterByName') filterByName?: string,
  ) {
    return this.colorService.findAll(page, limit, sort, filterByName);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colorService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @RoleDec(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
    return this.colorService.update(+id, updateColorDto);
  }

  @UseGuards(AuthGuard)
  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colorService.remove(+id);
  }
}
