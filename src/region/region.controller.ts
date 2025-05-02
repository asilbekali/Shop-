import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleDec } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/user/enum/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';

@UseGuards(AuthGuard)
@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto);
  }

  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit per page (default: 10)',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Region name to search (optional)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    enum: ['asc', 'desc'],
    description: 'Sort order (default: asc)',
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('name') name: string = '',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    return this.regionService.findAll({
      page,
      limit,
      name,
      sortOrder,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(+id);
  }

  @RoleDec(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionService.update(+id, updateRegionDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regionService.remove(+id);
  }
}
