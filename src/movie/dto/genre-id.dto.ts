import { IsArray, IsString } from 'class-validator';

export class GenreIdDto {
  @IsArray()
  @IsString({ each: true })
  genreIds: string[];
}
