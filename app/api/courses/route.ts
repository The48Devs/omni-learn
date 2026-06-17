import { NextResponse } from "next/server";

// Mock database storage
const mockCourses = [
  {
    id: "course-1",
    title: "Advanced Quantum Mechanics",
    category: "Physics",
    accessibilityCompliant: true,
  },
  {
    id: "course-2",
    title: "Cellular Biology & Genetics",
    category: "Biology",
    accessibilityCompliant: true,
  },
  {
    id: "course-3",
    title: "Industrial Revolution & Modernity",
    category: "History",
    accessibilityCompliant: true,
  },
];

export async function GET() {
  try {
    // In production: fetch from your Firestore / SQL DB here
    return NextResponse.json({ success: true, courses: mockCourses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, accessibilityCompliant } = body;

    if (!title || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, category" },
        { status: 400 }
      );
    }

    const newCourse = {
      id: `course-${Date.now()}`,
      title,
      category,
      accessibilityCompliant: !!accessibilityCompliant,
    };

    // In production: save to your database here
    mockCourses.push(newCourse);

    return NextResponse.json({ success: true, course: newCourse }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
