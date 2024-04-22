import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { Repository } from 'typeorm';
import { EnquiriesTable } from './entities/enquiries.entity';
import { CreateEnquiriesTableDto } from './dto/enquiries.dto';
import { MailService } from 'src/mail/mail.service';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';


interface EnquiryEmailBody {
    from: string;
    phone: string;
    message: string;
    names: string; 
   }
@Injectable()
export class EnquiryMessageService {

    constructor(
        @InjectRepository(DigifranchiseOwner)
        private readonly digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
        @InjectRepository(EnquiriesTable)
        private readonly enquiriesRepository: Repository<EnquiriesTable>,
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>,
        private readonly mailService: MailService, 
    ) { }

    async createEquiry(createEnquiriesTableDto: CreateEnquiriesTableDto, digifranchiseOwnerId: string): Promise<EnquiriesTable> {
        const digifranchise = await this.digifranchiseOwnerRepository.findOne({ where: { id: digifranchiseOwnerId } });
        if (!digifranchise) {
            throw new HttpException('Digifranchise not exist', HttpStatus.NOT_FOUND);
        }

        const user = await this.userRepository.findOne({ where: { id: digifranchise.userId } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const subject = createEnquiriesTableDto.names;
        const body: EnquiryEmailBody = {
            from: createEnquiriesTableDto.email,
            phone: createEnquiriesTableDto.phone_number.toString(),
            message: createEnquiriesTableDto.description,
            names: createEnquiriesTableDto.names, 
        };

        if (!user.email) {
            throw new HttpException('User email not found', HttpStatus.NOT_FOUND);
        }

        await this.mailService.sendEnquiryEmail(user.email, subject, body, createEnquiriesTableDto.names, createEnquiriesTableDto.email);
        const newEquiry = this.enquiriesRepository.create({
            ...createEnquiriesTableDto,
            digifranchiseOwnerId: digifranchise,
        });
        const savedEquiry = await this.enquiriesRepository.save(newEquiry);
        return savedEquiry;
    }
}
