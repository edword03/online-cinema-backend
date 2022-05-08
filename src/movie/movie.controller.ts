import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly MovieService: MovieService) {}

  @Get()
  async getAllMovies(@Query('searchTerm') searchTerm: string) {
    return this.MovieService.getAllMovies(searchTerm);
  }

  @Get('by-slug/:slug')
  async getMovieBySlug(@Param('slug') slug: string) {
    return this.MovieService.getMovieBySlug(slug);
  }

  @Get('by-actor/:actorId')
  async getMoviesByActor(
    @Param('actorId', IdValidationPipe) actorId: Types.ObjectId,
  ) {
    return this.MovieService.getMoviesByActors(actorId);
  }

  @Post('by-genres')
  @HttpCode(200)
  async getMoviesByGenre(@Body('genreIds') genreIds: Types.ObjectId[]) {
    return this.MovieService.getMoviesByGenres(genreIds);
  }

  @Get('most-popular')
  getMostPopular() {
    return this.MovieService.getMostPopular();
  }

  @Put('update-count-views')
  @HttpCode(200)
  async updateCountViews(@Body('slug') slug: string) {
    return this.MovieService.updateCountViews(slug);
  }

  // admin

  @Get(':id')
  @Auth('admin')
  getMovieById(@Param('id', IdValidationPipe) id: string) {
    return this.MovieService.getMovieById(id);
  }

  @Post()
  @Auth('admin')
  @HttpCode(200)
  async createMovie() {
    return this.MovieService.createMovie();
  }

  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateDoc(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: UpdateMovieDto,
  ) {
    return this.MovieService.updateDoc(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteGenre(@Param('id', IdValidationPipe) id: string) {
    return this.MovieService.deleteMovie(id);
  }
}
