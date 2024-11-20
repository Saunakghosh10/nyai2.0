import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get total sessions
    const totalSessions = await prisma.consultSession.count({
      where: { userId },
    });

    // Get total duration
    const sessions = await prisma.consultSession.findMany({
      where: {
        userId,
        endTime: { not: null },
      },
      select: {
        startTime: true,
        endTime: true,
        feedback: {
          select: {
            rating: true,
          },
        },
      },
    });

    let totalDuration = 0;
    let totalRating = 0;
    let ratingCount = 0;

    sessions.forEach((session) => {
      if (session.endTime) {
        totalDuration += Math.floor(
          (session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60
        );
      }
      
      session.feedback?.forEach((feedback) => {
        totalRating += feedback.rating;
        ratingCount++;
      });
    });

    // Get upcoming sessions
    const upcomingSessions = await prisma.consultSession.count({
      where: {
        userId,
        status: 'scheduled',
        startTime: { gt: new Date() },
      },
    });

    // Get popular topics
    const topics = await prisma.consultSession.groupBy({
      by: ['topic'],
      where: { userId },
      _count: true,
      orderBy: {
        _count: {
          topic: 'desc',
        },
      },
      take: 5,
    });

    // Get recent feedback
    const recentFeedback = await prisma.consultFeedback.findMany({
      where: {
        session: { userId },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    return NextResponse.json({
      totalSessions,
      totalDuration,
      averageRating: ratingCount > 0 ? totalRating / ratingCount : 0,
      completedSessions: sessions.length,
      upcomingSessions,
      popularTopics: topics.map((t) => ({
        topic: t.topic,
        count: t._count,
      })),
      recentFeedback,
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to fetch analytics',
    }, { status: 500 });
  }
} 