import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiBody, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import { DigifranchiseImagesService } from './digifranchise-images.service';
import { CreateDigifranchiseGalleryImageDto, UpdateDigifranchiseGalleryImageDto } from './dto/create-digifranchise-image.dto';
import { DigifranchiseGalleryImage } from './entities/digifranchise-gallery-images.entity';

@ApiTags('Digifranchise - Image')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'digifranchise-images', version: '1' })
export class DigifranchiseImagesController {
    constructor(private readonly digifranchiseImagesService: DigifranchiseImagesService) { }

    @ApiOperation({ summary: 'CREATE - Create a new image' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'A new image has been successfully created.' })
    @ApiBody({ type: CreateDigifranchiseGalleryImageDto })
    @Post('create-image/:digifranchiseServiceId/:digifranchiseProductId')
    async createImage(
        @Param('digifranchiseServiceId') digifranchiseServiceId: string,
        @Param('digifranchiseProductId') digifranchiseProductId: string,
        @Body() createDigifranchiseGalleryImageDto: CreateDigifranchiseGalleryImageDto,
    ): Promise<DigifranchiseGalleryImage> {
        return this.digifranchiseImagesService.createImage(digifranchiseServiceId, digifranchiseProductId, createDigifranchiseGalleryImageDto);
    }

    @ApiOperation({ summary: 'UPDATE - Update an existing image' })
    @ApiResponse({ status: HttpStatus.OK, description: 'The image has been successfully updated.' })
    @ApiBody({ type: UpdateDigifranchiseGalleryImageDto })
    @Put('update-image/:imageId')
    async updateImage(
        @Param('imageId') imageId: string,
        @Body() updateDigifranchiseGalleryImageDto: UpdateDigifranchiseGalleryImageDto,
    ): Promise<DigifranchiseGalleryImage> {
        return this.digifranchiseImagesService.updateImage(imageId, updateDigifranchiseGalleryImageDto);
    }

    @ApiOperation({ summary: 'DELETE - Delete an image' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The image has been successfully deleted.' })
    @Delete('delete-image/:imageId')
    async deleteImage(
        @Param('imageId') imageId: string,
    ): Promise<void> {
        return this.digifranchiseImagesService.deleteImage(imageId);
    }

    @ApiOperation({ summary: 'GET - Retrieve all images' })
    @ApiResponse({ status: HttpStatus.OK, description: 'All images have been successfully retrieved.' })
    @Get('get-all-images')
    async getAllImages(): Promise<DigifranchiseGalleryImage[]> {
        return this.digifranchiseImagesService.getAllImages();
    }
}
