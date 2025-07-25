-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "displayNameDe" TEXT NOT NULL,
    "type1" TEXT NOT NULL,
    "type2" TEXT,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpawnEvent" (
    "id" SERIAL NOT NULL,
    "channel" TEXT NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "spawnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "caughtById" TEXT,

    CONSTRAINT "SpawnEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_name_key" ON "Pokemon"("name");

-- AddForeignKey
ALTER TABLE "SpawnEvent" ADD CONSTRAINT "SpawnEvent_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
