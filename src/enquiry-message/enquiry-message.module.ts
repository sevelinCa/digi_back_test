import { Module } from '@nestjs/common';
import { EnquiryMessageService } from './enquiry-message.service';
import { EnquiryMessageController } from './enquiry-message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { EnquiriesTable } from './entities/enquiries.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
 imports: [
    TypeOrmModule.forFeature([
      EnquiriesTable,
      DigifranchiseOwner,
      UserEntity,
    ]),
    MailModule, // Move MailModule outside of TypeOrmModule.forFeature
 ],
 providers: [EnquiryMessageService],
 controllers: [EnquiryMessageController]
})
export class EnquiryMessageModule {}