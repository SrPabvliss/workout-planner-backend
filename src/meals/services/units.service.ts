import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Not, Repository } from 'typeorm'
import { Unit, UnitType } from '../entities/units.entity'
import { ResponseService } from 'src/shared/response-format/response.service'
import { CreateUnitDto } from '../dto/create-unit.dto'
import { UpdateUnitDto } from '../dto/update-unit.dto'
import UNIT_MESSAGES from '../messages/unit-messages'

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitsRepository: Repository<Unit>,
    private readonly responseService: ResponseService,
  ) {}

  async create(createUnitDto: CreateUnitDto) {
    const existing = await this.unitsRepository.findOne({
      where: { symbol: createUnitDto.symbol },
    })

    if (existing) {
      return this.responseService.error(UNIT_MESSAGES.ALREADY_EXISTS)
    }

    const unit = this.unitsRepository.create(createUnitDto)
    const savedUnit = await this.unitsRepository.save(unit)

    return this.responseService.success(savedUnit, UNIT_MESSAGES.CREATED)
  }

  async findAll() {
    const units = await this.unitsRepository.find({
      where: { is_active: true },
      order: {
        type: 'ASC',
        name: 'ASC',
      },
    })

    if (!units?.length) {
      return this.responseService.error(UNIT_MESSAGES.MANY_NOT_FOUND)
    }

    return this.responseService.success(units, UNIT_MESSAGES.FOUND_MANY)
  }

  async findByType(type: string) {
    if (!Object.values(UnitType).includes(type as UnitType)) {
      return this.responseService.error(UNIT_MESSAGES.INVALID_TYPE)
    }

    const units = await this.unitsRepository.find({
      where: {
        type: type as UnitType,
        is_active: true,
      },
      order: {
        name: 'ASC',
      },
    })

    if (!units?.length) {
      return this.responseService.error(UNIT_MESSAGES.MANY_NOT_FOUND)
    }

    return this.responseService.success(units, UNIT_MESSAGES.FOUND_MANY)
  }

  async findOne(id: number) {
    const unit = await this.unitsRepository.findOne({
      where: { id, is_active: true },
    })

    if (!unit) {
      return this.responseService.error(UNIT_MESSAGES.NOT_FOUND)
    }

    return this.responseService.success(unit, UNIT_MESSAGES.FOUND)
  }

  async update(id: number, updateUnitDto: UpdateUnitDto) {
    const unit = await this.findOne(id)

    if (!unit) return

    if (updateUnitDto.symbol) {
      const existing = await this.unitsRepository.findOne({
        where: {
          symbol: updateUnitDto.symbol,
          id: Not(id),
        },
      })

      if (existing) {
        return this.responseService.error(UNIT_MESSAGES.ALREADY_EXISTS)
      }
    }

    const updated = await this.unitsRepository.save({
      ...unit.data,
      ...updateUnitDto,
    })

    return this.responseService.success(updated, UNIT_MESSAGES.UPDATED)
  }

  async remove(id: number) {
    const unit = await this.findOne(id)

    if (!unit) return

    unit.data.is_active = false
    await this.unitsRepository.save(unit.data)

    return this.responseService.success(unit.data, UNIT_MESSAGES.DELETED)
  }

  async validateUnits(unitIds: number[]): Promise<boolean> {
    const units = await this.unitsRepository.count({
      where: {
        id: In(unitIds),
        is_active: true,
      },
    })

    return units === unitIds.length
  }

  async getCompatibleUnits(unitType: UnitType) {
    const units = await this.unitsRepository.find({
      where: {
        type: unitType,
        is_active: true,
      },
      order: {
        name: 'ASC',
      },
    })

    return this.responseService.success(units, UNIT_MESSAGES.FOUND_MANY)
  }
}
