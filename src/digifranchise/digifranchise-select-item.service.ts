import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { DigifranchiseProduct } from './entities/digifranchise-product.entity';
import { DigifranchiseServiceOffered } from './entities/digifranchise-service-offered.entity';
import { DigifranchiseSelectProductOrServiceTable } from './entities/digifranchise-select-product-service.entity';
import { DigifranchiseOwner } from './entities/digifranchise-ownership.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class DigifranchiseSelectItemService {
  constructor(
    @InjectRepository(DigifranchiseServiceOffered)
    private readonly digifranchiseServiceOfferedRepository: Repository<DigifranchiseServiceOffered>,
    @InjectRepository(DigifranchiseOwner)
    private ownedDigifranchiseRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(DigifranchiseSelectProductOrServiceTable)
    private digifranchiseSelectItemRepository: Repository<DigifranchiseSelectProductOrServiceTable>,

  ) { }


  async selectOrUnselectService(ownerDigifranchise: string, digifranchiseService: string, userId: string): Promise<DigifranchiseSelectProductOrServiceTable> {

    const existingService = await this.digifranchiseServiceOfferedRepository.findOne({ where: { id: digifranchiseService } });
    
    console.log(' ====> SERVICE ID ' + JSON.stringify(existingService))

    if (!existingService) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
     }

    const ownedDigifranchise = await this.ownedDigifranchiseRepository.findOne({ where: { id: ownerDigifranchise } });
   
    console.log(' ====> OWNED DIGIFRANCHISE ' + JSON.stringify(ownedDigifranchise))
   
    if (!ownedDigifranchise) {
      throw new HttpException('Digifranchise service not exist', HttpStatus.NOT_FOUND);
    }


    const user = await this.userRepository.findOne({ where: { id: userId } });
    console.log(' ====> USER ' + JSON.stringify(user))
    if (!user) {
      throw new Error('User not exist');
    }

    let existingSelection = await this.digifranchiseSelectItemRepository.findOne({
      where: {
        ownerDigifranchise: ownedDigifranchise,
        digifranchiseService: existingService,
        deleteAt: IsNull()
      }
    });

    if (existingSelection) {
      existingSelection.isSelected = !existingSelection.isSelected;
      const updatedSelection = await this.digifranchiseSelectItemRepository.save(existingSelection);
      return updatedSelection;
    } else {
      const newSelection = this.digifranchiseSelectItemRepository.create({
        ownerDigifranchise: ownedDigifranchise,
        digifranchiseService: existingService,
        userId: user,
        isSelected: true,
      });
      const savedSelection = await this.digifranchiseSelectItemRepository.save(newSelection);
      return savedSelection;
    }
  }


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
