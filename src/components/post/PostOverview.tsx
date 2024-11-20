'use client';

import { useState } from 'react';
import { PostList } from '@/components/post/PostList';
import { PostDialog } from '@/components/post/PostDialog';
import { Post } from '@/components/calendar/Calendar';
import { usePostStore } from '@/store/postStore';

export function PostOverview() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { posts, updatePost, deletePost } = usePostStore();

  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };

  const handleDeletePost = (postId: string) => {
    deletePost(postId);
  };

  const handleSavePost = (updatedPost: Post) => {
    updatePost(updatedPost);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Schedule Overview</h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <PostList
            posts={posts}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
          />
        </div>
      </div>

      <PostDialog
        post={selectedPost}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSavePost}
        onDelete={handleDeletePost}
      />
    </div>
  );
}
