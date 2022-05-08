import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { Types } from 'mongoose';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { User } from 'src/user/decorators/user.decorator';
import { SetRatingDto } from './dto/set-rating.dto';
import { RatingService } from './rating.service';

@Controller('ratings')
export class RatingController {
  constructor(private readonly RatingService: RatingService) {}

  @Get(':movieId')
  @Auth()
  async updateDoc(
    @Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
    @User('_id') _id: Types.ObjectId,
  ) {
    return this.RatingService.getMovieValueByUser(movieId, _id);
  }

  @Post('set-rating')
  @HttpCode(200)
  @Auth()
  async setRating(@User('_id') _id: Types.ObjectId, @Body() dto: SetRatingDto) {
    return this.RatingService.setRating(_id, dto);
  }
}
