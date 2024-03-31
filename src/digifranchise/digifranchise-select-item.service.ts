import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository, IsNull } from 'typeorm';
import { DigifranchiseProduct } from './entities/digifranchise-product.entity';
import { DigifranchiseServiceOffered } from './entities/digifranchise-service-offered.entity';
import { DigifranchiseSelectProductOrServiceTable } from './entities/digifranchise-select-product-service.entity';

@Injectable()
export class DigifranchiseSelectItemService {
    constructor(
        @InjectRepository(DigifranchiseServiceOffered)
        private readonly digifranchiseServiceOfferedRepository: Repository<DigifranchiseServiceOffered>,
        @InjectRepository(DigifranchiseProduct)
        private digifranchiseProductRepository: Repository<DigifranchiseProduct>,

        @InjectRepository(DigifranchiseSelectProductOrServiceTable)
        private digifranchiseSelectItemRepository: Repository<DigifranchiseSelectProductOrServiceTable>,
    
      ) { }
    
    //   async selectOwnedService(ownerdServiceId: string): Promise<DigifranchiseSelectProductOrServiceTable> {
    //     const existingService = await this.digifranchiseServiceOfferedRepository.findOne({ where: { id: Equal(digifranchiseServiceId) } });
    //     if (!existingService) {
    //         throw new Error('Digifranchise service  not exist');
    //     }
        
        
    //     const ownedService = await this.digifranchiseSelectItemRepository.findOne({
    //       where: { id: ownerdServiceId },
    //     });
    
    //     if (!ownedService) {
    //       throw new Error('Service not found');
    //     }
    
    //     ownedService.isSelected = !ownedService.isSelected;
    
    //     return this.digifranchiseSelectItemRepository.save(ownedService);
    //   }
    
      async getAllSelectedServices(): Promise<DigifranchiseSelectProductOrServiceTable[]> {
        return this.digifranchiseSelectItemRepository.find({
          where: { isSelected: true, deleteAt: IsNull() },
        });
      }
    
    
      async getAllNotSelectedServices(): Promise<DigifranchiseSelectProductOrServiceTable[]> {
        return this.digifranchiseSelectItemRepository.find({
          where: { isSelected: false, deleteAt: IsNull() },
        });
      }
    
      async getAllServices(): Promise<DigifranchiseSelectProductOrServiceTable[]> {
        return this.digifranchiseSelectItemRepository.find({
          where: { deleteAt: IsNull() },
        });
      }
    
    //   async selectOwnedProduct(ownerdProductId: string): Promise<DigifranchiseSelectProductOrServiceTable> {
    //     const existingProduct = await this.digifranchiseProductRepository.findOne({ where: { id: Equal(digifranchiseProductId) } });
    //     if (!existingProduct) {
    //         throw new Error('Digifranchise product not exist');
    //     }
    
    //     ownedProduct.isSelected = !ownedProduct.isSelected;
    
    //     return this.digifranchiseSelectItemRepository.save(ownedProduct);
    //   }
    
      async getAllSelectedProducts(): Promise<DigifranchiseSelectProductOrServiceTable[]> {
        return this.digifranchiseSelectItemRepository.find({
          where: { isSelected: true, deleteAt: IsNull() },
        });
      }
    
      async getAllNotSelectedProducts(): Promise<DigifranchiseSelectProductOrServiceTable[]> {
        return this.digifranchiseSelectItemRepository.find({
          where: { isSelected: false, deleteAt: IsNull() },
        });
      }
    
      async getAllProducts(): Promise<DigifranchiseSelectProductOrServiceTable[]> {
        return this.digifranchiseSelectItemRepository.find({
          where: { deleteAt: IsNull() },
        });
      }
}
