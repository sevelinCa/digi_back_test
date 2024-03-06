import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from 'src/users/domain/user';

@ApiTags('Uploads')
@Controller({
  path: 'files',
  version: '1',
})
export class FilesController {
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
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
      destination: './uploads/identificationDocs',
      filename: (req, file, callback) => {
        const userId = (req.user as User).id;
        callback(null, `${userId}_id${extname(file.originalname)}`);
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
    return {
      filename: file.filename,
      filePath: file.path,
    }
  }
}
