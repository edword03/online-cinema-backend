import { BadRequestException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { InjectModel } from 'nestjs-typegoose';
import { FileModel } from './file.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(FileModel) private readonly fileModel: ModelType<FileModel>,
    private readonly configService: ConfigService,
  ) {}

  async saveFiles(
    { buffer, size, filename, mimetype, originalname }: Express.Multer.File,
    folder?: string,
  ) {
    const s3 = new S3({
      endpoint: this.configService.get('AWS_ENDPOINT'),
    });
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: buffer,
        Key: `${folder}/${originalname}`,
        ContentType: mimetype,
      })
      .promise();

    const fileObject = {
      url: uploadResult.Key,
      name: filename,
      size: size,
    };

    const file = await this.fileModel.findOne({
      url: `${folder}/${originalname}`,
    });

    if (file) throw new BadRequestException('This file already exists');

    return await this.fileModel.create(fileObject);
  }

  async removeFile(fileName: string) {
    const file = await this.fileModel.findOne({ name: fileName });

    const s3 = new S3({
      endpoint: this.configService.get('AWS_ENDPOINT'),
    });

    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: file.name,
      })
      .promise();

    return await this.fileModel.findOneAndDelete({ url: fileName }).exec();
  }
}
