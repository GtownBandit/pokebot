/*
  Warnings:

  - A unique constraint covering the columns `[pokemonInstanceId]` on the table `SpawnEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PokemonInstance" DROP CONSTRAINT "PokemonInstance_userId_fkey";

-- AlterTable
ALTER TABLE "PokemonInstance" ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SpawnEvent_pokemonInstanceId_key" ON "SpawnEvent"("pokemonInstanceId");

-- AddForeignKey
ALTER TABLE "PokemonInstance" ADD CONSTRAINT "PokemonInstance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
