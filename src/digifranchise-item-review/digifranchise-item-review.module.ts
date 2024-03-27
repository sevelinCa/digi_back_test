import { Module } from '@nestjs/common';
import { DigifranchiseItemReviewService } from './digifranchise-item-review.service';
import { DigifranchiseItemReviewController } from './digifranchise-item-review.controller';

@Module({
  providers: [DigifranchiseItemReviewService],
  controllers: [DigifranchiseItemReviewController]
})
export class DigifranchiseItemReviewModule {}
