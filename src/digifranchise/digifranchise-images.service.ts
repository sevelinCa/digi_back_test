import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal, IsNull } from 'typeorm';
import { CreateDigifranchiseGalleryImageDto, type UpdateDigifranchiseGalleryImageDto } from './dto/create-digifranchise-image.dto';
import { DigifranchiseGalleryImage } from './entities/digifranchise-gallery-images.entity';
import { DigifranchiseProduct } from './entities/digifranchise-product.entity';
import { DigifranchiseServiceOffered } from './entities/digifranchise-service-offered.entity';

@Injectable()
export class DigifranchiseImagesService {
    constructor(
        @InjectRepository(DigifranchiseServiceOffered)
        private readonly digifranchiseServiceOfferedRepository: Repository<DigifranchiseServiceOffered>,
        @InjectRepository(DigifranchiseProduct)
        private digifranchiseProductRepository: Repository<DigifranchiseProduct>,
        @InjectRepository(DigifranchiseGalleryImage)
        private digifranchiseImageshipRepository: Repository<DigifranchiseGalleryImage>,
    ) { }

    async createDigifrachiseServiceImage(digifranchiseServiceId: string,createDigifranchiseGalleryImageDto: CreateDigifranchiseGalleryImageDto): Promise<DigifranchiseGalleryImage> {

        const existingService = await this.digifranchiseServiceOfferedRepository.findOne({ where: { id: Equal(digifranchiseServiceId) } });
        if (!existingService) {
            throw new Error('Digifranchise service  not exist');
        }
        const newDigifranchiseImage = this.digifranchiseImageshipRepository.create({
            ...createDigifranchiseGalleryImageDto,
            digifranchiseServiceId: existingService,
        });

        return this.digifranchiseImageshipRepository.save(newDigifranchiseImage);
    }

    async createDigifrachiseProductImage(digifranchiseProductId: string, createDigifranchiseGalleryImageDto: CreateDigifranchiseGalleryImageDto): Promise<DigifranchiseGalleryImage> {
        const existingProduct = await this.digifranchiseProductRepository.findOne({ where: { id: Equal(digifranchiseProductId) } });
        if (!existingProduct) {
            throw new Error('Digifranchise product not exist');
        }
        const newDigifranchiseImage = this.digifranchiseImageshipRepository.create({
            ...createDigifranchiseGalleryImageDto,
            digifranchiseProductId: existingProduct,
        });

        return this.digifranchiseImageshipRepository.save(newDigifranchiseImage);
    }

    async updateImage(imageId: string, updateDigifranchiseGalleryImageDto: UpdateDigifranchiseGalleryImageDto): Promise<DigifranchiseGalleryImage> {
        const existingImage = await this.digifranchiseImageshipRepository.findOne({ where: { id: imageId } });
        if (!existingImage) {
            throw new Error('Image not found');
        }

        const updatedImage = this.digifranchiseImageshipRepository.create({
            ...existingImage,
            ...updateDigifranchiseGalleryImageDto,
        });

        return this.digifranchiseImageshipRepository.save(updatedImage);
    }

    async deleteImage(imageId: string): Promise<void> {
        const existingImage = await this.digifranchiseImageshipRepository.findOne({ where: { id: imageId } });
        if (!existingImage) {
            throw new Error('Image not found');
        }
        await this.digifranchiseImageshipRepository.delete(imageId);
    }
    async getAllImages(): Promise<DigifranchiseGalleryImage[]> {
        return this.digifranchiseImageshipRepository.find({ where: { deleteAt: IsNull() } });
    }
}