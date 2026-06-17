import { NextResponse } from "next/server";

interface GamificationPayload {
  userId: string;
  courseId: string;
  taskId: string;
  accuracy: number; // percentage (0 to 100)
  timeTakenSeconds: number; // actual time taken (seconds)
  expectedDurationSeconds: number; // target time for the task (seconds)
  deadline: string; // ISO date timestamp string
  completionDateTime: string; // ISO date timestamp string of completion
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

    // Validate request body
    if (
      !userId ||
      !taskId ||
      accuracy === undefined ||
      timeTakenSeconds === undefined ||
      expectedDurationSeconds === undefined ||
      !deadline ||
      !completionDateTime
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields in payload" },
        { status: 400 }
      );
    }

    // 1. Calculate points based on Accuracy (e.g. 100% accuracy = 10 points)
    const accuracyPoints = Math.round(accuracy/10);

    // 2. Calculate Deadline Points (10pts if completed before or on deadline, 0pts after)
    const deadlineTime = new Date(deadline).getTime();
    const completionTime = new Date(completionDateTime).getTime();

    if (isNaN(deadlineTime) || isNaN(completionTime)) {
      return NextResponse.json(
        { success: false, error: "Invalid date format for deadline or completionDateTime" },
        { status: 400 }
      );
    }

    const isBeforeDeadline = completionTime <= deadlineTime;
    const deadlinePoints = isBeforeDeadline ? 10 : 0;

    // 3. Calculate Speed Points
    if (expectedDurationSeconds <= 0) {
      return NextResponse.json(
        { success: false, error: "expectedDurationSeconds must be a positive number greater than 0" },
        { status: 400 }
      );
    }

    const speedRatio = timeTakenSeconds / expectedDurationSeconds;
    let speedPoints = 0;

    if (speedRatio <= 0.5) {
      // Completed before 50% of expected duration
      speedPoints = 10;
    } else if (speedRatio <= 1.5) {
      // Completed between 50% and 150% of expected duration
      // countedValue is the progress percentage from 0 (at 50% mark) to 100 (at 150% mark)
      const countedValue = (speedRatio - 0.5) * 100;
      speedPoints = (100 - countedValue) / 10;
    } else {
      // Completed after 150% of expected duration
      speedPoints = 0;
    }

    // Ensure speedPoints stays within [0, 10] and is rounded to a whole number
    const finalSpeedPoints = Math.max(0, Math.min(10, Math.round(speedPoints)));

    const totalPoints = accuracyPoints + deadlinePoints + finalSpeedPoints;

    // In production:
    // Update user profile XP and update the leaderboard DB document in Firestore/SQL
    // const userRef = db.collection('users').doc(userId);
    // await db.runTransaction(...)

    return NextResponse.json({
      success: true,
      data: {
        userId,
        taskId,
        pointsBreakdown: {
          accuracyPoints,
          deadlinePoints,
          speedPoints: finalSpeedPoints,
        },
        totalPointsEarned: totalPoints,
        newXPLevelProgress: {
          xpGained: totalPoints,
          message: `Earned ${totalPoints} XP!`,
        },
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

