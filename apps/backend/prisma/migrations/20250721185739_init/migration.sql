-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "twitchUserId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonSpecies" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "type1" TEXT NOT NULL,
    "type2" TEXT,
    "baseStats" JSONB,
    "genderRate" INTEGER,
    "baseExp" INTEGER,
    "captureRate" INTEGER,
    "spriteUrl" TEXT,
    "shinyUrl" TEXT,
    "rarity" INTEGER NOT NULL,

    CONSTRAINT "PokemonSpecies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonInstance" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "speciesId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "gender" TEXT,
    "nickname" TEXT,
    "shiny" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "originSpawnId" TEXT,
    "experience" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PokemonInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpawnEvent" (
    "id" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "speciesId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "spawnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "caughtById" TEXT,

    CONSTRAINT "SpawnEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatchAttempt" (
    "id" TEXT NOT NULL,
    "spawnId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roll" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CatchAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_twitchUserId_key" ON "User"("twitchUserId");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonSpecies_name_key" ON "PokemonSpecies"("name");

-- AddForeignKey
ALTER TABLE "PokemonInstance" ADD CONSTRAINT "PokemonInstance_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonInstance" ADD CONSTRAINT "PokemonInstance_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "PokemonSpecies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonInstance" ADD CONSTRAINT "PokemonInstance_originSpawnId_fkey" FOREIGN KEY ("originSpawnId") REFERENCES "SpawnEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpawnEvent" ADD CONSTRAINT "SpawnEvent_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "PokemonSpecies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpawnEvent" ADD CONSTRAINT "SpawnEvent_caughtById_fkey" FOREIGN KEY ("caughtById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatchAttempt" ADD CONSTRAINT "CatchAttempt_spawnId_fkey" FOREIGN KEY ("spawnId") REFERENCES "SpawnEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatchAttempt" ADD CONSTRAINT "CatchAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
