import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { FileResponse } from './file.interface';
import { v4 } from 'uuid';
import { InjectModel } from 'nestjs-typegoose';
import { FileModel } from './file.model';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(FileModel) private readonly fileModel: ModelType<FileModel>,
  ) {}

  async saveFiles(
    files: Express.Multer.File[],
    folder = 'default',
  ): Promise<FileResponse[]> {
    const uploadsFolder = `${path}/uploads/${folder}`;

    await ensureDir(uploadsFolder);

    const response: FileResponse[] = await Promise.all(
      files.map(async (file) => {
        await writeFile(`${uploadsFolder}/${file.originalname}`, file.buffer);
        const fileObject = {
          url: `uploads/${folder}/${file.originalname}`,
          name: file.originalname,
          size: file.size,
        };

        this.fileModel.create(fileObject);

        return fileObject;
      }),
    );
    return response;
  }
}
