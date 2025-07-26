/*
  Warnings:

  - You are about to drop the column `caughtById` on the `SpawnEvent` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `SpawnEvent` table. All the data in the column will be lost.
  - You are about to drop the column `pokemonId` on the `SpawnEvent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[twitchId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pokemonInstanceId` to the `SpawnEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `twitchId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SpawnEvent" DROP CONSTRAINT "SpawnEvent_pokemonId_fkey";

-- AlterTable
ALTER TABLE "SpawnEvent" DROP COLUMN "caughtById",
DROP COLUMN "level",
DROP COLUMN "pokemonId",
ADD COLUMN     "pokemonInstanceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twitchId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PokemonInstance" (
    "id" SERIAL NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "nickname" TEXT,
    "shiny" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PokemonInstance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_twitchId_key" ON "User"("twitchId");

-- AddForeignKey
ALTER TABLE "PokemonInstance" ADD CONSTRAINT "PokemonInstance_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonInstance" ADD CONSTRAINT "PokemonInstance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpawnEvent" ADD CONSTRAINT "SpawnEvent_pokemonInstanceId_fkey" FOREIGN KEY ("pokemonInstanceId") REFERENCES "PokemonInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
