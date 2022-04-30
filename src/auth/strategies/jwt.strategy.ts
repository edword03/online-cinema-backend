import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserModel } from 'src/user/user.model';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly ConfigService: ConfigService,
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: ConfigService.get('JWT_SECRET'),
    });
  }
  async validate({ _id }: Pick<UserModel, '_id'>) {
    return this.userModel.findById(_id).exec();
  }
}
