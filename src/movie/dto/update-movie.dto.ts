import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';

export class Parameters {
  @IsNumber()
  year: number;

  @IsNumber()
  duration: number;

  @IsString()
  country: string;
}

export class UpdateMovieDto {
  @IsString()
  poster: string;

  @IsString()
  bigPoster: string;

  @IsString()
  title: string;

  @IsString()
  tagline: string;

  @IsString()
  description?: string;

  @IsString()
  trailerUrl: string;

  @IsString()
  slug: string;

  @IsObject()
  parameters?: Parameters;

  @IsString()
  videoUrl: string;

  @IsArray()
  genres: string[];

  @IsArray()
  @IsString({ each: true })
  actors: string[];

  isSendTelegram?: boolean;
}
