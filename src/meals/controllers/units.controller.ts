import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { CreateUnitDto } from '../dto/create-unit.dto'
import { UpdateUnitDto } from '../dto/update-unit.dto'
import { UnitsService } from '../services/units.service'

@ApiTags('units')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @ApiOperation({ summary: 'Create a new unit' })
  @ApiResponse({
    status: 201,
    description: 'The unit has been successfully created.',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitsService.create(createUnitDto)
  }

  @ApiOperation({ summary: 'Get all units' })
  @ApiResponse({
    status: 200,
    description: 'List of all measurement units.',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.unitsService.findAll()
  }

  @ApiOperation({ summary: 'Get all units of a specific type' })
  @ApiResponse({
    status: 200,
    description: 'List of units of the specified type.',
  })
  @Get('type/:type')
  @HttpCode(HttpStatus.OK)
  findByType(@Param('type') type: string) {
    return this.unitsService.findByType(type)
  }

  @ApiOperation({ summary: 'Get a unit by id' })
  @ApiResponse({
    status: 200,
    description: 'The unit has been found.',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.unitsService.findOne(+id)
  }

  @ApiOperation({ summary: 'Update a unit' })
  @ApiResponse({
    status: 200,
    description: 'The unit has been successfully updated.',
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitsService.update(+id, updateUnitDto)
  }

  @ApiOperation({ summary: 'Delete a unit' })
  @ApiResponse({
    status: 200,
    description: 'The unit has been successfully deleted.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.unitsService.remove(+id)
  }
}
