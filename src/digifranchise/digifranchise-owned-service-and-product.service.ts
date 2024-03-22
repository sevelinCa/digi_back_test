import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { DigifranchiseOwnedServiceOffered } from './entities/digifranchise-owned-service-offered.entity';
import { DigifranchiseOwnedProduct } from './entities/digifranchise-owned-product.entity';

@Injectable()
export class DigifranchiseOwnedServiceAndProductService {
  constructor(
    @InjectRepository(DigifranchiseOwnedServiceOffered)
    private readonly digifranchiseOwnedServiceOffered: Repository<DigifranchiseOwnedServiceOffered>,

    @InjectRepository(DigifranchiseOwnedProduct)
    private readonly digifranchiseOwnedProductRepository: Repository<DigifranchiseOwnedProduct>,

  ) { }

  async selectOwnedService(ownerdServiceId: string): Promise<DigifranchiseOwnedServiceOffered> {
    const ownedService = await this.digifranchiseOwnedServiceOffered.findOne({
      where: { id: ownerdServiceId },
    });

    if (!ownedService) {
      throw new Error('Service not found');
    }

    ownedService.isSelected = !ownedService.isSelected;

    return this.digifranchiseOwnedServiceOffered.save(ownedService);
  }

  async getAllSelectedServices(): Promise<DigifranchiseOwnedServiceOffered[]> {
    return this.digifranchiseOwnedServiceOffered.find({
      where: { isSelected: true, deleteAt: IsNull() },
    });
  }


  async getAllNotSelectedServices(): Promise<DigifranchiseOwnedServiceOffered[]> {
    return this.digifranchiseOwnedServiceOffered.find({
      where: { isSelected: false, deleteAt: IsNull() },
    });
  }

  async getAllServices(): Promise<DigifranchiseOwnedServiceOffered[]> {
    return this.digifranchiseOwnedServiceOffered.find({
      where: { deleteAt: IsNull() },
    });
 }

 async selectOwnedProduct(ownerdProductId: string): Promise<DigifranchiseOwnedProduct> {
  const ownedProduct = await this.digifranchiseOwnedProductRepository.findOne({
    where: { id: ownerdProductId },
  });

  if (!ownedProduct) {
    throw new Error('Product not found');
  }

  ownedProduct.isSelected = !ownedProduct.isSelected;

  return this.digifranchiseOwnedProductRepository.save(ownedProduct);
}
}