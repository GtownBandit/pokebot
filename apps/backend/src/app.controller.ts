import { Controller } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  // @Get('users')
  // async getUsers() {
  //   return await this.prisma.user.findMany();
  // }
  // @Get('pokemon')
  // async getPokemon() {
  //   return await this.prisma.pokemonSpecies.findMany();
  // }
}
