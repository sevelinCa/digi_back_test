// import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
// import { RolesGuard } from 'src/roles/roles.guard';
// import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
// import { CreateInventoryDto } from './dto/create-inventory.dto';
// import { UpdateInventoryDto } from './dto/update-inventory.dto';
// import { Inventory } from './entities/inventory.entity';
// import { InventoryService } from './inventory.service';
// import { Request } from 'express';
// import { UUID } from 'crypto';
// import { UpdateInventoryEntriesDto } from './dto/update-inventory-entries.dto';
// import { InventoryEntries } from './entities/inventory-entries.entity';
// @ApiTags('Inventory')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'), RolesGuard)
// @Controller({ path: 'inventory', version: '1' })

// export class InventoryController {
//     constructor(private readonly inventoryService: InventoryService) { }

//     @ApiOperation({
//         summary: 'CREATE - Record Inventory Item for Digifranchise',
//     })
//     @Post()
//     async create(
//         @Body() createInventoryDto: CreateInventoryDto,
//         @Query('franchiseId') franchiseId: string
//     ) {
//         return this.inventoryService.createInventoryItem(
//             createInventoryDto,
//             franchiseId,
//         );
//     }

    // @ApiOperation({
    //     summary: 'GET ALL - Retrieve all inventory items',
    // })
    // @ApiQuery({
    //     name: 'startDate',
    //     required: false,
    //     description: 'Filter inventory items starting from this date',
    // })
    // @ApiQuery({
    //     name: 'endDate',
    //     required: false,
    //     description: 'Filter inventory items ending until this date',
    // })
    // @Get()
    // async findAll(
    //     @Query('startDate') startDate?: string,
    //     @Query('endDate') endDate?: string,
    // ): Promise<{ inventoryItems: Inventory[]; count: number }> {
    //     return this.inventoryService.findAllInventoryItems(startDate, endDate);
    // }


    // @ApiOperation({
    //     summary: 'GET ALL - Retrieve all inventory items',
    // })
    // @Get()
    // async findAllInventoryByDigifranchiseId(
    //     @Query('digifranchiseId') digifranchiseId: string
    // ) {
    //     return this.inventoryService.findInventoryByDigifranchiseId(digifranchiseId)
    // }



    // @ApiOperation({
    //     summary: 'GET ONE - Retrieve Inventory Item by ID',
    // })
    // @Get(':id')
    // async getInventoryById(
    //     @Param('id') inventoryId: string,
    // ): Promise<Inventory | null> {
    //     return this.inventoryService.findInventoryById(inventoryId);
    // }

    // @ApiOperation({
    //     summary: 'UPDATE - Update a specific inventory item',
    // })
    // @Patch(':id')
    // async update(
    //     @Param('id') inventoryId: string,
    //     @Body() updateInventoryDto: UpdateInventoryDto,
    // ): Promise<Inventory> {
    //     return this.inventoryService.updateInventoryItem(
    //         inventoryId,
    //         updateInventoryDto,
    //     );
    // }



    // @ApiOperation({
    //     summary: 'UPDATE - Update a specific inventory item entry',
    // })
    // @Patch('/entry/:entryId')
    // async updateEntries(
    //     @Param('entryId') entryId: string,
    //     @Body() updateInventoryEntriesDto: UpdateInventoryEntriesDto,
    // ): Promise<InventoryEntries> {
    //     return this.inventoryService.updateInventoryItemEntries(
    //         entryId,
    //         updateInventoryEntriesDto,
    //     );
    // }



    // @ApiOperation({
    //     summary: 'DELETE - Delete a specific inventory item',
    // })
    // @Delete(':id')
    // async delete(@Param('id') inventoryId: string): Promise<void> {
    //     return this.inventoryService.deleteInventoryItem(inventoryId);
    // }


// }
