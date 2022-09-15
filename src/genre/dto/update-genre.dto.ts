import { IsString, IsOptional } from 'class-validator';

export class UpdateGenreDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  icon: string;
}
