// apps/backend/src/chatbot/chatbot.service.ts
import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { AccessToken, RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { promises as fs } from 'fs';
import { PokemonCatchService } from './pokemon/pokemon-catch.service';
import { PokemonSpawnService } from './pokemon/pokemon-spawn.service';

@Injectable()
export class TwitchService implements OnModuleInit {
  private readonly logger = new Logger(TwitchService.name);
  private authProvider!: RefreshingAuthProvider;
  private chatClient!: ChatClient;

  constructor(
    @Inject(forwardRef(() => PokemonCatchService))
    private pokemonCatchService: PokemonCatchService,
    @Inject(forwardRef(() => PokemonSpawnService))
    private pokemonSpawnService: PokemonSpawnService,
  ) {}

  async onModuleInit() {
    const clientId = process.env.TWITCH_BOT_CLIENT_ID!;
    const clientSecret = process.env.TWITCH_BOT_CLIENT_SECRET!;
    const channel = process.env.TWITCH_CHANNEL!; // lowercase login name, e.g. "magicalmagikarp"

    // Build tokenData from env (initial load). Force refresh on startup with expiresIn=0.
    const tokenData: AccessToken = {
      accessToken: process.env.TWITCH_BOT_ACCESS_TOKEN!,
      refreshToken: process.env.TWITCH_BOT_REFRESH_TOKEN!,
      scope: ['chat:read', 'chat:edit'], // add more if you later need them
      expiresIn: 0,
      obtainmentTimestamp: 0,
    };

    // 1. Create provider (no onRefresh here!)
    this.authProvider = new RefreshingAuthProvider({ clientId, clientSecret });

    // 2. Persist refreshed tokens
    this.authProvider.onRefresh(async (userId, newTokenData) => {
      try {
        await fs.writeFile(
          `./twitch_tokens.${userId}.json`,
          JSON.stringify(newTokenData, null, 2),
          'utf-8',
        );
        this.logger.log(`Refreshed Twitch token for user ${userId}`);
      } catch (err) {
        this.logger.error(
          'Failed to persist refreshed Twitch token',
          err as Error,
        );
      }
    });

    // 3. Register bot user & mark it as the chat token
    await this.authProvider.addUserForToken(tokenData, ['chat']);

    // 4. Create ChatClient & connect
    this.chatClient = new ChatClient({
      authProvider: this.authProvider,
      channels: [channel],
    });

    // Optional: log connection lifecycle
    this.chatClient.onConnect(() =>
      this.logger.log('Connected to Twitch chat.'),
    );
    this.chatClient.onDisconnect((manually, reason) =>
      this.logger.warn(
        `Disconnected from Twitch chat (${manually ? 'manual' : 'error'}). ${reason ?? ''}`,
      ),
    );
    this.chatClient.onAuthenticationFailure((text) =>
      this.logger.error(`Twitch chat authentication failed: ${text}`),
    );

    // Listen for messages (for future "!catch" command)
    this.chatClient.onMessage((chan, user, text) => {
      if (text.trim().toLowerCase() === '!catch') {
        this.pokemonCatchService.tryCatchPokemon(user);
      } else if (
        text.trim().toLowerCase() === '!spawn' &&
        user === process.env.TWITCH_BOT_USERNAME
      ) {
        this.pokemonSpawnService.spawnRandomPokemon();
      }
    });

    // Connect (sync; `await` is harmless but unnecessary in current versions)
    this.chatClient.connect();
    this.logger.log(`Twitch chat client connected to channel: ${channel}`);
    this.chatClient.say(channel, 'Pokebot is online!');
  }

  async sendChatMessage(message: string) {
    if (!this.chatClient) {
      throw new Error('Twitch chat not initialized');
    }
    await this.chatClient.say(process.env.TWITCH_CHANNEL!, message);
  }
}
