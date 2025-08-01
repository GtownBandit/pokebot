/*
  Warnings:

  - A unique constraint covering the columns `[defaultPokemonId]` on the table `PokemonSpecies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `defaultPokemonId` to the `PokemonSpecies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PokemonSpecies" ADD COLUMN     "defaultPokemonId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PokemonSpecies_defaultPokemonId_key" ON "PokemonSpecies"("defaultPokemonId");

-- AddForeignKey
ALTER TABLE "PokemonSpecies" ADD CONSTRAINT "PokemonSpecies_defaultPokemonId_fkey" FOREIGN KEY ("defaultPokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
