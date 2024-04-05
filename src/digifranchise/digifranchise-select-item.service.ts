import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Equal } from 'typeorm';
import { DigifranchiseProduct } from './entities/digifranchise-product.entity';
import { DigifranchiseServiceOffered } from './entities/digifranchise-service-offered.entity';
import { DigifranchiseSelectProductOrServiceTable } from './entities/digifranchise-select-product-service.entity';
import { DigifranchiseOwner } from './entities/digifranchise-ownership.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class DigifranchiseSelectItemService {
  constructor(
    @InjectRepository(DigifranchiseOwner)
    private ownedDigifranchisepRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(DigifranchiseServiceOffered)
    private readonly digifranchiseServiceOfferedRepository: Repository<DigifranchiseServiceOffered>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(DigifranchiseProduct)
    private digifranchiseProductRepository: Repository<DigifranchiseProduct>,
    @InjectRepository(DigifranchiseSelectProductOrServiceTable)
    private digifranchiseSelectItemRepository: Repository<DigifranchiseSelectProductOrServiceTable>,

  ) { }


  async selectOrUnselectService(digifranchiseOwnedId: string, digifranchiseServiceId: string, userId: string): Promise<DigifranchiseSelectProductOrServiceTable> {
    const existingService = await this.digifranchiseServiceOfferedRepository.findOne({ where: { id: digifranchiseServiceId } });
    if (!existingService) {
      throw new NotFoundException('Digifranchise service not found');
    }

    const ownedDigifranchise = await this.ownedDigifranchisepRepository.findOne({ where: { id: digifranchiseOwnedId } });
    if (!ownedDigifranchise) {
      throw new NotFoundException('Owned Digifranchise not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const existingSelection = await this.digifranchiseSelectItemRepository.findOne({
      where: {
        ownerDigifranchise: Equal(digifranchiseOwnedId),
        digifranchiseService: Equal(digifranchiseServiceId),
        userId: Equal(userId),
      },
    });

    let newSelection;
    if (!existingSelection) {
      newSelection = this.digifranchiseSelectItemRepository.create({
        ownerDigifranchise: ownedDigifranchise,
        digifranchiseService: existingService,
        userId: user,
        isSelected: true
      });
    } else {
      existingSelection.isSelected = !existingSelection.isSelected;
      newSelection = existingSelection;
    }

    return this.digifranchiseSelectItemRepository.save(newSelection);
  }

  async selectOrUnselectProduct(digifranchiseOwnedId: string, digifranchiseProductId: string, userId: string): Promise<DigifranchiseSelectProductOrServiceTable> {
    console.log(`Attempting to select or unselect product with ownedId: ${digifranchiseOwnedId}, productId: ${digifranchiseProductId}, userId: ${userId}`);

    // Check if the product exists
    const existingProduct = await this.digifranchiseProductRepository.findOne({ where: { id: digifranchiseProductId } });
    console.log(`Product found: ${existingProduct ? 'Yes' : 'No'}`);
    if (!existingProduct) {
      throw new NotFoundException('Digifranchise product not found');
    }

    // Check if the owned franchise exists
    const ownedDigifranchise = await this.ownedDigifranchisepRepository.findOne({ where: { id: digifranchiseOwnedId } });
    console.log(`Owned franchise found: ${ownedDigifranchise ? 'Yes' : 'No'}`);
    if (!ownedDigifranchise) {
      throw new NotFoundException('Owned Digifranchise not found');
    }

    // Check if the user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    console.log(`User found: ${user ? 'Yes' : 'No'}`);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the selection already exists
    const existingSelection = await this.digifranchiseSelectItemRepository.findOne({
      where: {
        ownerDigifranchise: Equal(digifranchiseOwnedId),
        franchiseProduct: Equal(digifranchiseProductId),
        userId: Equal(userId),
      },
    });
    console.log(`Existing selection found: ${existingSelection ? 'Yes' : 'No'}`);

    let newSelection;
    if (!existingSelection) {
      // If the selection does not exist, create a new one
      newSelection = this.digifranchiseSelectItemRepository.create({
        ownerDigifranchise: ownedDigifranchise,
        franchiseProduct: existingProduct,
        userId: user,
        isSelected: true
      });
      console.log('Creating new selection');
    } else {
      // If the selection exists, toggle the isSelected flag
      existingSelection.isSelected = !existingSelection.isSelected;
      newSelection = existingSelection;
      console.log('Toggling selection');
    }

    // Save the new or updated selection
    const savedSelection = await this.digifranchiseSelectItemRepository.save(newSelection);
    console.log('Selection saved successfully');
    return savedSelection;
}
//   async getAllSelectedServices(): Promise<DigifranchiseSelectProductOrServiceTable[]> {
//     return this.digifranchiseSelectItemRepository.find({
//       where: { isSelected: true, deleteAt: IsNull() },
//       relations: [
//         'ownerDigifranchise',
//         'digifranchiseService',
//         'digifranchiseService.serviceGalleryImages',
//         'digifranchiseService.selectedItem',
//         'digifranchiseService.serviceCategories',
//         'franchiseProduct.productGalleryImages',
//       ],
//     });
//  }

async getAllSelectedServices(userId: string): Promise<DigifranchiseSelectProductOrServiceTable[]> {
  return this.digifranchiseSelectItemRepository.find({
     where: { 
       isSelected: true, 
       deleteAt: IsNull(),
       userId: Equal(userId) 
     },
     relations: [
       'ownerDigifranchise',
       'digifranchiseService',
       'digifranchiseService.serviceGalleryImages',
       'digifranchiseService.selectedItem',
       'digifranchiseService.serviceCategories',
       'franchiseProduct.productGalleryImages',
     ],
  });
 }

 async getAllUnSelectedServices(): Promise<DigifranchiseSelectProductOrServiceTable[]> {
  return this.digifranchiseSelectItemRepository.find({
    where: { isSelected: false, deleteAt: IsNull() },
    relations: [
      'ownerDigifranchise',
      'digifranchiseService',
      'digifranchiseService.serviceGalleryImages',
      'digifranchiseService.selectedItem',
      'digifranchiseService.serviceCategories',
      'franchiseProduct.productGalleryImages',
    ],
  });
}

}



