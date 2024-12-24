import prisma from '@/app/lib/prisma'

export const revalidate = 60;

const excludedUsernames = ["pg", "patio11", "tptacek"];

export async function GET() {
  try {
    const recentUsers = await prisma.user.findMany({
      where: {
        persona: {
          not: null
        },
        username: {
          notIn: excludedUsernames
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      select: {
        username: true,
        persona: true,
        followers_count: true,
        createdAt: true
      }
    });

    const topUsers = await prisma.user.findMany({
      where: {
        persona: {
          not: null
        },
        username: {
          notIn: excludedUsernames
        }
      },
      orderBy: {
        followers_count: 'desc'
      },
      take: 10,
      select: {
        username: true,
        persona: true,
        followers_count: true,
        createdAt: true
      }
    });

    return Response.json({
      recent: recentUsers,
      top: topUsers
    });
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}