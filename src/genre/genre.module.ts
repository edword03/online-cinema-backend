import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { GenreModel } from './genre.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: GenreModel,
        schemaOptions: {
          collection: 'Genres',
        },
      },
    ]),
  ],
  providers: [GenreService],
  controllers: [GenreController],
})
export class GenreModule {}
