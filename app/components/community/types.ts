export type PostStatus = 'unanswered' | 'resolved' | 'announcement' | 'discussion';
export type SortOption = 'latest' | 'popular' | 'views';
export type FilterOption = 'all' | 'unanswered' | 'resolved' | 'course-specific' | 'announcements';

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export interface ActiveCourse {
  id: string;
  name: string;
  module: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  points: number;
  bio: string;
  joinDate: string;
  postCount: number;
  replyCount: number;
  helpfulCount: number;
  activeCourses: ActiveCourse[];
  badges: Badge[];
  streak: number;
  lastActiveDate: string;
}

export interface Reply {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  upvotes: number;
  upvotedBy: string[];
  isAccepted: boolean;
  createdAt: string;
  parentId?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  categoryId: string;
  tags: string[];
  status: PostStatus;
  upvotes: number;
  upvotedBy: string[];
  views: number;
  createdAt: string;
  isPinned: boolean;
  bookmarkedBy: string[];
  courseId?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}
