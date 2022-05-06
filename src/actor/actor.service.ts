import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ActorModel } from './actor.model';
import { ActorDto } from './dto/actor.dto';

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>,
  ) {}

  async getActorBySlug(slug: string) {
    const doc = await this.ActorModel.findOne({ slug }).exec();

    if (!doc) throw new NotFoundException('Actor not found');

    return doc;
  }

  async getAllActors(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          {
            name: new RegExp(searchTerm, 'i'),
          },
          {
            slug: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return this.ActorModel.find(options)
      .select('-updatedAt, -__v')
      .sort({
        createdAt: 'desc',
      })
      .exec();
  }

  async getActorById(_id: string) {
    const actor = await this.ActorModel.findById(_id);

    if (!actor) throw new NotFoundException('Actor is not found');

    return actor;
  }

  async createActor() {
    const defaultFields: ActorDto = {
      name: '',
      slug: '',
      photo: '',
    };

    const actor = await this.ActorModel.create(defaultFields);
    return actor._id;
  }

  async updateDoc(_id: string, dto: ActorDto) {
    const updateDoc = await this.ActorModel.findByIdAndUpdate(_id, dto, {
      new: true,
    }).exec();

    if (!updateDoc) throw new NotFoundException('Actor not found');

    return updateDoc;
  }

  async deleteGenre(id: string) {
    const deleteDoc = await this.ActorModel.findByIdAndDelete(id).exec();

    if (!deleteDoc) throw new NotFoundException('Actor not found');

    return deleteDoc;
  }
}
