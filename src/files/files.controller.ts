import { BadRequestException, ConflictException, Controller, Post, Delete, Param, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from 'src/users/domain/user';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { FilesService } from './files.service';

@ApiTags('Uploads')
@Controller({
  path: 'files',
  version: '1',
})
export class FilesController {
  constructor(
    private readonly fileService: FilesService,
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
  ) {}
  
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/profile/id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/profile/ids',
      filename: (req, file, callback) => {
        const userId = (req.user as User).id;
        callback(null, `${userId}_profile_id${extname(file.originalname)}`);
      }
    }),
    limits: {
      fileSize: 1024 * 1024 * 2,
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(pdf|jpeg|jpg|png)$/)) {
        return callback(new BadRequestException('Unsupported file type'), false);
      }
      callback(null, true);
    },
  }))
  async uploadIdDocument(@UploadedFile() file: Express.Multer.File) {
    const fileExists = await this.filesRepository.findOne({ where: { filename: file.filename }})

    if (!fileExists) {
      const newFile = this.filesRepository.create({
        filename: file.filename,
        filePath: file.path
      })
      const savedFile = await this.filesRepository.save(newFile)
      return savedFile
    } else {
      throw new ConflictException('file already exits')
    }

  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/profile/pic')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/profile/pic',
      filename: (req, file, callback) => {
        const userId = (req.user as User).id;
        callback(null, `${userId}_profile_pic${extname(file.originalname)}`);
      }
    }),
    limits: {
      fileSize: 1024 * 1024 * 2,
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(pdf|jpeg|jpg|png)$/)) {
        return callback(new BadRequestException('Unsupported file type'), false);
      }
      callback(null, true);
    },
  }))
  async uploadProfilePic(@UploadedFile() file: Express.Multer.File) {
    const fileExists = await this.filesRepository.findOne({ where: { filename: file.filename }})

    if (!fileExists) {
      const newFile = this.filesRepository.create({
        filename: file.filename,
        filePath: file.path
      })
      const savedFile = await this.filesRepository.save(newFile)
      return savedFile
    } else {
      throw new ConflictException('file already exits')
    }

  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/profile/police-clearence')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/profile/police-clearence',
      filename: (req, file, callback) => {
        const userId = (req.user as User).id;
        callback(null, `${userId}_police-clearence${extname(file.originalname)}`);
      }
    }),
    limits: {
      fileSize: 1024 * 1024 * 2,
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(pdf|jpeg|jpg|png)$/)) {
        return callback(new BadRequestException('Unsupported file type'), false);
      }
      callback(null, true);
    },
  }))
  async uploadPoliceClearence(@UploadedFile() file: Express.Multer.File) {
    const fileExists = await this.filesRepository.findOne({ where: { filename: file.filename }})

    if (!fileExists) {
      const newFile = this.filesRepository.create({
        filename: file.filename,
        filePath: file.path
      })
      const savedFile = await this.filesRepository.save(newFile)
      return savedFile
    } else {
      throw new ConflictException('file already exits')
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/profile/qualifications')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/profile/qualifications',
      filename: (req, file, callback) => {
        const userId = (req.user as User).id;
        callback(null, `${userId}_qualifications_${file.originalname}${extname(file.originalname)}`);
      }
    }),
    limits: {
      fileSize: 1024 * 1024 * 2,
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(pdf|jpeg|jpg|png)$/)) {
        return callback(new BadRequestException('Unsupported file type'), false);
      }
      callback(null, true);
    },
  }))
  async uploadQualifications(@UploadedFile() file: Express.Multer.File) {
    const fileExists = await this.filesRepository.findOne({ where: { filename: file.filename }})
    
    if (!fileExists) {
      const newFile = this.filesRepository.create({
        filename: file.filename,
        filePath: file.path
      })
      const savedFile = await this.filesRepository.save(newFile)
      return savedFile
    } else {
      throw new ConflictException('file already exits')
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/profile/professional-body')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/profile/professional-body',
      filename: (req, file, callback) => {
        const userId = (req.user as User).id;
        callback(null, `${userId}_professional-body${extname(file.originalname)}`);
      }
    }),
    limits: {
      fileSize: 1024 * 1024 * 2,
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(pdf|jpeg|jpg|png)$/)) {
        return callback(new BadRequestException('Unsupported file type'), false);
      }
      callback(null, true);
    },
  }))
  async uploadProfessionalBodyMemberships(@UploadedFile() file: Express.Multer.File) {

    const fileExists = await this.filesRepository.findOne({ where: { filename: file.filename }})
    
    if (!fileExists) {
      const newFile = this.filesRepository.create({
        filename: file.filename,
        filePath: file.path
      })
      const savedFile = await this.filesRepository.save(newFile)
      return savedFile
    } else {
      throw new ConflictException('file already exits')
    }
  }


  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/digfranchise/complaince')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/digifranchise/compliance',
      filename: (req, file, callback) => {
        const { ownedDigifranchiseId } = req.query
        callback(null, `${ownedDigifranchiseId}_compliance_${file.originalname}`);
      }
    }),
    limits: {
      fileSize: 1024 * 1024 * 2,
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(pdf|jpeg|jpg|png)$/)) {
        return callback(new BadRequestException('Unsupported file type'), false);
      }
      callback(null, true);
    },
  }))
  async uploadDigifranchiseComplianceDocs(@Query('ownedDigifranchiseId') ownedDigifranchiseId: string ,@UploadedFile() file: Express.Multer.File) {

    const fileExists = await this.filesRepository.findOne({ where: { filename: file.filename }})
    
    if (!fileExists) {
      const newFile = this.filesRepository.create({
        filename: file.filename,
        filePath: file.path
      })
      const savedFile = await this.filesRepository.save(newFile)
      return savedFile
    } else {
      throw new ConflictException('file already exits')
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/digfranchise/professional-body')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/digifranchise/professional-body',
      filename: (req, file, callback) => {
        const { ownedDigifranchiseId } = req.query
        callback(null, `${ownedDigifranchiseId}_professional-body_${file.originalname}`);
      }
    }),
    limits: {
      fileSize: 1024 * 1024 * 2,
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(pdf|jpeg|jpg|png)$/)) {
        return callback(new BadRequestException('Unsupported file type'), false);
      }
      callback(null, true);
    },
  }))
  async uploadDigifranchiseProfessionalBody(@Query('ownedDigifranchiseId') ownedDigifranchiseId: string, @UploadedFile() file: Express.Multer.File) {

    const fileExists = await this.filesRepository.findOne({ where: { filename: file.filename }})
    
    if (!fileExists) {
      const newFile = this.filesRepository.create({
        filename: file.filename,
        filePath: file.path
      })
      const savedFile = await this.filesRepository.save(newFile)
      return savedFile
    } else {
      throw new ConflictException('file already exits')
    }
  }

  @Delete(':filename')
  async deletePicture(@Param('filename') filename: string): Promise<void> {
    await this.fileService.deletePicture(filename);
  }
}
