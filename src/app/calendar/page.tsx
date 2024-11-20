'use client';

import { Calendar } from '@/components/calendar/Calendar';
import { useState } from 'react';
import type { Post } from '@/components/calendar/Calendar';

// Sample data for testing
const initialPosts = [
  {
    id: '1',
    title: 'Product Launch Tweet',
    content: 'Excited to announce our new feature...',
    platform: 'twitter',
    status: 'ready',
    scheduledTime: new Date('2024-01-20T10:00:00'),
    tags: ['product', 'launch'],
  },
  {
    id: '2',
    title: 'Feature Update Post',
    content: 'Check out our latest improvements...',
    platform: 'linkedin',
    status: 'draft',
    scheduledTime: new Date('2024-01-20T14:30:00'),
    tags: ['update', 'feature'],
  },
  {
    id: '3',
    title: 'Behind the Scenes',
    content: 'Take a look at our team...',
    platform: 'instagram',
    status: 'needs-review',
    scheduledTime: new Date('2024-01-21T09:00:00'),
    tags: ['team', 'culture'],
  },
] as const;

export default function CalendarPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts as Post[]);

  // Generate a simple unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const handleCreatePost = (postData: Omit<Post, 'id'>) => {
    const newPost: Post = {
      id: generateId(),
      ...postData,
    };
    setPosts((prevPosts) => [...prevPosts, newPost]);
  };

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  return (
    <main className="flex min-h-screen flex-col p-4 sm:p-8">
      <Calendar
        posts={posts}
        onCreatePost={handleCreatePost}
        onUpdatePost={handleUpdatePost}
        onDeletePost={handleDeletePost}
      />
    </main>
  );
}