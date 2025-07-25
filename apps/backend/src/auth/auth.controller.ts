// apps/backend/src/auth/auth.controller.ts
import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  @Get('callback')
  async twitchCallback(
    @Query('code') code: string,
    @Query('scope') scope: string,
    @Res() res: Response,
  ) {
    if (!code) {
      return res.status(400).send('Missing code parameter');
    }

    const clientId = process.env.TWITCH_BOT_CLIENT_ID!;
    const clientSecret = process.env.TWITCH_BOT_CLIENT_SECRET!;
    const redirectUri = process.env.BACKEND_URL + '/auth/callback'; // must match your redirect URI in Twitch app

    const fetch = (await import('node-fetch')).default;

    // Exchange code for tokens
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    });

    const tokenResponse = await fetch(
      `https://id.twitch.tv/oauth2/token?${params.toString()}`,
      {
        method: 'POST',
      },
    );

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text();
      return res
        .status(tokenResponse.status)
        .send(`Error exchanging code: ${errorBody}`);
    }

    const tokenData: any = await tokenResponse.json();

    // You can log, save to DB, or just display for now
    console.log('Twitch token data:', tokenData);

    // For quick testing, just show tokens in browser
    return res.send(`
      <h1>Twitch OAuth Tokens</h1>
      <p><b>Access Token:</b> ${tokenData.access_token}</p>
      <p><b>Refresh Token:</b> ${tokenData.refresh_token}</p>
      <p><b>Expires In:</b> ${tokenData.expires_in} seconds</p>
      <p><b>Scopes:</b> ${tokenData.scope.join(', ')}</p>
      <p>Copy these tokens into your backend environment variables.</p>
    `);
  }
}
