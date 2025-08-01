-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'GENDERLESS');

-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "displayNameDe" TEXT NOT NULL,
    "type1" TEXT NOT NULL,
    "type2" TEXT,
    "pokemonSpeciesId" INTEGER NOT NULL,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "PokemonInstance" (
    "id" SERIAL NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "userId" INTEGER,
    "nickname" TEXT,
    "shiny" BOOLEAN NOT NULL DEFAULT false,
    "gender" "Gender" NOT NULL,

    CONSTRAINT "PokemonInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpawnEvent" (
    "id" SERIAL NOT NULL,
    "channel" TEXT NOT NULL,
    "pokemonInstanceId" INTEGER NOT NULL,
    "spawnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "SpawnEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatchRollEvent" (
    "id" SERIAL NOT NULL,
    "spawnEventId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "roll" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "pokemonRanAway" BOOLEAN NOT NULL DEFAULT false,
    "rolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CatchRollEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "twitchId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_name_key" ON "Pokemon"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SpawnEvent_pokemonInstanceId_key" ON "SpawnEvent"("pokemonInstanceId");

-- CreateIndex
CREATE UNIQUE INDEX "User_twitchId_key" ON "User"("twitchId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_pokemonSpeciesId_fkey" FOREIGN KEY ("pokemonSpeciesId") REFERENCES "PokemonSpecies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonInstance" ADD CONSTRAINT "PokemonInstance_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonInstance" ADD CONSTRAINT "PokemonInstance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpawnEvent" ADD CONSTRAINT "SpawnEvent_pokemonInstanceId_fkey" FOREIGN KEY ("pokemonInstanceId") REFERENCES "PokemonInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatchRollEvent" ADD CONSTRAINT "CatchRollEvent_spawnEventId_fkey" FOREIGN KEY ("spawnEventId") REFERENCES "SpawnEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatchRollEvent" ADD CONSTRAINT "CatchRollEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
