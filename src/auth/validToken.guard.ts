import { AuthService } from './auth.service';
// import { TokenRepository } from './repository/token.repository';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }
  async validateRequest(execContext): Promise<boolean> {
    try {
      console.log('jello');
      const token = execContext.headers.authorization.split(' ')[1];
      return await this.authService.checkActive(token);
    } catch (error) {
      console.log('wtf');
    }
  }
}
