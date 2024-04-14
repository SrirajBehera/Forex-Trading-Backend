import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDocument } from './user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor of LocalStrategy.
   * @param {AuthService} authService - The authentication service.
   */
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  /**
   * Validates the user's credentials.
   * @param {string} email - The email address of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<UserDocument>} The user document if validation succeeds, otherwise throws UnauthorizedException.
   */
  async validate(email: string, password: string): Promise<UserDocument> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
