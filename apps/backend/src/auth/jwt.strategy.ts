import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['RS256'],
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://auth.pokebot.at/.well-known/jwks.json',
      }),
      audience: 'https://api.pokebot.at',
      issuer: 'https://auth.pokebot.at/',
    });
  }

  validate(payload: any) {
    const sub = payload.sub; // "oauth2|twitch|12345678"
    const userId = sub.split('|').pop();
    return { ...payload, userId };
  }
}
