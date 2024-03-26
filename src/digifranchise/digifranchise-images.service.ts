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

    async createImage(digifranchiseServiceId: string, digifranchiseProductId: string, createDigifranchiseGalleryImageDto: CreateDigifranchiseGalleryImageDto): Promise<DigifranchiseGalleryImage> {
        const existingProduct = await this.digifranchiseProductRepository.findOne({ where: { id: Equal(digifranchiseProductId) } });
        if (!existingProduct) {
            throw new Error('Digifranchise product not exist');
        }

        const existingService = await this.digifranchiseServiceOfferedRepository.findOne({ where: { id: Equal(digifranchiseServiceId) } });
        if (!existingService) {
            throw new Error('Digifranchise service  not exist');
        }
        const newDigifranchiseImage = this.digifranchiseImageshipRepository.create({
            ...createDigifranchiseGalleryImageDto,
            digifranchiseProductId: existingProduct,
            digifranchiseServiceId: existingService,
        });

        return this.digifranchiseImageshipRepository.save(newDigifranchiseImage);
    }

}