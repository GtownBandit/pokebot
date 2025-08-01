-- CreateTable
CREATE TABLE "PokemonSprite" (
    "id" SERIAL NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "backDefault" TEXT NOT NULL,
    "backShiny" TEXT NOT NULL,
    "frontDefault" TEXT NOT NULL,
    "frontShiny" TEXT NOT NULL,
    "backFemale" TEXT,
    "backShinyFemale" TEXT,
    "frontFemale" TEXT,
    "frontShinyFemale" TEXT,

    CONSTRAINT "PokemonSprite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PokemonSprite" ADD CONSTRAINT "PokemonSprite_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
