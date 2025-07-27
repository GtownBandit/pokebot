/*
  Warnings:

  - Added the required column `gender` to the `PokemonInstance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'GENDERLESS');

-- AlterTable
ALTER TABLE "PokemonInstance" ADD COLUMN     "gender" "Gender" NOT NULL;
