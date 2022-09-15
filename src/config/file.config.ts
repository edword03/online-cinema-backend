import { ConfigService } from '@nestjs/config';
import { ConfigurationOptions } from 'aws-sdk';

export const getFileConfig = async (
  configService: ConfigService,
): Promise<ConfigurationOptions> => ({
  s3BucketEndpoint: configService.get('AWS_PUBLIC_BUCKET_NAME'),
});
