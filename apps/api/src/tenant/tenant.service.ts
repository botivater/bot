import { Tenant } from '@common/common/tenant/tenant.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantService {
  private readonly logger = new Logger(TenantService.name);

  /**
   *
   */
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  create(createTenantDto: CreateTenantDto) {
    const tenant = this.tenantRepository.create(createTenantDto);
    return this.tenantRepository.save(tenant);
  }

  findAll(options?: FindManyOptions<Tenant>) {
    return this.tenantRepository.find(options);
  }

  findOne(options: FindOneOptions<Tenant>) {
    return this.tenantRepository.findOne(options);
  }

  update(id: number, updateTenantDto: UpdateTenantDto) {
    return this.tenantRepository.update({ id }, updateTenantDto);
  }

  remove(id: number) {
    return this.tenantRepository.delete({ id });
  }
}
