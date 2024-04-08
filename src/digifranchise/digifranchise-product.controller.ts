import { Body, Controller, Post, Req, UseGuards, NotFoundException, Get, HttpCode, HttpStatus, Param, Delete, Put, Query, HttpException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Request } from 'express';
import { DigifranchiseProduct } from './entities/digifranchise-product.entity';
import { ProductService } from './product.service';
import { CreateDigifranchiseSubProductDto, UpdateDigifranchiseSubProductDto } from './dto/create-digifranchise-SubProduct.dto';
import { DigifranchiseSubProduct } from './entities/digifranchise-sub-product.entity';

@ApiTags('Digifranchise Product')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'digifranchise-product', version: '1' })
export class DigifranchiseProductController {
  constructor(
    private readonly productService: ProductService,
  ) { }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'GET ALL - Retrieve all Digifranchise products  by Digifranchise ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All Digifranchise products  by the specified Digifranchise ID have been successfully retrieved.' })
  @Get('get-products/:digifranchiseId')
  @HttpCode(HttpStatus.OK)
  async findAllProductByDigifranchiseId(@Param('digifranchiseId') digifranchiseId: string): Promise<DigifranchiseProduct[]> {
    return this.productService.findAllProductByDigifranchiseId(digifranchiseId);
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'GET ALL - Retrieve all Digifranchise products  by Digifranchise ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All Digifranchise products  by the specified Digifranchise ID have been successfully retrieved.' })
  @Get('get-all-products-with-subs/:digifranchiseId/:digifranchiseOwnerId')
  @HttpCode(HttpStatus.OK)
  async getProductsAndSubProductsById(
    @Param('digifranchiseId') digifranchiseId: string,
    @Param('digifranchiseOwnerId') digifranchiseOwnerId: string,
  ): Promise<DigifranchiseProduct[]> {
    return this.productService.getProductsAndSubProductsById(digifranchiseId, digifranchiseOwnerId);
  }


  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'CREATE - Create Sub Product' })
  @ApiResponse({ status: HttpStatus.OK, description: 'You have created sub product.' })
  @ApiBody({ type: CreateDigifranchiseSubProductDto })
  @Post('create-sub-product/:productId/:digifranchiseOwnerId')
  @HttpCode(HttpStatus.OK)
  async createSubDigifranchiseProduct(
    @Body() createDigifranchiseSubProductDto: CreateDigifranchiseSubProductDto,
    @Req() req: Request,
    @Param('productId') productId: string,
    @Param('digifranchiseOwnerId') digifranchiseOwnerId: string,
  ): Promise<DigifranchiseSubProduct> {
    const userId = (req.user as UserEntity).id;

    return this.productService.createSubDigifranchiseProduct(createDigifranchiseSubProductDto, userId, productId, digifranchiseOwnerId);
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'GET ALL - Retrieve all Sub products' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All Sub products  have been successfully retrieved.' })
  @Get('get-all-sub-products')
  @HttpCode(HttpStatus.OK)
  async getAllSubProduct(@Req() req: Request): Promise<DigifranchiseSubProduct[]> {
    const userId = (req.user as UserEntity).id;
    return this.productService.getAllSubProduct(userId);
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'GET ONE - Retrieve a Sub product by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sub product  has been successfully retrieved.' })
  @Get('get-sub-product/:id')
  @HttpCode(HttpStatus.OK)
  async getOneSubProductById(@Req() req: Request, @Param('id') id: string): Promise<DigifranchiseSubProduct> {
    const userId = (req.user as UserEntity).id;
    return this.productService.getOneSubProductById(userId, id);
  }

  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'UPDATE - Update a sub product  by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sub product has been successfully updated.' })
  @ApiBody({ type: UpdateDigifranchiseSubProductDto })
  @Put('update-sub-product/:id')
  @HttpCode(HttpStatus.OK)
  async updateSubProduct(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateDigifranchiseSubProductDto: UpdateDigifranchiseSubProductDto,
  ): Promise<DigifranchiseSubProduct> {
    const userId = (req.user as UserEntity).id;
    return this.productService.updateSubProduct(userId, id, updateDigifranchiseSubProductDto);
  }


  @Roles(RoleEnum.digifranchise_super_admin)
  @ApiOperation({ summary: 'DELETE - Delete a Sub product  by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sub product has been successfully deleted.' })
  @Delete('delete-sub-product/:id')
  @HttpCode(HttpStatus.OK)
  async deleteSubProduct(@Req() req: Request, @Param('id') id: string): Promise<void> {
    const userId = (req.user as UserEntity).id;
    return this.productService.deleteSubProduct(userId, id);
  }

}
