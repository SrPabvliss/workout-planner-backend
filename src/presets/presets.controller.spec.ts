import { Test, TestingModule } from '@nestjs/testing';
import { PresetsController } from './presets.controller';
import { PresetsService } from './presets.service';

describe('PresetsController', () => {
  let controller: PresetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresetsController],
      providers: [PresetsService],
    }).compile();

    controller = module.get<PresetsController>(PresetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
