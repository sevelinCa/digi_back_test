import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
  ) {}
  async deletePicture(filename: string): Promise<void> {
    const getFilePath = await this.filesRepository.findOne({ where: { filename }})
  
    
    try {
      if (!getFilePath) {
        throw new NotFoundException('File not found')
      }
      if (fs.existsSync(getFilePath.filePath)) {
        fs.unlinkSync(getFilePath.filePath);
        await this.filesRepository.delete(getFilePath.id)
      } else {
        throw new NotFoundException('File not found');
      }
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }
}
