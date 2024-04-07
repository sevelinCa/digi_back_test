import { Injectable, NotFoundException } from '@nestjs/common';
import { DigifranchiseProduct } from './entities/digifranchise-product.entity';
import { DigifranchiseSubProduct } from './entities/digifranchise-sub-product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Repository, Equal, IsNull } from 'typeorm';
import { UpdateDigifranchiseProductDto } from './dto/create-digifranchise-product.dto';
import { DigifranchiseOwner } from './entities/digifranchise-ownership.entity';
import { Digifranchise } from './entities/digifranchise.entity';
import { CreateDigifranchiseSubProductDto, UpdateDigifranchiseSubProductDto } from './dto/create-digifranchise-SubProduct.dto';
import { DigifranchiseGalleryImage } from './entities/digifranchise-gallery-images.entity';
import { DigifranchiseSelectProductOrServiceTable } from './entities/digifranchise-select-product-service.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(DigifranchiseOwner)
    private franchiseOwnershipRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(Digifranchise)
    private digifranchiseRepository: Repository<Digifranchise>,
    @InjectRepository(DigifranchiseProduct)
    private readonly digifranchiseProductRepository: Repository<DigifranchiseProduct>,
    @InjectRepository(DigifranchiseSubProduct)
    private readonly digifranchiseSubProductRepository: Repository<DigifranchiseSubProduct>,
    @InjectRepository(DigifranchiseSelectProductOrServiceTable)
    private readonly digifranchiseSelectItemRepository: Repository<DigifranchiseSelectProductOrServiceTable>,
    @InjectRepository(DigifranchiseGalleryImage)
    private digifranchiseGalleryImageRepository: Repository<DigifranchiseGalleryImage>,
    @InjectRepository(DigifranchiseOwner)
    private digifranchiseOwnershipRepository: Repository<DigifranchiseOwner>,


  ) { }

  async findAllProductByDigifranchiseId(digifranchiseId: string): Promise<DigifranchiseProduct[]> {
    return await this.digifranchiseProductRepository.find({
      where: {
        digifranchiseId: Equal(digifranchiseId),
        userId: IsNull(),
      },
      relations: ['digifranchiseId', 'userId', 'productGalleryImages'],
    });
  }

  async getProductsAndSubProductsById(digifranchiseId: string, digifranchiseOwnerId: string): Promise<any> {
    const owedFranchise = await this.digifranchiseOwnershipRepository.findOne({ where: { id: digifranchiseOwnerId } });
    if (!owedFranchise) {
      throw new Error('Owned digifranchise does not exist');
    }

    const parentDigifranchise = await this.digifranchiseRepository.findOne({ where: { id: digifranchiseId } });
    if (!parentDigifranchise) {
      throw new Error('Digifranchise does not exist');
    }

    const productsOffered = await this.digifranchiseProductRepository.find({
      where: {
        digifranchiseId: Equal(parentDigifranchise.id),
        userId: IsNull(),
      },
      relations: ['digifranchiseId'],
    });

    const productsWithSubProducts = await Promise.all(productsOffered.map(async (product) => {
      const subProducts = await this.digifranchiseSubProductRepository.find({
        where: {
          digifranchiseProductId: Equal(product.id),
        },
      });

      const productGalleryImages = await this.digifranchiseGalleryImageRepository.find({
        where: {
          digifranchiseProductId: Equal(product.id),
          digifranchiseOwnedId: Equal(digifranchiseOwnerId),
        },
      });

      const selectedProduct = await this.digifranchiseSelectItemRepository.find({
        where: {
          franchiseProduct: Equal(product.id),
          ownerDigifranchise: Equal(digifranchiseOwnerId),
        },
      });

      return {
        ...product,
        subProducts,
        productGalleryImages,
        selectedProduct,
      };
    }));

    return { productsWithSubProducts };
  }

  async createSubDigifranchiseProduct(
    createDigifranchiseSubProductDto: CreateDigifranchiseSubProductDto,
    userId: string,
    productId: string,
  ): Promise<DigifranchiseSubProduct> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const Service = await this.digifranchiseProductRepository.findOne({ where: { id: productId } });

    if (!Service) {
      throw new NotFoundException('Service not found');
    }

    const newDigifranchiseSubProduct = this.digifranchiseSubProductRepository.create({
      ...createDigifranchiseSubProductDto,
      userId: user,
      digifranchiseProductId: Service,
    });

    return this.digifranchiseSubProductRepository.save(newDigifranchiseSubProduct);
  }

  async getAllSubProduct(userId: string): Promise<DigifranchiseSubProduct[]> {
    return await this.digifranchiseSubProductRepository.find({ where: { userId: Equal(userId) } });
  }

  async getOneSubProductById(userId: string, id: string): Promise<DigifranchiseSubProduct> {
    const product = await this.digifranchiseSubProductRepository.findOne({ where: { id, userId: Equal(userId) } });
    if (!product) {
      throw new NotFoundException('Sub service not found');
    }
    return product;
  }

  async updateSubProduct(
    userId: string,
    id: string,
    updateDigifranchiseSubProductDto: UpdateDigifranchiseSubProductDto,
  ): Promise<DigifranchiseSubProduct> {
    const product = await this.digifranchiseSubProductRepository.findOne({ where: { id, userId: Equal(userId) } });
    if (!product) {
      throw new NotFoundException('Sub service not found');
    }

    Object.assign(product, updateDigifranchiseSubProductDto);

    try {
      return await this.digifranchiseSubProductRepository.save(product);
    } catch (error) {
      console.error('Error updating sub service:', error);
      throw error;
    }
  }

  async deleteSubProduct(userId: string, id: string): Promise<void> {
    const product = await this.digifranchiseSubProductRepository.findOne({ where: { id, userId: Equal(userId) } });
    if (!product) {
      throw new NotFoundException('Digifranchise service offered not found');
    }

    await this.digifranchiseSubProductRepository.remove(product);
  }
}
