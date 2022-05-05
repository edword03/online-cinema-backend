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
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreService } from './genre.service';

@Controller('genres')
export class GenreController {
  constructor(private readonly GenreService: GenreService) {}

  @Get()
  async getAllGenres(@Query('searchTerm') searchTerm: string) {
    return this.GenreService.getAllGenres(searchTerm);
  }

  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.GenreService.getGenreBySlug(slug);
  }

  @Get('collections')
  async getCollections() {
    return this.GenreService.getCollections();
  }

  // admin

  @Get(':id')
  @Auth('admin')
  getGenrById(@Param('id', IdValidationPipe) id: string) {
    return this.GenreService.getGenreById(id);
  }

  @Post()
  @HttpCode(200)
  async createNewGenre() {
    return this.GenreService.createNewGenre();
  }

  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateDoc(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: UpdateGenreDto,
  ) {
    return this.GenreService.updateDoc(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteGenre(@Param('id', IdValidationPipe) id: string) {
    return this.GenreService.deleteGenre(id);
  }
}
