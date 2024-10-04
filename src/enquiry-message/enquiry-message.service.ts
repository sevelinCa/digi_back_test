import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import { Equal, Repository } from "typeorm";
import { EnquiriesTable } from "./entities/enquiries.entity";
import { CreateEnquiriesTableDto } from "./dto/enquiries.dto";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class EnquiryMessageService {
  constructor(
    @InjectRepository(DigifranchiseOwner)
    private readonly digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(EnquiriesTable)
    private readonly enquiriesRepository: Repository<EnquiriesTable>,

    @Inject(MailService)
    private readonly mailService: MailService,
  ) {}

  async createEnquiry(
    createEnquiriesTableDto: CreateEnquiriesTableDto,
    digifranchiseOwnerId: string,
  ): Promise<EnquiriesTable> {
    const digifranchise = await this.digifranchiseOwnerRepository.findOne({
      where: { id: digifranchiseOwnerId },
    });
    
    if (!digifranchise) {
      throw new HttpException("Digifranchise does not exist", HttpStatus.NOT_FOUND);
    }
  
    const newEnquiry = this.enquiriesRepository.create({
      ...createEnquiriesTableDto,
      digifranchiseOwnerId: digifranchise,
    });
    const savedEnquiry = await this.enquiriesRepository.save(newEnquiry);
  
    const franchiseOwnerEmail = await this.getEmailByDigifranchiseOwnerId(digifranchiseOwnerId);
  
    await this.mailService.sendEnquiryConfirmationEmail({
      to: createEnquiriesTableDto.email, 
      franchiseOwnerEmail,
      customerName: createEnquiriesTableDto.names
    });
  
    return savedEnquiry;
  }
  

  async getEmailByDigifranchiseOwnerId(digifranchiseOwnerId: string): Promise<string> {
    const owner = await this.digifranchiseOwnerRepository.findOne({
      where: { id: digifranchiseOwnerId },  
      select: ['userEmail'],  
    });
  
    if (!owner) {
      throw new Error(`No owner found with ID: ${digifranchiseOwnerId}`);
    }
  
    return owner.userEmail;
  }
  
  
  async getAllEnquiriesByOwner(
    ownedFranchiseId: string,
  ): Promise<EnquiriesTable[]> {
    const owned = await this.digifranchiseOwnerRepository.findOne({
      where: { id: ownedFranchiseId },
    });
    if (!owned) {
      throw new HttpException("Owner not found", HttpStatus.NOT_FOUND);
    }
    return await this.enquiriesRepository.find({
      where: { digifranchiseOwnerId: Equal(owned.id) },
    });
  }

  async getEnquiryById(enquiryId: string): Promise<EnquiriesTable> {
    const enquiry = await this.enquiriesRepository.findOne({
      where: { id: enquiryId },
    });
    if (!enquiry) {
      throw new HttpException("Enquiry not found", HttpStatus.NOT_FOUND);
    }
    return enquiry;
  }
}
