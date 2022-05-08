import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieModel } from './movie.model';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(MovieModel) private readonly movieModel: ModelType<MovieModel>,
  ) {}

  getAllMovies(searchTerm: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          {
            title: new RegExp(searchTerm, 'i'),
          },
          {
            description: new RegExp(searchTerm, 'i'),
          },
          {
            slug: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return this.movieModel
      .find(options)
      .select('-updatedAt, -__v')
      .sort({
        createdAt: 'desc',
      })
      .populate('actors genres')
      .exec();
  }

  async updateCountViews(slug: string) {
    const updateDoc = await this.movieModel
      .findOneAndUpdate(
        { slug },
        {
          $inc: { countViews: 1 },
        },
        {
          new: true,
        },
      )
      .exec();

    if (!updateDoc) throw new NotFoundException('Movie not found');
    return updateDoc;
  }

  async getMovieBySlug(slug: string) {
    const movie = await this.movieModel
      .findOne({ slug })
      .populate('actors genres')
      .exec();

    if (!movie) throw new NotFoundException('Movie is not found');

    return movie;
  }

  async getMoviesByActors(actorId: Types.ObjectId) {
    const movie = await this.movieModel.find({ actors: actorId }).exec();

    if (!movie) throw new NotFoundException('Movies is not found');

    return movie;
  }

  async getMoviesByGenres(genresIds: Types.ObjectId[]) {
    const movies = await this.movieModel
      .find({ genres: { $in: genresIds } })
      .exec();

    if (!movies) throw new NotFoundException('Movies is not found');

    return movies;
  }

  async getMostPopular() {
    return await this.movieModel
      .find({ countViews: { $gt: 0 } })
      .sort({ countViews: -1 })
      .populate('genres')
      .exec();
  }

  // admin
  async createMovie() {
    const defaultFileds: UpdateMovieDto = {
      title: '',
      poster: '',
      bigPoster: '',
      description: '',
      slug: '',
      videoUrl: '',
      genres: [],
      actors: [],
    };

    const movie = await this.movieModel.create(defaultFileds);

    return movie._id;
  }

  async getMovieById(_id: string) {
    const movie = await this.movieModel.findById(_id);

    if (!movie) throw new NotFoundException('Movie is not found');

    return movie;
  }

  async updateDoc(_id: string, dto: UpdateMovieDto) {
    const updateDoc = await this.movieModel
      .findByIdAndUpdate(_id, dto, {
        new: true,
      })
      .exec();

    if (!updateDoc) throw new NotFoundException('Genre not found');

    return updateDoc;
  }

  async deleteMovie(id: string) {
    const deleteDoc = await this.movieModel.findByIdAndDelete(id).exec();

    if (!deleteDoc) throw new NotFoundException('Genre not found');

    return deleteDoc;
  }
}
