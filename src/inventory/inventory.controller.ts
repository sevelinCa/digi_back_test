import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import type { User } from 'src/users/domain/user';
import type { CreateInventoryDto } from './dto/create-inventory.dto';
import type { UpdateInventoryDto } from './dto/update-inventory.dto';
import type { Inventory } from './entities/inventory.entity';
import type { InventoryService } from './inventory.service';
import { Request } from 'express';

@ApiTags('Inventories')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'inventory', version: '1' })
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) { }

    @ApiOperation({
        summary: 'CREATE - Record Inventory Item for User',
    })
    @Post()
    async create(
        @Req() req: Request,
        @Body() createInventoryDto: CreateInventoryDto,
    ) {
        const userId = (req.user as User).id;
        return this.inventoryService.createInventoryItem(
            createInventoryDto,
            userId,
        );
    }

    @ApiOperation({
        summary: 'GET ALL - Retrieve all inventory items',
    })
    @ApiQuery({
        name: 'startDate',
        required: false,
        description: 'Filter inventory items starting from this date',
    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        description: 'Filter inventory items ending until this date',
    })
    @Get()
    async findAll(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ): Promise<{ inventoryItems: Inventory[]; count: number }> {
        return this.inventoryService.findAllInventoryItems(startDate, endDate);
    }

    @ApiOperation({
        summary: 'GET ONE - Retrieve Inventory Item by ID',
    })
    @Get(':id')
    async getInventoryById(
        @Param('id') inventoryId: string,
    ): Promise<Inventory | null> {
        return this.inventoryService.findInventoryById(inventoryId);
    }

    @ApiOperation({
        summary: 'UPDATE - Update a specific inventory item',
    })
    @Patch(':id')
    async update(
        @Param('id') inventoryId: string,
        @Body() updateInventoryDto: UpdateInventoryDto,
    ): Promise<Inventory> {
        return this.inventoryService.updateInventoryItem(
            inventoryId,
            updateInventoryDto,
        );
    }

    @ApiOperation({
        summary: 'DELETE - Delete a specific inventory item',
    })
    @Delete(':id')
    async delete(@Param('id') inventoryId: string): Promise<void> {
        return this.inventoryService.deleteInventoryItem(inventoryId);
    }


}
