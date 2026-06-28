import { PrismaClient } from '/home/aaai4718/public_html/CodeScreen_u8zfuugo/server/prisma/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

// Configuration de l'adaptateur PostgreSQL
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || 'postgresql://aaai4718_user:Passer4400@localhost:5432/aaai4718_codescreen',
});

// Initialisation de Prisma Client avec l'adaptateur
const prisma = new PrismaClient({ adapter });

interface TopWorkplace {
  name: string;
  shifts: number;
}

async function getTopWorkplaces(): Promise<TopWorkplace[]> {
  try {
    const workplaces = await prisma.workplace.findMany({
      include: { shifts: true }
    });

    const stats: TopWorkplace[] = workplaces.map((workplace: any) => {
      const completedShifts = workplace.shifts.filter((shift: any) =>
        shift.workerId !== null &&
        shift.cancelledAt === null &&
        new Date(shift.endAt) < new Date()
      );
      return {
        name: workplace.name,
        shifts: completedShifts.length
      };
    });

    return stats
      .sort((a: TopWorkplace, b: TopWorkplace) => b.shifts - a.shifts)
      .slice(0, 3);
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  getTopWorkplaces()
    .then((result: TopWorkplace[]) => {
      console.log(JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch((error: Error) => {
      console.error('Erreur:', error.message);
      process.exit(1);
    });
}

export { getTopWorkplaces };
