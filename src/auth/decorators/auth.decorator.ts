import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleType } from '../auth.interface';
import { AdminGuard } from '../guards/admin.guard';
import { JwtAuthGuard } from '../guards/jwt.guard';

export const Auth = (role: RoleType = 'user') =>
  applyDecorators(
    role === 'admin'
      ? UseGuards(JwtAuthGuard, AdminGuard)
      : UseGuards(JwtAuthGuard),
  );
