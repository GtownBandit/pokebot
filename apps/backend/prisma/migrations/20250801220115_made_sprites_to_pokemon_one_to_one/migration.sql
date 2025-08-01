/*
  Warnings:

  - A unique constraint covering the columns `[pokemonId]` on the table `PokemonSprite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PokemonSprite_pokemonId_key" ON "PokemonSprite"("pokemonId");
