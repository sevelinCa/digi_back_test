// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
// import { In, type Repository } from 'typeorm';
// import { Inventory } from './entities/inventory.entity';
// import { getDigifranchiseByUserId, findInventoryById } from 'src/helper/FindByFunctions';
// import type { CreateInventoryDto } from './dto/create-inventory.dto';
// import type { UpdateInventoryDto } from './dto/update-inventory.dto';
// import { InventoryEntries } from './entities/inventory-entries.entity';
// import { UUID } from 'crypto';
// import { UpdateInventoryEntriesDto } from './dto/update-inventory-entries.dto';

// @Injectable()
// export class InventoryService {
//   constructor(
//     @InjectRepository(Inventory)
//     private readonly inventoryRepository: Repository<Inventory>,
//     @InjectRepository(InventoryEntries)
//     private readonly inventoryEntriesRepository: Repository<InventoryEntries>,
//     @InjectRepository(Digifranchise)
//     private readonly digifranchiseRepository: Repository<Digifranchise>,
//   ) { }

  // async createInventoryItem(
  //   createInventoryDto: CreateInventoryDto,
  //   digifranchiseId: string,
  // ): Promise<Inventory> {
  //   // const totalValue =
  //   //   createInventoryDto.entries.qu * createInventoryDto.costPerItem;

  //   // createInventoryDto.totalValue = totalValue;
  //   const entriesWithTotalValue = createInventoryDto.entries.map(entry => (
  //     { ...entry, totalValue: entry.quantity * entry.costPerItem }
  //   ))

  //   console.log("*******",digifranchiseId)

  //   const franchiseAcc = await this.digifranchiseRepository.findOne({ where: { id: digifranchiseId }})
  //   console.log(franchiseAcc)
  //   if (!franchiseAcc) {
  //     throw new NotFoundException(
  //       `digifranchise account not found`,
  //     );
  //   }

  //   const calculateEntryTotalValue = entriesWithTotalValue.map((entry) => {
  //     console.log(entry)
  //     return this.inventoryEntriesRepository.create(entry)
  //   }
  //   )
    
  //   console.log(">>>>>>>>", calculateEntryTotalValue)
  
  //   // const newEntry = this.inventoryEntriesRepository.create(calculateEntryTotalValue)

  //   const newInventoryItem = this.inventoryRepository.create({
  //     ...createInventoryDto,
  //     // entries: newEntries,
  //     franchiseId: digifranchiseId
  //   });
  //   const savedInventoryItem = await this.inventoryRepository.save(
  //     newInventoryItem,
  //   );
  //   return savedInventoryItem;
  // }
//   async createInventoryItem(createInventoryDto: CreateInventoryDto, digifranchiseId: string): Promise<Inventory> {
//     const entriesWithTotalValue = createInventoryDto.entries.map(entry => (
//       { ...entry, totalValue: entry.quantity * entry.costPerItem }
//     ));
  
//     const franchiseAcc = await this.digifranchiseRepository.findOne({ where: { id: digifranchiseId }});
//     if (!franchiseAcc) {
//       throw new NotFoundException(`digifranchise account not found`);
//     }
  
//     const newInventoryItem = this.inventoryRepository.create({
//       ...createInventoryDto,
//       franchiseId: digifranchiseId
//     });
//     const savedInventoryItem = await this.inventoryRepository.save(newInventoryItem);
  
//     const entryInstances = entriesWithTotalValue.map(entry => ({
//       ...entry,
//       inventoryId: savedInventoryItem.id,
//     }));
  
//     await this.inventoryEntriesRepository.save(entryInstances);
  
//     return savedInventoryItem;
//   }
  

//   async findAllInventoryItems(
//     startDate?: string,
//     endDate?: string,
//   ): Promise<{
//     inventoryItems: Inventory[];
//     count: number;
//   }> {
//     const queryBuilder = this.inventoryRepository.createQueryBuilder('inventory');

//     queryBuilder.leftJoinAndSelect('inventory.franchiseId', 'franchise');

//     queryBuilder.where('inventory.deleteAt IS NULL');

//     if (startDate) {
//       queryBuilder.andWhere('inventory.date >= :startDate', { startDate });
//     }

//     if (endDate) {
//       queryBuilder.andWhere('inventory.date <= :endDate', { endDate });
//     }

//     const inventoryItems = await queryBuilder.getMany();
//     const count = await queryBuilder.getCount();

//     return { inventoryItems, count };
//   }


//   async findInventoryByDigifranchiseId(digifranchiseId: string): Promise<Inventory[] | null> {
//     const inventoryItems = await this.inventoryRepository.find({
//         where: { franchiseId: digifranchiseId }
//     });

//     if (inventoryItems.length === 0) {
//         return [];
//     }

//     const inventoryIds = inventoryItems.map(item => item.id);
//     const entries = await this.inventoryEntriesRepository.find({
//         where: { inventoryId: In(inventoryIds) }
//     });

//     const itemsWithEntries = inventoryItems.map(item => ({
//         ...item,
//         entries: entries.filter(entry => entry.inventoryId === item.id)
//     }));

//     return itemsWithEntries;
// }


//   async findInventoryById(inventoryId: string): Promise<Inventory | null> {
//     return findInventoryById(this.inventoryRepository, inventoryId);
//   }

//   async updateInventoryItem(
//     inventoryId: string,
//     updateInventoryDto: UpdateInventoryDto,
//   ): Promise<Inventory> {
//     const inventoryItem = await findInventoryById(
//       this.inventoryRepository,
//       inventoryId,
//     );
//     if (!inventoryItem) {
//       throw new NotFoundException(
//         `Inventory item not found with ID ${inventoryId}`,
//       );
//     }


//     Object.assign(inventoryItem, updateInventoryDto);
//     return this.inventoryRepository.save(inventoryItem);
//   }

//   async updateInventoryItemEntries(
//     entryId: string,
//     updateInventoryEntriesDto: UpdateInventoryEntriesDto,
//   ): Promise<InventoryEntries> {

//     const Entry = await this.inventoryEntriesRepository.findOne({
//       where: { id: entryId },
//     });

//     if (!Entry) {
//       throw new NotFoundException(
//         `Entry not found with ID ${entryId}`,
//       );
//     }

//     const updatedEntry = {
//       quantity: Entry.quantity,
//       costPerItem: Entry.costPerItem,
//       dateReceived: Entry.dateReceived,
//       totalValue: Entry.totalValue,
//     };


//     if (updateInventoryEntriesDto.quantity !== undefined && updateInventoryEntriesDto.quantity !== Entry.quantity) {
//       updatedEntry.quantity = updateInventoryEntriesDto.quantity;
//     }
    
//     if (updateInventoryEntriesDto.costPerItem !== undefined && updateInventoryEntriesDto.costPerItem !== Entry.costPerItem) {
//       updatedEntry.costPerItem = updateInventoryEntriesDto.costPerItem;
//     }

//     if (updateInventoryEntriesDto.dateReceived !== undefined && updateInventoryEntriesDto.dateReceived !== Entry.dateReceived) {
//       updatedEntry.dateReceived = updateInventoryEntriesDto.dateReceived;
//     }

//     updatedEntry.totalValue = updatedEntry.quantity * updatedEntry.costPerItem;


//     Object.assign(Entry, updatedEntry);

//     return this.inventoryEntriesRepository.save(Entry);
//   }



  // async updateInventoryItemEntries(
  //   entryId: string,
  //   updateInventoryEntriesDto: UpdateInventoryEntriesDto,
  // ): Promise<Inventory> {
  //   const Entry = await this.inventoryEntriesRepository.findOne({
  //     where: { id: entryId },
  //   });
  
  //   if (!Entry) {
  //     throw new NotFoundException(`Entry not found with ID ${entryId}`);
  //   }
  
  //   const updatedEntry = { ...updateInventoryEntriesDto, totalValue: 0 };
  
  //   if (updateInventoryEntriesDto?.quantity !== Entry.quantity) {
  //     updatedEntry.quantity = updateInventoryEntriesDto.quantity;
  //   } 
  //   if (updateInventoryEntriesDto.quantity === undefined) {
  //     updatedEntry.quantity = Entry.quantity
  //   }
    
  //   if (updateInventoryEntriesDto.costPerItem !== Entry.costPerItem) {
  //     updatedEntry.costPerItem = updateInventoryEntriesDto.costPerItem;
  //   }
  //   if (updateInventoryEntriesDto.costPerItem === undefined) {
  //     updatedEntry.costPerItem = Entry.costPerItem
  //   }

  //   if (updateInventoryEntriesDto.dateReceived !== Entry.dateReceived) {
  //     updatedEntry.dateReceived = updateInventoryEntriesDto.dateReceived;
  //   }
  //   if (updateInventoryEntriesDto.dateReceived === undefined) {
  //     updatedEntry.dateReceived = Entry.dateReceived
  //   }
  
  //   updatedEntry.totalValue = updatedEntry.quantity * updatedEntry.costPerItem;
  
  //   // Assuming you have a method to update the entry in the repository
  //   await this.inventoryEntriesRepository.update(entryId, updatedEntry);
  
  //   // Assuming you need to return the updated inventory item
  //   // You might need to adjust this part based on your actual logic
  //   return this.inventoryRepository.findOne(entryId);
  // }

  // async deleteInventoryItem(inventoryId: string): Promise<void> {
  //   const inventoryItem = await findInventoryById(this.inventoryRepository, inventoryId);
  //   if (!inventoryItem) {
  //     throw new NotFoundException(`Inventory item not found with ID ${inventoryId}`);
  //   }

  //   inventoryItem.deleteAt = new Date();

  //   await this.inventoryRepository.save(inventoryItem);
  // }
// }
