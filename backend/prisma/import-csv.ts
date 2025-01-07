/**
 * This script imports project data from a CSV file into a database using Prisma.
 *
 * - Reads data from a CSV file (`projects_sample.csv`) located in the same directory as the script.
 * - Parses the CSV data into an array of project objects with properties matching the database schema.
 * - Uses Prisma to insert the parsed data into the `Project` table of the database.
 * - Skips duplicate records in the database to avoid re-insertion of the same data.
 * - Ensures proper disconnection from the database after the import process is complete.
 *
 * Requirements:
 * - The CSV file should have headers matching the expected field names.
 * - Prisma Client must be properly configured to connect to the database.
 */

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
