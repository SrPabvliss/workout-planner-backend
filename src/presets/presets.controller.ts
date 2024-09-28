import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PresetsService } from './presets.service';
import { CreatePresetDto } from './dto/create-preset.dto';
import { UpdatePresetDto } from './dto/update-preset.dto';

@Controller('presets')
export class PresetsController {
  constructor(private readonly presetsService: PresetsService) {}

  @Post()
  create(@Body() createPresetDto: CreatePresetDto) {
    return this.presetsService.create(createPresetDto);
  }

  @Get()
  findAll() {
    return this.presetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presetsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePresetDto: UpdatePresetDto) {
    return this.presetsService.update(+id, updatePresetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presetsService.remove(+id);
  }
}
