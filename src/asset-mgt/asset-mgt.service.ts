import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { getDigifranchiseByUserId, findAssetById } from 'src/helper/FindByFunctions';
import type { Repository } from 'typeorm';
import type { CreateAssetDto } from './dto/create-asset.dto';
import type { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities/asset.entity';

@Injectable()
export class AssetMgtService {

    constructor(
        @InjectRepository(Asset)
        private readonly assetRepository: Repository<Asset>,
        @InjectRepository(Digifranchise)
        private readonly digifranchiseRepository: Repository<Digifranchise>,
    ) { }

    async createAsset(
        createAssetDto: CreateAssetDto,
        userId: string,
    ): Promise<Asset> {
        const franchiseAccount = await getDigifranchiseByUserId(
            this.digifranchiseRepository,
            userId,
        );

        if (!franchiseAccount) {
            throw new NotFoundException(
                `Franchise account not found for user with ID ${userId}`,
            );
        }

        const newAsset = this.assetRepository.create({
            ...createAssetDto,
            franchiseId: franchiseAccount,
        });

        const savedAsset = await this.assetRepository.save(newAsset);

        return savedAsset;
    }

    async findAllAssets(
        startDate?: string,
        endDate?: string,
    ): Promise<{ assets: Asset[]; count: number }> {
        const queryBuilder = this.assetRepository.createQueryBuilder('asset');

        queryBuilder.leftJoinAndSelect('asset.franchiseId', 'franchise');

        if (startDate) {
            queryBuilder.andWhere('asset.date >= :startDate', { startDate });
        }

        if (endDate) {
            queryBuilder.andWhere('asset.date <= :endDate', { endDate });
        }

        const assets = await queryBuilder.getMany();
        const count = await queryBuilder.getCount();

        return { assets, count };
    }

    async getAssetById(assetId: string): Promise<Asset | null> {
        return findAssetById(this.assetRepository, assetId);
    }

    async updateAsset(
        assetId: string,
        updateAssetDto: UpdateAssetDto,
    ): Promise<Asset> {
        const asset = await findAssetById(this.assetRepository, assetId);
        if (!asset) {
            throw new NotFoundException(`Asset not found with ID ${assetId}`);
        }

        Object.assign(asset, updateAssetDto);
        return this.assetRepository.save(asset);
    }

    async deleteAsset(assetId: string): Promise<void> {
        const result = await this.assetRepository.delete(assetId);
        if (result.affected === 0) {
            throw new NotFoundException(`Asset not found with ID ${assetId}`);
        }
    }
}
