-- DropForeignKey
ALTER TABLE "PokemonSpecies" DROP CONSTRAINT "PokemonSpecies_defaultPokemonId_fkey";

-- AlterTable
ALTER TABLE "PokemonSpecies" ALTER COLUMN "defaultPokemonId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PokemonSpecies" ADD CONSTRAINT "PokemonSpecies_defaultPokemonId_fkey" FOREIGN KEY ("defaultPokemonId") REFERENCES "Pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
