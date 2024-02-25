// import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
// import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
// import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
// import { Repository } from 'typeorm';
// import { AssetMgtService } from './asset-mgt.service';
// import { CreateAssetDto } from './dto/create-asset.dto';
// import { UpdateAssetDto } from './dto/update-asset.dto';
// import { Asset } from './entities/asset.entity';
// import { getDigifranchiseByUserId } from 'src/helper/FindByFunctions';
// import { Request } from 'express';
// import { AuthGuard } from '@nestjs/passport';
// import { RolesGuard } from 'src/roles/roles.guard';

// @ApiTags('Asset')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'), RolesGuard)
// @Controller({ path: 'asset', version: '1' })
// export class AssetMgtController {
//     constructor(
//         private readonly assetMgtService: AssetMgtService,
//         @InjectRepository(Digifranchise)
//         private readonly digifranchiseRepository: Repository<Digifranchise>,
//     ) { }

//     @ApiOperation({
//         summary: 'CREATE - Record Asset for User',
//     })
//     @Post()
//     async create(@Req() req: Request, @Body() createAssetDto: CreateAssetDto) {
//         const userId = (req.user as UserEntity).id;
//         const franchiseAccount = await getDigifranchiseByUserId(
//             this.digifranchiseRepository,
//             userId,
//         );

//         if (!franchiseAccount) {
//             throw new NotFoundException(
//                 `Franchise account not found for user with ID ${userId}`,
//             );
//         }

//         return this.assetMgtService.createAsset(createAssetDto, userId);
//     }
//     @ApiOperation({
//         summary: 'GET ALL - Retrieve all assets',
//     })
//     @ApiQuery({
//         name: 'startDate',
//         required: false,
//         description: 'Filter assets starting from this date',
//     })
//     @ApiQuery({
//         name: 'endDate',
//         required: false,
//         description: 'Filter assets ending until this date',
//     })
//     @Get()
//     async findAll(
//         @Query('startDate') startDate?: string,
//         @Query('endDate') endDate?: string,
//     ): Promise<{ assets: Asset[]; count: number }> {
//         return this.assetMgtService.findAllAssets(startDate, endDate);
//     }

//     @ApiOperation({
//         summary: 'GET ONE - Retrieve Asset by ID',
//     })
//     @Get(':id')
//     async getAssetById(@Param('id') assetId: string): Promise<Asset | null> {
//         return this.assetMgtService.getAssetById(assetId);
//     }

//     @ApiOperation({
//         summary: 'UPDATE - Update a specific asset',
//     })
//     @Patch(':id')
//     async update(
//         @Param('id') assetId: string,
//         @Body() updateAssetDto: UpdateAssetDto,
//     ): Promise<Asset> {
//         return this.assetMgtService.updateAsset(assetId, updateAssetDto);
//     }

//     @ApiOperation({
//         summary: 'DELETE - Delete a specific asset',
//     })
//     @Delete(':id')
//     async delete(@Param('id') assetId: string): Promise<void> {
//         return this.assetMgtService.deleteAsset(assetId);
//     }

// }
