import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserDocument } from './user.entity';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * Validates the JWT payload.
   * @param {any} payload - The payload extracted from the JWT token.
   * @returns {Promise<UserDocument>} The user document extracted from the payload.
   */
  async validate(payload: any): Promise<UserDocument> {
    return { id: payload.sub, email: payload.email } as UserDocument;
  }
}
