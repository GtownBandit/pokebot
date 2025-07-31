import { Controller, Get, UseGuards } from '@nestjs/common';
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
  async getPokemonInstances(): Promise<PokemonInstance[]> {
    return this.prisma.pokemonInstance.findMany();
  }
  @UseGuards(JwtAuthGuard)
  @Get('catch-roll-events')
  async getCatchRolls(): Promise<CatchRollEvent[]> {
    return this.prisma.catchRollEvent.findMany();
  }
  @UseGuards(JwtAuthGuard)
  @Get('spawn-events')
  async getSpawnEvents(): Promise<SpawnEvent[]> {
    return this.prisma.spawnEvent.findMany();
  }
}
