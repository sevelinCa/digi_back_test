import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { getDigifranchiseAccountByUserId } from 'src/helper/FindByFunctions';
import type { User } from 'src/users/domain/user';
import type { Repository } from 'typeorm';
import type { AssetMgtService } from './asset-mgt.service';
import type { CreateAssetDto } from './dto/create-asset.dto';
import type { UpdateAssetDto } from './dto/update-asset.dto';
import type { Asset } from './entities/asset.entity';
import { Request } from 'express';
import { DigifranchiseAccount } from 'src/digifranchise/entities/digifranchise-account.entity';

@Controller('asset-mgt')
export class AssetMgtController {
    constructor(
        private readonly assetMgtService: AssetMgtService,
        @InjectRepository(DigifranchiseAccount)
        private readonly digifranchiseAccountRepository: Repository<DigifranchiseAccount>,
      ) {}
    
      @ApiOperation({
        summary: 'CREATE - Record Asset for User',
      })
      @Post()
      async create(@Req() req: Request, @Body() createAssetDto: CreateAssetDto) {
        const userId = (req.user as User).id;
        const franchiseAccount = await getDigifranchiseAccountByUserId(
          this.digifranchiseAccountRepository,
          userId,
        );
    
        if (!franchiseAccount) {
          throw new NotFoundException(
            `Franchise account not found for user with ID ${userId}`,
          );
        }
    
        return this.assetMgtService.createAsset(createAssetDto, userId);
      }
      @ApiOperation({
        summary: 'GET ALL - Retrieve all assets',
      })
      @ApiQuery({
        name: 'startDate',
        required: false,
        description: 'Filter assets starting from this date',
      })
      @ApiQuery({
        name: 'endDate',
        required: false,
        description: 'Filter assets ending until this date',
      })
      @Get()
      async findAll(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
      ): Promise<{ assets: Asset[]; count: number }> {
        return this.assetMgtService.findAllAssets(startDate, endDate);
      }
    
      @ApiOperation({
        summary: 'GET ONE - Retrieve Asset by ID',
      })
      @Get(':id')
      async getAssetById(@Param('id') assetId: string): Promise<Asset | null> {
        return this.assetMgtService.getAssetById(assetId);
      }
    
      @ApiOperation({
        summary: 'UPDATE - Update a specific asset',
      })
      @Patch(':id')
      async update(
        @Param('id') assetId: string,
        @Body() updateAssetDto: UpdateAssetDto,
      ): Promise<Asset> {
        return this.assetMgtService.updateAsset(assetId, updateAssetDto);
      }
    
      @ApiOperation({
        summary: 'DELETE - Delete a specific asset',
      })
      @Delete(':id')
      async delete(@Param('id') assetId: string): Promise<void> {
        return this.assetMgtService.deleteAsset(assetId);
      }
}