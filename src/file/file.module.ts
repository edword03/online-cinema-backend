import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';
import { FileModel } from './file.model';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/uploads',
    }),
    TypegooseModule.forFeature([
      {
        typegooseClass: FileModel,
        schemaOptions: {
          collection: 'files',
        },
      },
    ]),
  ],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
