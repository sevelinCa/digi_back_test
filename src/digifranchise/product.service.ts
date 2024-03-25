import { Injectable, NotFoundException } from '@nestjs/common';
import { DigifranchiseProduct } from './entities/digifranchise-product.entity';
import { DigifranchiseSubProduct } from './entities/digifranchise-sub-product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { type Repository, Equal, IsNull } from 'typeorm';
import type { UpdateDigifranchiseProductDto } from './dto/create-digifranchise-product.dto';
import { DigifranchiseOwner } from './entities/digifranchise-ownership.entity';
import { Digifranchise } from './entities/digifranchise.entity';
import type { CreateDigifranchiseSubProductDto, UpdateDigifranchiseSubProductDto } from './dto/create-digifranchise-SubProduct.dto';

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
    private readonly digifranchiseSubProductRepository: Repository<DigifranchiseSubProduct>

  ) { }


  async findAllProductByDigifranchiseId(digifranchiseId: string): Promise<DigifranchiseProduct[]> {
    return await this.digifranchiseProductRepository.find({
      where: {
        digifranchiseId: Equal(digifranchiseId),
        userId: IsNull(),
      },
    });
  }


  async getProductsAndSubProductsById(digifranchiseId: string): Promise<any> {
    const productsOffered = await this.digifranchiseProductRepository.find({
      where: {
        digifranchiseId: Equal(digifranchiseId),
        userId: IsNull(),
      },
    });

    const productsWithSubProducts = await Promise.all(productsOffered.map(async (product) => {
      const subProducts = await this.digifranchiseSubProductRepository.find({
        where: {
          ownedProductId: Equal(product.id),
        },
      });

      return {
        ...product,
        subProducts,
      };
    }));

    return productsWithSubProducts;
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
      ownedProductId: Service,
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
