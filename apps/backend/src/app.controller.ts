import { Controller, Get } from '@nestjs/common';
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

  @Get('users')
  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
  @Get('pokemon')
  async getPokemon(): Promise<Pokemon[]> {
    return this.prisma.pokemon.findMany();
  }
  @Get('pokemon-instances')
  async getPokemonInstances(): Promise<PokemonInstance[]> {
    return this.prisma.pokemonInstance.findMany();
  }
  @Get('catch-roll-events')
  async getCatchRolls(): Promise<CatchRollEvent[]> {
    return this.prisma.catchRollEvent.findMany();
  }
  @Get('spawn-events')
  async getSpawnEvents(): Promise<SpawnEvent[]> {
    return this.prisma.spawnEvent.findMany();
  }
}
