-- CreateTable
CREATE TABLE "CatchRollEvent" (
    "id" SERIAL NOT NULL,
    "spawnEventId" INTEGER NOT NULL,
    "roll" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "rolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CatchRollEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CatchRollEvent" ADD CONSTRAINT "CatchRollEvent_spawnEventId_fkey" FOREIGN KEY ("spawnEventId") REFERENCES "SpawnEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
