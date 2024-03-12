import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import path from 'path';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
  ) { }
  async deleteFile(filename: string): Promise<void> {
    const getFilePath = await this.filesRepository.findOne({ where: { filename } })

    if (!getFilePath) {
      throw new NotFoundException('File not found')
    }

    try {
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
