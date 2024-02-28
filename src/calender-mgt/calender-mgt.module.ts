import { Module } from '@nestjs/common';
import { CalenderMgtService } from './calender-mgt.service';
import { CalenderMgtController } from './calender-mgt.controller';

@Module({
  providers: [CalenderMgtService],
  controllers: [CalenderMgtController]
})
export class CalenderMgtModule {}
