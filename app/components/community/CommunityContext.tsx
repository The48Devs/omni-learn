"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Post, Reply, User, Category } from './types';
import {
  MOCK_POSTS,
  MOCK_REPLIES,
  MOCK_USERS,
  MOCK_CATEGORIES,
  CURRENT_USER_ID,
} from './mockData';

interface CommunityContextValue {
  posts: Post[];
  replies: Reply[];
  users: User[];
  categories: Category[];
  currentUserId: string;
  getUser: (userId: string) => User | undefined;
  getPost: (postId: string) => Post | undefined;
  getCategory: (categoryId: string) => Category | undefined;
  getRepliesForPost: (postId: string) => Reply[];
  getPostsByUser: (userId: string) => Post[];
  getRepliesByUser: (userId: string) => Reply[];
  getPostsByCategory: (categoryId: string) => Post[];
  getTopContributors: (limit?: number) => User[];
  upvotePost: (postId: string) => void;
  upvoteReply: (replyId: string) => void;
  toggleBookmark: (postId: string) => void;
  incrementViews: (postId: string) => void;
  markResolved: (postId: string, acceptedReplyId: string) => void;
  addReply: (postId: string, content: string, parentId?: string) => void;
  addPost: (data: { title: string; content: string; categoryId: string; tags: string[]; courseId?: string }) => string;
  deleteReply: (replyId: string) => void;
}

const CommunityContext = createContext<CommunityContextValue | null>(null);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [replies, setReplies] = useState<Reply[]>(MOCK_REPLIES);
  const [users] = useState<User[]>(MOCK_USERS);
  const [categories] = useState<Category[]>(MOCK_CATEGORIES);
  const currentUserId = CURRENT_USER_ID;

  const getUser = useCallback((userId: string) => users.find(u => u.id === userId), [users]);
  const getPost = useCallback((postId: string) => posts.find(p => p.id === postId), [posts]);
  const getCategory = useCallback((categoryId: string) => categories.find(c => c.id === categoryId), [categories]);
  const getRepliesForPost = useCallback((postId: string) => replies.filter(r => r.postId === postId), [replies]);
  const getPostsByUser = useCallback((userId: string) => posts.filter(p => p.authorId === userId), [posts]);
  const getRepliesByUser = useCallback((userId: string) => replies.filter(r => r.authorId === userId), [replies]);
  const getPostsByCategory = useCallback((categoryId: string) => posts.filter(p => p.categoryId === categoryId), [posts]);
  const getTopContributors = useCallback((limit = 5) => [...users].sort((a, b) => b.points - a.points).slice(0, limit), [users]);

  const upvotePost = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      const hasVoted = post.upvotedBy.includes(currentUserId);
      return { ...post, upvotes: hasVoted ? post.upvotes - 1 : post.upvotes + 1, upvotedBy: hasVoted ? post.upvotedBy.filter(id => id !== currentUserId) : [...post.upvotedBy, currentUserId] };
    }));
  }, [currentUserId]);

  const upvoteReply = useCallback((replyId: string) => {
    setReplies(prev => prev.map(reply => {
      if (reply.id !== replyId) return reply;
      const hasVoted = reply.upvotedBy.includes(currentUserId);
      return { ...reply, upvotes: hasVoted ? reply.upvotes - 1 : reply.upvotes + 1, upvotedBy: hasVoted ? reply.upvotedBy.filter(id => id !== currentUserId) : [...reply.upvotedBy, currentUserId] };
    }));
  }, [currentUserId]);

  const toggleBookmark = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      const isBookmarked = post.bookmarkedBy.includes(currentUserId);
      return { ...post, bookmarkedBy: isBookmarked ? post.bookmarkedBy.filter(id => id !== currentUserId) : [...post.bookmarkedBy, currentUserId] };
    }));
  }, [currentUserId]);

  const incrementViews = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => post.id === postId ? { ...post, views: post.views + 1 } : post));
  }, []);

  const markResolved = useCallback((postId: string, acceptedReplyId: string) => {
    setPosts(prev => prev.map(post => post.id === postId ? { ...post, status: 'resolved' as const } : post));
    setReplies(prev => prev.map(reply => ({ ...reply, isAccepted: reply.id === acceptedReplyId ? !reply.isAccepted : false })));
  }, []);

  const addReply = useCallback((postId: string, content: string, parentId?: string) => {
    const newReply: Reply = { id: `reply-${Date.now()}`, postId, authorId: currentUserId, content, upvotes: 0, upvotedBy: [], isAccepted: false, createdAt: new Date().toISOString(), parentId };
    setReplies(prev => [...prev, newReply]);
    // reply count is derived; no need to store it
  }, [currentUserId]);

  const addPost = useCallback((data: { title: string; content: string; categoryId: string; tags: string[]; courseId?: string }): string => {
    const id = `post-${Date.now()}`;
    const newPost: Post = { id, title: data.title, content: data.content, authorId: currentUserId, categoryId: data.categoryId, tags: data.tags, status: 'unanswered', upvotes: 0, upvotedBy: [], views: 0, createdAt: new Date().toISOString(), isPinned: false, bookmarkedBy: [], courseId: data.courseId };
    setPosts(prev => [newPost, ...prev]);
    return id;
  }, [currentUserId]);

  const deleteReply = useCallback((replyId: string) => {
    setReplies(prev => prev.filter(r => r.id !== replyId));
  }, []);

  return (
    <CommunityContext.Provider value={{ posts, replies, users, categories, currentUserId, getUser, getPost, getCategory, getRepliesForPost, getPostsByUser, getRepliesByUser, getPostsByCategory, getTopContributors, upvotePost, upvoteReply, toggleBookmark, incrementViews, markResolved, addReply, addPost, deleteReply }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error('useCommunity must be used within CommunityProvider');
  return ctx;
}
