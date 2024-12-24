import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

const prisma = new PrismaClient();

async function main() {
  const csvFilePath = path.resolve(__dirname, 'projects_sample.csv');
  const projects: any[] = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      projects.push({
        id: parseInt(row.id, 10),
        name: row.name,
        country: row.country,
        image: row.image,
        pricePerTon: parseFloat(row.price_per_ton),
        offeredVolume: parseInt(row.offered_volume_in_tons, 10),
        distributionWeight: parseFloat(row.distribution_weight),
        supplierName: row.supplier_name,
        earliestDelivery: new Date(row.earliest_delivery),
        description: row.description,
      });
    })
    .on('end', async () => {
      await prisma.project.createMany({
        data: projects,
        skipDuplicates: true, // Skip inserting if the record already exists
      });
      console.log('CSV file successfully processed and data imported.');
      await prisma.$disconnect();
    });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
