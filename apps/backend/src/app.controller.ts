import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import {
  CatchRollEvent,
  Pokemon,
  PokemonInstance,
  SpawnEvent,
  User,
} from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
  @UseGuards(JwtAuthGuard)
  @Get('pokemon')
  async getPokemon(): Promise<Pokemon[]> {
    return this.prisma.pokemon.findMany();
  }

  @UseGuards(JwtAuthGuard)
  @Get('pokemon-instances')
  async getPokemonInstances(@Req() req): Promise<PokemonInstance[]> {
    const twitchId = req.user.userId;
    const userWithInstances = await this.prisma.user.findUnique({
      where: { twitchId: twitchId },
      include: { pokemonInstances: true },
    });
    if (!userWithInstances) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return userWithInstances.pokemonInstances;
  }

  @UseGuards(JwtAuthGuard)
  @Get('catch-roll-events')
  async getCatchRolls(@Req() req): Promise<CatchRollEvent[]> {
    const twitchId = req.user.userId;
    const userWithEvents = await this.prisma.user.findUnique({
      where: { twitchId: twitchId },
      include: { catchRollEvents: true },
    });
    if (!userWithEvents) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return userWithEvents.catchRollEvents;
  }

  @UseGuards(JwtAuthGuard)
  @Get('spawn-events')
  async getSpawnEvents(): Promise<SpawnEvent[]> {
    return this.prisma.spawnEvent.findMany();
  }
}
