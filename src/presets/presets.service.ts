import { Injectable } from '@nestjs/common';
import { CreatePresetDto } from './dto/create-preset.dto';
import { UpdatePresetDto } from './dto/update-preset.dto';

@Injectable()
export class PresetsService {
  create(createPresetDto: CreatePresetDto) {
    return 'This action adds a new preset';
  }

  findAll() {
    return `This action returns all presets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} preset`;
  }

  update(id: number, updatePresetDto: UpdatePresetDto) {
    return `This action updates a #${id} preset`;
  }

  remove(id: number) {
    return `This action removes a #${id} preset`;
  }
}
