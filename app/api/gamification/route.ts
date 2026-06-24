import { NextResponse } from "next/server";

interface GamificationPayload {
  userId: string;
  courseId: string;
  taskId: string;
  orgId: string;
  moduleId: string;
  accuracy: number;
  timeTakenSeconds: number;
  expectedDurationSeconds: number;
  deadline: string;
  completionDateTime: string;
}

export async function POST(request: Request) {
  try {
    const body: GamificationPayload = await request.json();
    const {
      userId,
      taskId,
      accuracy,
      timeTakenSeconds,
      expectedDurationSeconds,
      deadline,
      completionDateTime,
    } = body;

    if (!userId || !taskId || accuracy === undefined || timeTakenSeconds === undefined || expectedDurationSeconds === undefined || !deadline || !completionDateTime) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const accuracyPoints = Math.round(accuracy / 10);

    const deadlineTime = new Date(deadline).getTime();
    const completionTime = new Date(completionDateTime).getTime();
    if (isNaN(deadlineTime) || isNaN(completionTime)) {
      return NextResponse.json({ success: false, error: "Invalid date format" }, { status: 400 });
    }
    const isBeforeDeadline = completionTime <= deadlineTime;
    const deadlinePoints = isBeforeDeadline ? 10 : 0;

    if (expectedDurationSeconds <= 0) {
      return NextResponse.json({ success: false, error: "expectedDurationSeconds must be positive" }, { status: 400 });
    }
    const speedRatio = timeTakenSeconds / expectedDurationSeconds;
    let speedPoints = 0;
    if (speedRatio <= 0.5) {
      speedPoints = 10;
    } else if (speedRatio <= 1.5) {
      const countedValue = (speedRatio - 0.5) * 100;
      speedPoints = (100 - countedValue) / 10;
    }
    const finalSpeedPoints = Math.max(0, Math.min(10, Math.round(speedPoints)));

    const totalPoints = accuracyPoints + deadlinePoints + finalSpeedPoints;

    return NextResponse.json({
      success: true,
      data: {
        userId,
        taskId,
        pointsBreakdown: { accuracyPoints, deadlinePoints, speedPoints: finalSpeedPoints },
        totalPointsEarned: totalPoints,
        speedAnalysis: {
          speedRatio: Math.round(speedRatio * 100) / 100,
          performance: speedRatio <= 0.5 ? "Excellent" : speedRatio <= 1.0 ? "Good" : speedRatio <= 1.5 ? "Average" : "Slow",
        },
        deadlineAnalysis: {
          isBeforeDeadline,
          completedAt: new Date(completionTime).toISOString(),
          dueAt: new Date(deadlineTime).toISOString(),
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
