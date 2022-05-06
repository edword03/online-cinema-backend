import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface FileModel extends Base {}

export class FileModel extends TimeStamps {
  @prop()
  name: string;

  @prop()
  url: string;

  @prop()
  size: number;
}
