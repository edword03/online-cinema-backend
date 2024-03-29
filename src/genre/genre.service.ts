import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';

import { MovieService } from 'src/movie/movie.service';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Collections } from './genre.interface';
import { GenreModel } from './genre.model';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>,
    private readonly MovieService: MovieService,
  ) {}

  async getAllGenres(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          {
            name: new RegExp(searchTerm, 'i'),
          },
          {
            slug: new RegExp(searchTerm, 'i'),
          },
          {
            description: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return this.GenreModel.find(options)
      .select('-updatedAt, -__v')
      .sort({
        createdAt: 'desc',
      })
      .exec();
  }

  async getGenreBySlug(slug: string) {
    const genre = await this.GenreModel.findOne({ slug }).exec();

    if (!genre) throw new NotFoundException('Slug is not found');

    return genre;
  }

  async getCollections() {
    const genres = await this.getAllGenres();

    const collections = await Promise.all(
      genres.map(async (genre) => {
        const moviesByGenre = await this.MovieService.getMoviesByGenres([
          genre._id,
        ]);

        const result: Collections = {
          _id: String(genre._id),
          image: moviesByGenre[0]?.bigPoster,
          slug: genre.slug,
          title: genre.name,
        };

        return result;
      }),
    );

    return collections;
  }

  // admin

  async getGenreById(_id: string) {
    const genre = await this.GenreModel.findById(_id);

    if (!genre) throw new NotFoundException('Genre is not found');

    return genre;
  }

  async createNewGenre() {
    const defaultFileds: UpdateGenreDto = {
      name: '',
      slug: '',
      description: '',
      icon: '',
    };

    const genre = await this.GenreModel.create(defaultFileds);

    return genre._id;
  }

  async updateDoc(_id: string, dto: UpdateGenreDto) {
    const updateDoc = await this.GenreModel.findByIdAndUpdate(_id, dto, {
      new: true,
    }).exec();

    if (!updateDoc) throw new NotFoundException('Genre not found');

    return updateDoc;
  }

  async deleteGenre(id: string) {
    const deleteDoc = await this.GenreModel.findByIdAndDelete(id).exec();

    if (!deleteDoc) throw new NotFoundException('Genre not found');

    return deleteDoc;
  }
}
