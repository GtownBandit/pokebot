/*
  Warnings:

  - Added the required column `pokemonSpeciesId` to the `Pokemon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "pokemonSpeciesId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "PokemonSpecies" (
    "id" SERIAL NOT NULL,
    "genderRate" INTEGER NOT NULL,
    "isBaby" BOOLEAN NOT NULL,
    "isLegendary" BOOLEAN NOT NULL,
    "isMythical" BOOLEAN NOT NULL,
    "captureRate" INTEGER NOT NULL,

    CONSTRAINT "PokemonSpecies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_pokemonSpeciesId_fkey" FOREIGN KEY ("pokemonSpeciesId") REFERENCES "PokemonSpecies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
