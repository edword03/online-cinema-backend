import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { FileResponse } from './file.interface';

@Injectable()
export class FileService {
  async saveFiles(
    files: Express.Multer.File[],
    folder: string = 'default',
  ): Promise<FileResponse[]> {
    const uploadsFolder = `${path}/uploads/${folder}`;

    await ensureDir(uploadsFolder);
    const response: FileResponse[] = await Promise.all(
      files.map(async (file) => {
        await writeFile(`${uploadsFolder}/${file.originalname}`, file.buffer);
        return {
          url: `uploads/${folder}/${file.originalname}`,
          name: file.originalname,
        };
      }),
    );
    return response;
  }
}
