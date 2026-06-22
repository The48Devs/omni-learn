import { NextResponse } from "next/server";

interface StreakPayload {
  userId: string;
  activityDate: string; // ISO date string
  currentStreak: number; // passed from client for mock purposes
  lastActiveDate: string | null; // passed from client for mock purposes
}

export async function POST(request: Request) {
  try {
    const body: StreakPayload = await request.json();
    const { userId, activityDate, currentStreak, lastActiveDate } = body;

    if (!userId || !activityDate || currentStreak === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: userId, activityDate, or currentStreak" },
        { status: 400 }
      );
    }

    const activityTime = new Date(activityDate);
    if (isNaN(activityTime.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid activityDate format" },
        { status: 400 }
      );
    }

    // Normalize to midnight UTC to compare calendar days
    const normalizeDate = (d: Date) => {
      return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    };

    const activityDay = normalizeDate(activityTime);
    let newStreak = currentStreak;
    let streakUpdated = false;
    let message = "Activity recorded. Keep it up!";

    if (!lastActiveDate) {
      // First activity ever
      newStreak = 1;
      streakUpdated = true;
      message = "Streak started! 1 day.";
    } else {
      const lastActiveTime = new Date(lastActiveDate);
      if (isNaN(lastActiveTime.getTime())) {
        return NextResponse.json(
          { success: false, error: "Invalid lastActiveDate format" },
          { status: 400 }
        );
      }

      const lastActiveDay = normalizeDate(lastActiveTime);
      const diffTime = Math.abs(activityDay.getTime() - lastActiveDay.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Activity on the same day, streak doesn't increase but is maintained
        streakUpdated = false;
        message = "Activity recorded for today. Come back tomorrow to increase your streak!";
      } else if (diffDays === 1) {
        // Consecutive day
        newStreak = currentStreak + 1;
        streakUpdated = true;
        message = `Streak increased to ${newStreak} days! 🔥`;
      } else {
        // Missed a day or more
        newStreak = 1;
        streakUpdated = true;
        message = "Streak reset. 1 day. Let's build it back up!";
      }
    }

    // In production with actual Firebase Admin:
    // const userRef = db.collection('users').doc(userId);
    // await userRef.update({ streak: newStreak, lastActiveDate: activityDate });

    return NextResponse.json({
      success: true,
      data: {
        userId,
        previousStreak: currentStreak,
        newStreak,
        streakUpdated,
        lastActiveDate: activityDate,
        message,
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
