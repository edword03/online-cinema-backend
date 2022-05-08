import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { Types } from 'mongoose';

import { MovieService } from 'src/movie/movie.service';
import { RatingModel } from './rating.model';
import { SetRatingDto } from './dto/set-rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(RatingModel)
    private readonly RatingModel: ModelType<RatingModel>,
    private readonly MovieService: MovieService,
  ) {}

  async getMovieValueByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
    return this.RatingModel.findOne({ movie: movieId, user: userId })
      .select('value')
      .exec()
      .then((data) => (data ? data.value : 0));
  }

  async averageRating(movieId: Types.ObjectId | string) {
    const ratingMovie: RatingModel[] = await this.RatingModel.aggregate()
      .match({
        movie: new Types.ObjectId(movieId),
      })
      .exec();

    return (
      ratingMovie.reduce((acc, item) => {
        console.log(acc, item.value);
        return acc + item.value;
      }, 0) / ratingMovie.length
    );
  }

  async setRating(userId: Types.ObjectId, { movieId, value }: SetRatingDto) {
    const newRating = await this.RatingModel.findOneAndUpdate(
      {
        movie: movieId,
        user: userId,
      },
      {
        movie: movieId,
        user: userId,
        value,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    ).exec();
    const averageRating = await this.averageRating(movieId);

    await this.MovieService.updateRating(movieId, averageRating);

    return newRating;
  }
}
