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
import { ActorService } from './actor.service';
import { ActorDto } from './dto/actor.dto';

@Controller('actors')
export class ActorController {
  constructor(private readonly ActorService: ActorService) {}

  @Get()
  async getAllActors(@Query('searchTerm') searchTerm: string) {
    return this.ActorService.getAllActors(searchTerm);
  }

  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.ActorService.getActorBySlug(slug);
  }

  // admin

  @Get(':id')
  @Auth('admin')
  getGenrById(@Param('id', IdValidationPipe) id: string) {
    return this.ActorService.getActorById(id);
  }

  @Post()
  @HttpCode(200)
  async createNewGenre() {
    return this.ActorService.createActor();
  }

  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateDoc(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: ActorDto,
  ) {
    return this.ActorService.updateDoc(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteGenre(@Param('id', IdValidationPipe) id: string) {
    return this.ActorService.deleteGenre(id);
  }
}
