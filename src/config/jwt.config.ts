import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => {
  console.log(configService.get('JWT_SECRET'));
  // ({
  //   secret: configService.get('JWT_SECRET'),
  // })
  return {
    secret: configService.get('JWT_SECRET'),
  };
};
