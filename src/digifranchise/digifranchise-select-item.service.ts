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
    const existingProduct = await this.digifranchiseProductRepository.findOne({ where: { id: digifranchiseProductId } });
    if (!existingProduct) {
      throw new NotFoundException('Digifranchise product not found');
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
        franchiseProduct: Equal(digifranchiseProductId),
        userId: Equal(userId),
      },
    });

    let newSelection: DigifranchiseSelectProductOrServiceTable | undefined;
    if (!existingSelection) {
      newSelection = this.digifranchiseSelectItemRepository.create({
        ownerDigifranchise: ownedDigifranchise,
        franchiseProduct: existingProduct,
        userId: user,
        isSelected: true
      });
    } else {
      existingSelection.isSelected = !existingSelection.isSelected;
      newSelection = existingSelection;
    }

    return this.digifranchiseSelectItemRepository.save(newSelection);
  }

  async getAllSelectedServices(): Promise<DigifranchiseSelectProductOrServiceTable[]> {
    return this.digifranchiseSelectItemRepository.find({
      where: { isSelected: true, deleteAt: IsNull() },
      relations: [
        'ownerDigifranchise',
        'digifranchiseService',
        'digifranchiseService.serviceGalleryImages',
        'digifranchiseService.selectItem',
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
      'digifranchiseService.selectItem',
      'digifranchiseService.serviceCategories',
      'franchiseProduct.productGalleryImages',
    ],
  });
}


}



