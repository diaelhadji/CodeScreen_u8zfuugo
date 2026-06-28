import { PrismaClient } from '/home/aaai4718/public_html/CodeScreen_u8zfuugo/server/prisma/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

// Configuration de l'adaptateur PostgreSQL
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || 'postgresql://aaai4718_user:Passer4400@localhost:5432/aaai4718_codescreen',
});

// Initialisation de Prisma Client avec l'adaptateur
const prisma = new PrismaClient({ adapter });

interface TopWorker {
  name: string;
  shifts: number;
}

async function getTopWorkers(): Promise<TopWorker[]> {
  try {
    const workers = await prisma.worker.findMany({
      include: { Shift: true }
    });

    const stats: TopWorker[] = workers.map((worker: any) => {
      const completedShifts = worker.Shift.filter((shift: any) =>
        shift.cancelledAt === null &&
        new Date(shift.endAt) < new Date()
      );
      return {
        name: worker.name,
        shifts: completedShifts.length
      };
    });

    return stats
      .sort((a: TopWorker, b: TopWorker) => b.shifts - a.shifts)
      .slice(0, 3);
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  getTopWorkers()
    .then((result: TopWorker[]) => {
      console.log(JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch((error: Error) => {
      console.error('Erreur:', error.message);
      process.exit(1);
    });
}

export { getTopWorkers };
