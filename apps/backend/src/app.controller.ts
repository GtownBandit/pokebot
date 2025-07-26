import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('users')
  async getUsers() {
    return await this.prisma.user.findMany();
  }
  @Get('pokemon')
  async getPokemon() {
    return await this.prisma.pokemon.findMany();
  }
  @Get('pokemon-instances')
  async getPokemonInstances() {
    return await this.prisma.pokemonInstance.findMany();
  }
  @Get('catch-roll-events')
  async getCatchRolls() {
    return await this.prisma.catchRollEvent.findMany();
  }
  @Get('spawn-events')
  async getSpawnEvents() {
    return await this.prisma.catchRollEvent.findMany();
  }
}
