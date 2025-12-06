import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAddressesController } from './customer-addresses.controller';
import { CustomerAddressesService } from './customer-addresses.service';

describe('CustomerAddressesController', () => {
  let controller: CustomerAddressesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerAddressesController],
      providers: [CustomerAddressesService],
    }).compile();

    controller = module.get<CustomerAddressesController>(CustomerAddressesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
