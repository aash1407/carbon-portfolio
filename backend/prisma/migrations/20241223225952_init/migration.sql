-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "pricePerTon" DOUBLE PRECISION NOT NULL,
    "offeredVolume" INTEGER NOT NULL,
    "distributionWeight" DOUBLE PRECISION NOT NULL,
    "supplierName" TEXT NOT NULL,
    "earliestDelivery" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_distribution_weight" ON "Project"("distributionWeight");

-- CreateIndex
CREATE INDEX "idx_offered_volume" ON "Project"("offeredVolume");

-- CreateIndex
CREATE INDEX "idx_price_per_ton" ON "Project"("pricePerTon");
