import { Types } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { IsNumber } from 'class-validator';

export class SetRatingDto {
  @IsObjectId({ message: 'Invalid id' })
  movieId: Types.ObjectId;

  @IsNumber()
  value: number;
}
