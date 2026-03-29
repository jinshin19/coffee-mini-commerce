import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token is required.');
    }

    try {
      const secret =
        this.configService.get<string>('JWT_SECRET') || 'fallback-secret-change-me';
      const payload = this.jwtService.verify(token, { secret });
      (request as any).admin = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired authentication token.');
    }

    return true;
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    return authHeader.slice(7);
  }
}
